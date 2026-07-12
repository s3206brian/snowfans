'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登入')

  const { data: blocked } = await supabase.rpc('blocked_between', {
    a: user.id,
    b: otherUserId,
  })
  if (blocked) throw new Error('無法與此用戶對話')

  const userA = user.id < otherUserId ? user.id : otherUserId
  const userB = user.id < otherUserId ? otherUserId : user.id

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_a', userA)
    .eq('user_b', userB)
    .maybeSingle()

  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ user_a: userA, user_b: userB })
    .select('id')
    .single()

  if (error || !created) throw new Error(error?.message ?? 'Failed to create conversation')
  return created.id
}

export async function sendMessage(conversationId: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登入')
  if (!body.trim()) return

  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, body: body.trim() })

  if (error) throw new Error('訊息傳送失敗')
  revalidatePath(`/messages/${conversationId}`)
}

export async function markMessagesRead(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .is('read_at', null)
}
