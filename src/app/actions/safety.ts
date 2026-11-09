'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyModerators } from '@/lib/moderation'
import { cleanText } from '@/lib/utils/contentFilter'

export type ReportState = {
  error?: string
  success?: boolean
}

export type ReportReason = 'inappropriate_content' | 'harassment' | 'spam' | 'other'

export async function blockUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }
  if (user.id === targetUserId) return { error: '無法封鎖自己' }

  const { error } = await supabase
    .from('blocked_users')
    .insert({ blocker_id: user.id, blocked_id: targetUserId })

  // 23505 = 已封鎖過，視為成功
  if (error && error.code !== '23505') return { error: '封鎖失敗，請稍後再試' }

  if (!error) {
    // Guideline 1.2：封鎖同時通知開發者，建立一筆待審核紀錄
    await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_id: targetUserId,
      content_type: 'profile',
      reason: 'other',
      details: '使用者封鎖了此帳號（自動建立，請審核此帳號內容）',
    })
    await notifyModerators(`🚫 封鎖通知：使用者 ${user.id} 封鎖了 ${targetUserId}，請於 24 小時內審核該帳號內容。`)
  }

  revalidatePath('/messages')
  revalidatePath('/settings/blocked')
  return {}
}

export async function unblockUser(targetUserId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', targetUserId)

  if (error) return { error: '解除封鎖失敗，請稍後再試' }

  revalidatePath('/messages')
  revalidatePath('/settings/blocked')
  return {}
}

export async function reportUser(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '請先登入' }

  const reported_id = (formData.get('reported_id') as string) || null
  const reason = formData.get('reason') as ReportReason | null
  const details = cleanText((formData.get('details') as string | null)?.trim() || null)
  const content_type = ((formData.get('content_type') as string) || 'profile') as
    'profile' | 'trip' | 'equipment' | 'message'

  if (!reported_id) return { error: '缺少檢舉對象' }
  if (!reason) return { error: '請選擇檢舉原因' }
  if (reported_id === user.id) return { error: '無法檢舉自己' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    reported_id,
    content_type,
    reason,
    details,
  })

  if (error) return { error: '檢舉送出失敗，請稍後再試' }

  await notifyModerators(
    `⚠️ 新檢舉：${content_type} / ${reason}\n被檢舉者：${reported_id}\n檢舉者：${user.id}` +
      (details ? `\n說明：${details}` : '') +
      '\n請於 24 小時內處理（移除內容並停權違規帳號）。'
  )
  return { success: true }
}
