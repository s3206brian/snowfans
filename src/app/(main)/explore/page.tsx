import { createClient } from '@/lib/supabase/server'
import { ProfilePreviewCard } from '@/components/explore/ProfilePreviewCard'
import type { Profile, Tag } from '@/lib/types'

export const metadata = { title: '探索' }

type Props = {
  searchParams: Promise<{ q?: string; tag?: string }>
}

const QUICK_FILTER_TAGS = ['教學中', '找雪友', '學習中', '粉雪愛好者', '競速', '公園技巧']

export default async function ExplorePage({ searchParams }: Props) {
  const { q, tag } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*, profile_tags(tag:tags(*))')
    .order('created_at', { ascending: false })
    .limit(40)

  if (q) {
    query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
  }

  const { data: rows } = await query

  type ProfileRow = Profile & { profile_tags: { tag: Tag }[] }

  let profiles: (Profile & { tags: Tag[] })[] = (rows ?? []).map((row: ProfileRow) => ({
    ...row,
    tags: row.profile_tags.map((pt) => pt.tag),
  }))

  // Filter by tag name client-side (simple approach for MVP)
  if (tag) {
    profiles = profiles.filter((p) =>
      p.tags.some((t) => t.name.toLowerCase().includes(tag.toLowerCase()))
    )
  }

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Search form */}
      <form method="GET" action="/explore" className="mb-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            name="q"
            defaultValue={q ?? ''}
            type="search"
            placeholder="搜尋使用者名稱..."
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
          />
        </div>
      </form>

      {/* Quick filter tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <a
          href="/explore"
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !tag ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          全部
        </a>
        {QUICK_FILTER_TAGS.map((t) => (
          <a
            key={t}
            href={`/explore?${q ? `q=${encodeURIComponent(q)}&` : ''}tag=${encodeURIComponent(t)}`}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              tag === t
                ? 'bg-sky-500 text-white border-sky-500'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </a>
        ))}
      </div>

      {/* Results */}
      {q || tag ? (
        <p className="text-xs text-gray-400 mb-3">
          找到 {profiles.length} 位滑雪愛好者
          {q ? `，關鍵字「${q}」` : ''}
          {tag ? `，標籤「${tag}」` : ''}
        </p>
      ) : (
        <p className="text-xs text-gray-400 mb-3">最新加入的雪友</p>
      )}

      {profiles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏔️</p>
          <p className="text-sm">找不到符合的雪友</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <ProfilePreviewCard profile={profile} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
