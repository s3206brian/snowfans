'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isValidUsername, safeUsername } from '@/lib/utils/reservedUsernames'

export type AuthState = {
  error?: string
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '請填寫電子郵件和密碼' }
  }

  const supabase = await createClient()
  const { error, data } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '電子郵件或密碼錯誤' }
  }

  // Ensure profile exists (trigger may have failed on signup)
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, eula_accepted_at')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!profile) {
      const emailPrefix = (data.user.email ?? '').split('@')[0]
      const base = safeUsername(emailPrefix.replace(/[^a-zA-Z0-9]/g, '') || `user${Date.now()}`)
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: base,
        short_link: base.toLowerCase(),
        display_name: data.user.user_metadata?.full_name ?? emailPrefix,
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
        eula_accepted_at: new Date().toISOString(),
      })
    } else if (!profile.eula_accepted_at) {
      // 登入頁已顯示同意條款聲明，登入即代表同意
      await supabase
        .from('profiles')
        .update({ eula_accepted_at: new Date().toISOString() })
        .eq('id', data.user.id)
    }
  }

  redirect('/explore')
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = (formData.get('username') as string | null)?.trim()

  if (!email || !password) {
    return { error: '請填寫電子郵件和密碼' }
  }
  if (password.length < 8) {
    return { error: '密碼至少需要 8 個字元' }
  }
  if (username && !isValidUsername(username)) {
    return { error: '使用者名稱限 3–30 個英數字或底線，且不可使用保留字' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || undefined },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: '此電子郵件已被使用' }
    }
    return { error: '註冊失敗，請稍後再試' }
  }

  return { error: undefined }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
