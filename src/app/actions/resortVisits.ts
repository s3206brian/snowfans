'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addResortVisit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const resort_id = formData.get('resort_id') as string
  const visited_at = (formData.get('visited_at') as string) || null

  if (!resort_id) return

  await supabase.from('resort_visits').insert({ profile_id: user.id, resort_id, visited_at })

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}

export async function deleteResortVisit(visitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('resort_visits').delete().eq('id', visitId).eq('profile_id', user.id)

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}
