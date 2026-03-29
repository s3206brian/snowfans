import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { TripStatusBadge } from '@/components/profile/TripStatusBadge'
import { ResortFootprint } from '@/components/profile/ResortFootprint'
import { EquipmentCard } from '@/components/profile/EquipmentCard'
import { TagList } from '@/components/profile/TagList'
import { CopyButton } from '@/components/profile/CopyButton'
import type { TripStatus, ResortVisit, Resort, Tag } from '@/lib/types'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  return { title: `@${username}` }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const [profileRes, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('*').eq('username', username).maybeSingle(),
    supabase.auth.getUser(),
  ])

  const profile = profileRes.data
  if (!profile) notFound()

  const isOwner = user?.id === profile.id

  // Fetch related data in parallel
  const [visitsRes, equipmentRes, tagsRes] = await Promise.all([
    supabase
      .from('resort_visits')
      .select('*, resort:resorts(*)')
      .eq('profile_id', profile.id)
      .order('visited_at', { ascending: false }),
    supabase
      .from('equipment')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('profile_tags')
      .select('tag:tags(*)')
      .eq('profile_id', profile.id),
  ])

  const visits = (visitsRes.data ?? []) as (ResortVisit & { resort: Resort })[]
  const equipment = equipmentRes.data ?? []
  const tags = (tagsRes.data ?? []).map((pt: { tag: Tag }) => pt.tag)

  return (
    <main className="min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar
            src={profile.avatar_url}
            name={profile.display_name ?? profile.username}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-bold truncate">
                {profile.display_name ?? profile.username}
              </h1>
              {isOwner && (
                <a
                  href="/settings"
                  className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  編輯
                </a>
              )}
            </div>
            <p className="text-sm text-gray-400">@{profile.username}</p>
            {profile.trip_status && (
              <div className="mt-1.5">
                <TripStatusBadge status={profile.trip_status as TripStatus} />
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-3">
            <TagList tags={tags} />
          </div>
        )}

        {/* Share short link */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-xs text-gray-400 truncate flex-1">
            snowfans.app/{profile.short_link}
          </span>
          <CopyButton text={`https://snowfans.app/${profile.short_link}`} />
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Sections */}
      <div className="px-4 py-5 space-y-6">
        <ResortFootprint visits={visits} />
        <div className="h-px bg-gray-100" />
        <EquipmentCard equipment={equipment} />
      </div>
    </main>
  )
}
