'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const avatar_url = (formData.get('avatar_url') as string)?.trim()
  if (!avatar_url) return { error: '無效的圖片網址' }

  await supabase.from('profiles').update({ avatar_url }).eq('id', user.id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile) revalidatePath(`/${profile.username}`)
  revalidatePath('/settings')
}
