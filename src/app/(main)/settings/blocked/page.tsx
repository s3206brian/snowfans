import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { UnblockButton } from './UnblockButton'

export const metadata = { title: '封鎖名單' }

export default async function BlockedUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: blocked } = await supabase
    .from('blocked_users')
    .select('blocked_id, created_at')
    .eq('blocker_id', user.id)
    .order('created_at', { ascending: false })

  const blockedIds = (blocked ?? []).map((b) => b.blocked_id)

  const { data: profiles } = blockedIds.length > 0
    ? await supabase.from('profiles').select('id, username, display_name, avatar_url').in('id', blockedIds)
    : { data: [] }

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/settings" className="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold">封鎖名單</h1>
      </div>

      {blockedIds.length === 0 ? (
        <p className="text-slate-500 text-center mt-20 text-sm">沒有封鎖任何用戶</p>
      ) : (
        <div className="space-y-2">
          {(blocked ?? []).map((b) => {
            const p = profileMap[b.blocked_id]
            if (!p) return null
            return (
              <div key={b.blocked_id}
                className="flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3">
                <Avatar src={p.avatar_url} name={p.display_name ?? p.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.display_name ?? p.username}</p>
                  <p className="text-xs text-slate-500">@{p.username}</p>
                </div>
                <UnblockButton targetUserId={b.blocked_id} />
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
