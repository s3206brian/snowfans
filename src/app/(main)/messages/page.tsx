import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: convos } = await (supabase as any)
    .from('conversations')
    .select(`
      id,
      user_a,
      user_b,
      messages(body, created_at, sender_id, read_at)
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' })

  const otherIds = (convos ?? []).map((c: any) =>
    c.user_a === user.id ? c.user_b : c.user_a
  )

  const { data: others } = otherIds.length > 0
    ? await supabase.from('profiles').select('id, username, display_name, avatar_url').in('id', otherIds)
    : { data: [] }

  const othersMap = Object.fromEntries((others ?? []).map((p: any) => [p.id, p]))

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">私訊</h1>

      {(!convos || convos.length === 0) && (
        <p className="text-slate-500 text-center mt-20">還沒有對話，到探索大廳找雪友開始聊吧！</p>
      )}

      <div className="flex flex-col gap-2">
        {(convos ?? []).map((c: any) => {
          const otherId = c.user_a === user.id ? c.user_b : c.user_a
          const other = othersMap[otherId]
          const lastMsg = c.messages?.[0]
          const unread = lastMsg && lastMsg.sender_id !== user.id && !lastMsg.read_at

          return (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-blue-300 font-bold text-lg flex-shrink-0">
                {(other?.display_name ?? other?.username ?? '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-sm">
                    {other?.display_name ?? other?.username ?? '用戶'}
                  </span>
                  {lastMsg && (
                    <span className="text-slate-500 text-xs">
                      {new Date(lastMsg.created_at).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate mt-0.5 ${unread ? 'text-white font-medium' : 'text-slate-500'}`}>
                  {lastMsg?.body ?? '開始對話'}
                </p>
              </div>
              {unread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
