'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '電子郵件或密碼錯誤' }
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
