'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addEquipment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const category = formData.get('category') as string
  const brand = (formData.get('brand') as string).trim() || null
  const model = (formData.get('model') as string).trim() || null
  const year = parseInt(formData.get('year') as string) || null
  const notes = (formData.get('notes') as string).trim() || null

  if (!category) return

  await supabase.from('equipment').insert({
    profile_id: user.id,
    category: category as 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other',
    brand,
    model,
    year,
    notes,
  })

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}

export async function deleteEquipment(equipmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('equipment').delete().eq('id', equipmentId).eq('profile_id', user.id)

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}
