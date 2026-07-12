import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatWindow } from './ChatWindow'
import { markMessagesRead } from '@/app/actions/messages'

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: convo } = await supabase
    .from('conversations')
    .select('id, user_a, user_b')
    .eq('id', id)
    .single()

  if (!convo || (convo.user_a !== user.id && convo.user_b !== user.id)) {
    redirect('/messages')
  }

  const otherId = convo.user_a === user.id ? convo.user_b : convo.user_a

  const [{ data: other }, { data: messages }, { data: blockedRow }] = await Promise.all([
    supabase.from('profiles').select('id, username, display_name').eq('id', otherId).single(),
    supabase.from('messages')
      .select('id, sender_id, body, created_at, read_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true }),
    supabase.from('blocked_users')
      .select('blocked_id')
      .eq('blocker_id', user.id)
      .eq('blocked_id', otherId)
      .maybeSingle(),
  ])

  await markMessagesRead(id)

  return (
    <ChatWindow
      conversationId={id}
      currentUserId={user.id}
      other={other}
      initialMessages={messages ?? []}
      initiallyBlocked={!!blockedRow}
    />
  )
}
