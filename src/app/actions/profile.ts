'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type ProfileState = {
  error?: string
  success?: boolean
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const display_name     = (formData.get('display_name') as string).trim() || null
  const bio              = (formData.get('bio') as string).trim() || null
  const trip_status      = (formData.get('trip_status') as string) || null
  const board_type       = (formData.get('board_type') as string) || null
  const years_experience = parseInt(formData.get('years_experience') as string) || null
  const instructor_cert  = formData.get('instructor_cert') === 'on'
  const tag_ids          = formData.getAll('tag_ids') as string[]

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name,
      bio,
      trip_status: trip_status as 'teaching' | 'learning' | 'finding_buddy' | null,
      board_type: board_type as 'snowboard' | 'ski' | 'both' | null,
      years_experience,
      instructor_cert,
    })
    .eq('id', user.id)

  if (error) return { error: '儲存失敗，請稍後再試' }

  // Replace all profile tags
  await supabase.from('profile_tags').delete().eq('profile_id', user.id)
  if (tag_ids.length > 0) {
    await supabase.from('profile_tags').insert(
      tag_ids.map((tag_id) => ({ profile_id: user.id, tag_id }))
    )
  }

  redirect('/settings?saved=1')
}
