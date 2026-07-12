'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function followUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }
  if (user.id === targetUserId) return { error: '無法追蹤自己' }

  const { data: blocked } = await supabase.rpc('blocked_between', {
    a: user.id,
    b: targetUserId,
  })
  if (blocked) return { error: '無法追蹤此用戶' }

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: user.id, following_id: targetUserId })

  // 23505 = 已追蹤，視為成功
  if (error && error.code !== '23505') return { error: '追蹤失敗，請稍後再試' }
  revalidatePath('/', 'layout')
  return {}
}

export async function unfollowUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)

  if (error) return { error: '取消追蹤失敗，請稍後再試' }
  revalidatePath('/', 'layout')
  return {}
}
