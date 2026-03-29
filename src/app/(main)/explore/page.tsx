import { createClient } from '@/lib/supabase/server'
import { ProfilePreviewCard } from '@/components/explore/ProfilePreviewCard'
import type { Profile, Tag, Trip, Resort } from '@/lib/types'

export const metadata = { title: '探索雪友 | SnowFans' }

type Props = {
  searchParams: Promise<{ q?: string; status?: string; tab?: string }>
}

const STATUS_FILTERS = [
  { value: '',              label: '全部',   cls: '' },
  { value: 'teaching',      label: '找教練', cls: 'text-blue-400 border-blue-800/50 bg-blue-900/40' },
  { value: 'finding_buddy', label: '找雪伴', cls: 'text-emerald-400 border-emerald-800/50 bg-emerald-900/40' },
  { value: 'learning',      label: '我想學', cls: 'text-amber-400 border-amber-800/50 bg-amber-900/40' },
]

const TRIP_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  teaching:      { label: '可教學', cls: 'bg-blue-900/40 text-blue-400 border-blue-800/50' },
  finding_buddy: { label: '找雪伴', cls: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' },
  learning:      { label: '找教練', cls: 'bg-amber-900/40 text-amber-400 border-amber-800/50' },
}

export default async function ExplorePage({ searchParams }: Props) {
  const { q, status, tab } = await searchParams
  const supabase = await createClient()
  const activeTab = tab === 'trips' ? 'trips' : 'people'

  // People query
  let query = supabase
    .from('profiles')
    .select('*, profile_tags(tag:tags(*))')
    .order('created_at', { ascending: false })
    .limit(40)

  if (q) query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%,bio.ilike.%${q}%`)
  if (status) query = query.eq('trip_status', status as 'teaching' | 'learning' | 'finding_buddy')

  // Trips query (upcoming public trips with finding_buddy or teaching)
  const today = new Date().toISOString().split('T')[0]
  const tripsQuery = supabase
    .from('trips')
    .select('*, resort:resorts(*), profile:profiles(id, username, display_name, avatar_url)')
    .eq('is_public', true)
    .in('status', ['finding_buddy', 'teaching'])
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(30)

  const [{ data: rows }, { data: tripsData }] = await Promise.all([query, tripsQuery])

  type ProfileRow = Profile & { profile_tags: { tag: Tag }[] }
  const profiles: (Profile & { tags: Tag[] })[] = (rows ?? []).map((row: ProfileRow) => ({
    ...row,
    tags: row.profile_tags.map((pt) => pt.tag),
  }))

  type TripRow = Trip & { resort: Resort | null; profile: { id: string; username: string; display_name: string | null; avatar_url: string | null } }
  const trips = (tripsData ?? []) as TripRow[]

  return (
    <main className="min-h-screen max-w-lg mx-auto pb-20">
      {/* Hero */}
      <div className="px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          尋找你的下一個<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">神隊友</span>
        </h1>
        <p className="mt-2 text-slate-400 text-sm">搜尋雪場、找教練、約滑雪伴</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        <a
          href={`/explore${q ? `?q=${encodeURIComponent(q)}` : ''}`}
          className={`flex-1 text-center rounded-xl py-2 text-sm font-bold transition-colors border ${
            activeTab === 'people'
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          雪友
        </a>
        <a
          href={`/explore?tab=trips${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`flex-1 text-center rounded-xl py-2 text-sm font-bold transition-colors border ${
            activeTab === 'trips'
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          找行程
        </a>
      </div>

      {activeTab === 'people' && (
        <>
          {/* Search */}
          <div className="px-4 mb-4">
            <form method="GET" action="/explore">
              {status && <input type="hidden" name="status" value={status} />}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  name="q"
                  defaultValue={q ?? ''}
                  type="search"
                  placeholder='試試搜尋「二世谷」或「教練」...'
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-500"
                />
              </div>
            </form>
          </div>

          {/* Status filters */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-2 mb-6">
            {STATUS_FILTERS.map(({ value, label, cls }) => {
              const isActive = (status ?? '') === value
              const href = `/explore${q ? `?q=${encodeURIComponent(q)}${value ? `&status=${value}` : ''}` : value ? `?status=${value}` : ''}`
              return (
                <a key={value} href={href}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                    isActive ? 'bg-blue-600 text-white border-blue-600'
                    : cls ? `${cls} hover:opacity-80`
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>

          <div className="px-4 mb-3">
            <p className="text-xs text-slate-500">
              {q || status
                ? `找到 ${profiles.length} 位雪友${q ? `，關鍵字「${q}」` : ''}${status ? `，篩選「${STATUS_FILTERS.find(f => f.value === status)?.label}」` : ''}`
                : '最新加入的雪友'}
            </p>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-5xl mb-4">🏔️</p>
              <p className="text-sm">找不到符合的雪友</p>
            </div>
          ) : (
            <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profiles.map((profile) => (
                <ProfilePreviewCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'trips' && (
        <div className="px-4">
          <p className="text-xs text-slate-500 mb-4">即將到來的公開行程 · {trips.length} 筆</p>

          {trips.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-5xl mb-4">🎿</p>
              <p className="text-sm">目前沒有公開行程</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => {
                const statusInfo = TRIP_STATUS_LABEL[trip.status]
                const resortName = trip.resort?.name_zh ?? trip.resort?.name ?? trip.resort_name ?? '未指定雪場'
                const startDate = new Date(trip.start_date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
                const endDate = trip.end_date
                  ? new Date(trip.end_date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
                  : null

                return (
                  <a key={trip.id} href={`/${trip.profile.username}`}
                    className="block rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{resortName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {startDate}{endDate ? ` – ${endDate}` : ''}
                        </p>
                        {trip.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{trip.description}</p>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                        {trip.profile.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={trip.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-white font-bold">
                            {(trip.profile.display_name ?? trip.profile.username).slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        @{trip.profile.username}
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
