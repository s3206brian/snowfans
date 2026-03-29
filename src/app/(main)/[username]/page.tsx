import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { TripStatusBadge } from '@/components/profile/TripStatusBadge'
import { ResortFootprint } from '@/components/profile/ResortFootprint'
import { EquipmentCard } from '@/components/profile/EquipmentCard'
import { TagList } from '@/components/profile/TagList'
import { TripList } from '@/components/profile/TripList'
import { CopyButton } from '@/components/profile/CopyButton'
import type { TripStatus, ResortVisit, Resort, Tag, Trip } from '@/lib/types'

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

  const [visitsRes, equipmentRes, tagsRes, tripsRes, resortsRes] = await Promise.all([
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
    supabase
      .from('trips')
      .select('*, resort:resorts(*)')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: true }),
    supabase.from('resorts').select('*').order('name_zh'),
  ])

  const visits    = (visitsRes.data ?? []) as (ResortVisit & { resort: Resort })[]
  const equipment = equipmentRes.data ?? []
  const tags      = (tagsRes.data ?? []).map((pt: { tag: Tag }) => pt.tag)
  const trips     = (tripsRes.data ?? []) as (Trip & { resort: Resort | null })[]
  const allResorts = (resortsRes.data ?? []) as Resort[]

  return (
    <main className="min-h-screen max-w-lg mx-auto pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar src={profile.avatar_url} name={profile.display_name ?? profile.username} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-bold text-white truncate">
                {profile.display_name ?? profile.username}
              </h1>
              {isOwner && (
                <a href="/settings" className="shrink-0 rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors">
                  編輯
                </a>
              )}
            </div>
            <p className="text-sm text-slate-500">@{profile.username}</p>
            {(profile.board_type || profile.years_experience) && (
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.board_type === 'snowboard' ? '單板' : profile.board_type === 'ski' ? '雙板' : profile.board_type === 'both' ? '單雙板' : ''}
                {profile.years_experience ? `${profile.board_type ? ' · ' : ''}${profile.years_experience} 年` : ''}
                {profile.instructor_cert ? ' · 教練資格' : ''}
              </p>
            )}
            {profile.trip_status && (
              <div className="mt-1.5">
                <TripStatusBadge status={profile.trip_status as TripStatus} />
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">{profile.bio}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-3">
            <TagList tags={tags} />
          </div>
        )}

        {/* Share short link */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2">
          <span className="text-xs text-slate-500 truncate flex-1">
            snowfans.org/{profile.short_link}
          </span>
          <CopyButton text={`https://snowfans.org/${profile.short_link}`} />
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Sections */}
      <div className="px-4 py-5 space-y-6">
        <TripList trips={trips} isOwner={isOwner} />
        <div className="h-px bg-slate-800" />
        <ResortFootprint visits={visits} allResorts={allResorts} isOwner={isOwner} />
        <div className="h-px bg-slate-800" />
        <EquipmentCard equipment={equipment} isOwner={isOwner} />
      </div>
    </main>
  )
}
