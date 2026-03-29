import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { TripStatusBadge } from '@/components/profile/TripStatusBadge'
import { Badge } from '@/components/ui/Badge'
import type { Profile, Tag, TripStatus } from '@/lib/types'

type Props = {
  profile: Profile & { tags: Tag[] }
}

export function ProfilePreviewCard({ profile }: Props) {
  return (
    <Link
      href={`/${profile.username}`}
      className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <Avatar
        src={profile.avatar_url}
        name={profile.display_name ?? profile.username}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">
            {profile.display_name ?? profile.username}
          </span>
          {profile.trip_status && (
            <TripStatusBadge status={profile.trip_status as TripStatus} />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">@{profile.username}</p>
        {profile.bio && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{profile.bio}</p>
        )}
        {profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {profile.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id} variant="gray">{tag.name}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
