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
  const image_urls = formData.getAll('image_urls') as string[]
  const for_sale = formData.get('for_sale') === 'on'
  const sale_price = parseFloat(formData.get('sale_price') as string) || null

  if (!category) return

  await supabase.from('equipment').insert({
    profile_id: user.id,
    category: category as 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other',
    brand,
    model,
    year,
    notes,
    image_urls,
    for_sale,
    sale_price,
  })

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath(`/${profile?.username}`)
}

export async function updateEquipment(equipmentId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const brand = (formData.get('brand') as string).trim() || null
  const model = (formData.get('model') as string).trim() || null
  const year = parseInt(formData.get('year') as string) || null
  const notes = (formData.get('notes') as string).trim() || null
  const for_sale = formData.get('for_sale') === 'on'
  const sale_price = parseFloat(formData.get('sale_price') as string) || null

  await supabase.from('equipment')
    .update({ brand, model, year, notes, for_sale, sale_price })
    .eq('id', equipmentId)
    .eq('profile_id', user.id)

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
