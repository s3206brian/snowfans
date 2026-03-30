'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addResortVisit(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const resort_id = formData.get('resort_id') as string
  const visited_at = (formData.get('visited_at') as string).trim() || null
  const visited_end = (formData.get('visited_end') as string).trim() || null
  const snow_condition = (formData.get('snow_condition') as string) || null

  if (!resort_id) return { error: '請選擇雪場' }

  const { data: visit, error } = await supabase.from('resort_visits').insert({
    profile_id: user.id,
    resort_id,
    visited_at,
    visited_end,
    snow_condition: snow_condition as 'powder' | 'groomed' | 'icy' | 'wet' | 'variable' | null,
  }).select('id').single()

  if (error) return { error: error.message }

  // Save selected runs
  const runsJson = formData.get('runs_json') as string
  if (runsJson && visit) {
    try {
      const runs = JSON.parse(runsJson) as { osm_id: string; name: string | null; difficulty: string | null }[]
      if (runs.length > 0) {
        await supabase.from('visit_runs').insert(
          runs.map((r) => ({
            visit_id: visit.id,
            osm_id: r.osm_id,
            run_name: r.name,
            difficulty: r.difficulty,
          }))
        )
      }
    } catch { /* ignore parse errors */ }
  }

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
