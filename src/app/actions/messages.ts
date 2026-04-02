'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登入')

  const userA = user.id < otherUserId ? user.id : otherUserId
  const userB = user.id < otherUserId ? otherUserId : user.id

  const { data: existing } = await (supabase as any)
    .from('conversations')
    .select('id')
    .eq('user_a', userA)
    .eq('user_b', userB)
    .maybeSingle() as { data: { id: string } | null }

  if (existing) return existing.id

  const { data: created, error } = await (supabase as any)
    .from('conversations')
    .insert({ user_a: userA, user_b: userB })
    .select('id')
    .single() as { data: { id: string } | null; error: any }

  if (error) throw new Error(error.message)
  return created.id
}

export async function sendMessage(conversationId: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登入')
  if (!body.trim()) return

  const { error } = await (supabase as any)
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, body: body.trim() }) as { error: any }

  if (error) throw new Error(error.message)
  revalidatePath(`/messages/${conversationId}`)
}

export async function markMessagesRead(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await (supabase as any)
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .is('read_at', null)
}
