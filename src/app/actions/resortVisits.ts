'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addResortVisit(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const resort_id = formData.get('resort_id') as string
  const visited_at = (formData.get('visited_at') as string) || null
  const snow_condition = (formData.get('snow_condition') as string) || null

  if (!resort_id) return { error: '請選擇雪場' }

  const { error } = await supabase.from('resort_visits').insert({
    profile_id: user.id,
    resort_id,
    visited_at,
    snow_condition: snow_condition as 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null,
  })

  if (error) return { error: error.message }

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
  return {}
}

export async function deleteResortVisit(visitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('resort_visits').delete().eq('id', visitId).eq('profile_id', user.id)

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}
