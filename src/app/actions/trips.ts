'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type TripState = { error?: string }

export async function createTrip(_prev: TripState, formData: FormData): Promise<TripState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const resort_name = (formData.get('resort_name') as string).trim() || null
  const start_date  = formData.get('start_date') as string
  const end_date    = (formData.get('end_date') as string) || null
  const status      = formData.get('status') as 'teaching' | 'finding_buddy' | 'learning'
  const description = (formData.get('description') as string).trim() || null

  if (!start_date) return { error: '請填寫出發日期' }
  if (!status)     return { error: '請選擇行程狀態' }

  const { error } = await supabase.from('trips').insert({
    profile_id: user.id,
    resort_name,
    start_date,
    end_date,
    status,
    description,
  })

  if (error) return { error: '新增失敗，請稍後再試' }

  // Redirect to own profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  redirect(`/${profile?.username ?? ''}`)
}

export async function updateTrip(
  tripId: string,
  _prev: TripState,
  formData: FormData
): Promise<TripState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const resort_name = (formData.get('resort_name') as string).trim() || null
  const start_date  = formData.get('start_date') as string
  const end_date    = (formData.get('end_date') as string) || null
  const status      = formData.get('status') as 'teaching' | 'finding_buddy' | 'learning'
  const description = (formData.get('description') as string).trim() || null

  if (!start_date) return { error: '請填寫出發日期' }
  if (!status)     return { error: '請選擇行程狀態' }

  const { error } = await supabase
    .from('trips')
    .update({ resort_name, start_date, end_date, status, description })
    .eq('id', tripId)
    .eq('profile_id', user.id)

  if (error) return { error: '更新失敗，請稍後再試' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  redirect(`/${profile?.username ?? ''}`)
}

export async function deleteTrip(tripId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('trips').delete().eq('id', tripId).eq('profile_id', user.id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  redirect(`/${profile?.username ?? ''}`)
}
