import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { accountBadge } from '@/lib/utils/accountTypes'
import type { Profile, Tag, TripStatus } from '@/lib/types'

type Props = {
  profile: Profile & { tags: Tag[] }
}

const STATUS_CONFIG: Record<TripStatus, { label: string; cls: string }> = {
  teaching:      { label: '可教學', cls: 'bg-blue-600 text-white' },
  learning:      { label: '找教練', cls: 'bg-amber-600 text-white' },
  finding_buddy: { label: '找雪伴', cls: 'bg-emerald-600 text-white' },
}

const COVER_GRADIENT: Record<TripStatus, string> = {
  teaching:      'from-blue-900 to-slate-900',
  learning:      'from-amber-900 to-slate-900',
  finding_buddy: 'from-emerald-900 to-slate-900',
}

export function ProfilePreviewCard({ profile }: Props) {
  const status = profile.trip_status as TripStatus | null
  const name = profile.display_name ?? profile.username
  const coverGradient = status ? COVER_GRADIENT[status] : 'from-slate-800 to-slate-900'
  const badge = accountBadge(profile.account_type)

  return (
    <Link
      href={`/${profile.username}`}
      className="block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:-translate-y-0.5 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/40 transition-all"
    >
      {/* Cover */}
      <div className={`h-20 bg-gradient-to-r ${coverGradient} relative`}>
        {status && (
          <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_CONFIG[status].cls}`}>
            {STATUS_CONFIG[status].label}
          </span>
        )}
        <div className="absolute bottom-[-20px] left-4">
          <div className="ring-4 ring-slate-900 rounded-full">
            <Avatar src={profile.avatar_url} name={name} size="md" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-7 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">{name}</h3>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.badgeCls}`}>
              {badge.emoji} {badge.label}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs mt-0.5">@{profile.username}</p>
        {profile.bio && (
          <p className="text-slate-300 text-sm mt-2 line-clamp-2 leading-relaxed">{profile.bio}</p>
        )}
        {profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.tags.slice(0, 4).map((tag) => (
              <span key={tag.id} className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full text-xs">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
