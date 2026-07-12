import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { TripStatusBadge } from '@/components/profile/TripStatusBadge'
import { ResortFootprint } from '@/components/profile/ResortFootprint'
import { EquipmentCard } from '@/components/profile/EquipmentCard'
import { TagList } from '@/components/profile/TagList'
import { TripList } from '@/components/profile/TripList'
import { CopyButton } from '@/components/profile/CopyButton'
import { PostList } from '@/components/profile/PostList'
import { PostForm } from '@/components/profile/PostForm'
import { SendMessageButton } from '@/components/profile/SendMessageButton'
import { ProfileMoreMenu } from '@/components/profile/ProfileMoreMenu'
import { FollowButton } from '@/components/profile/FollowButton'
import { getPrivacyLevel, canView } from '@/lib/utils/privacy'
import { accountBadge } from '@/lib/utils/accountTypes'
import type { TripStatus, ResortVisit, Resort, Tag, Trip, Post } from '@/lib/types'
import SupportPage from '../support/page'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  if (username === 'support') return { title: '支援中心' }
  return { title: `@${username}` }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  if (username === 'support') return <SupportPage />

  const supabase = await createClient()

  const [profileRes, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('*').eq('username', username).maybeSingle(),
    supabase.auth.getUser(),
  ])

  const profile = profileRes.data
  if (!profile) notFound()

  const isOwner = user?.id === profile.id

  const [followRes, followerCountRes, followingCountRes, blockedRes] = await Promise.all([
    user && !isOwner
      ? supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('following_id', profile.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id),
    user && !isOwner
      ? supabase.from('blocked_users').select('blocked_id').eq('blocker_id', user.id).eq('blocked_id', profile.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const isFollower = !!followRes.data
  const followerCount = followerCountRes.count ?? 0
  const followingCount = followingCountRes.count ?? 0
  const hasBlocked = !!blockedRes.data
  const showTripStatus = canView(
    getPrivacyLevel(profile.privacy_settings, 'trip_status'),
    isOwner,
    isFollower
  )

  const [visitsRes, equipmentRes, tagsRes, tripsRes, resortsRes, postsRes] = await Promise.all([
    supabase.from('resort_visits').select('*, resort:resorts(*), visit_runs(osm_id, run_name, difficulty)').eq('profile_id', profile.id).order('visited_at', { ascending: false }),
    supabase.from('equipment').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false }),
    supabase.from('profile_tags').select('tag:tags(*)').eq('profile_id', profile.id),
    supabase.from('trips').select('*, resort:resorts(*)').eq('profile_id', profile.id).order('start_date', { ascending: true }),
    supabase.from('resorts').select('*').order('name_zh'),
    supabase.from('posts').select('*, resort:resorts(*)').eq('profile_id', profile.id).order('created_at', { ascending: false }),
  ])

  const visits     = (visitsRes.data ?? []) as (ResortVisit & { resort: Resort })[]
  const equipment  = equipmentRes.data ?? []
  const tags       = (tagsRes.data ?? []).map((pt: { tag: Tag }) => pt.tag)
  const trips      = (tripsRes.data ?? []) as (Trip & { resort: Resort | null })[]
  const allResorts = (resortsRes.data ?? []) as Resort[]
  const posts      = (postsRes.data ?? []) as (Post & { resort: Resort | null })[]

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
              {isOwner ? (
                <Link href="/settings" className="shrink-0 rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors">
                  編輯
                </Link>
              ) : user && (
                <div className="flex items-center gap-1.5">
                  {!hasBlocked && (
                    <>
                      <FollowButton targetUserId={profile.id} initiallyFollowing={isFollower} />
                      <SendMessageButton targetUserId={profile.id} />
                    </>
                  )}
                  <ProfileMoreMenu
                    targetUserId={profile.id}
                    targetName={profile.display_name ?? profile.username}
                    initiallyBlocked={hasBlocked}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">@{profile.username}</p>
              {(() => {
                const badge = accountBadge(profile.account_type)
                return badge ? (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.badgeCls}`}>
                    {badge.emoji} {badge.label}
                  </span>
                ) : null
              })()}
            </div>
            {(profile.board_type || profile.years_experience) && (
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.board_type === 'snowboard' ? '單板' : profile.board_type === 'ski' ? '雙板' : profile.board_type === 'both' ? '單雙板' : ''}
                {profile.years_experience ? `${profile.board_type ? ' · ' : ''}${profile.years_experience} 年` : ''}
                {profile.instructor_cert ? ' · 教練資格' : ''}
              </p>
            )}
            {profile.trip_status && showTripStatus && (
              <div className="mt-1.5">
                <TripStatusBadge status={profile.trip_status as TripStatus} />
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1.5">
              <span className="text-slate-300 font-semibold">{followerCount}</span> 位追蹤者
              <span className="mx-1.5">·</span>
              追蹤 <span className="text-slate-300 font-semibold">{followingCount}</span> 人
            </p>
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
        <EquipmentCard equipment={equipment} isOwner={isOwner} userId={profile.id} />
        <div className="h-px bg-slate-800" />
        <PostList posts={posts} isOwner={isOwner} />
        {isOwner && (
          <PostForm resorts={allResorts} userId={profile.id} />
        )}
      </div>
    </main>
  )
}
