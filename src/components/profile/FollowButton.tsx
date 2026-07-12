'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { followUser, unfollowUser } from '@/app/actions/follows'

type Props = {
  targetUserId: string
  initiallyFollowing: boolean
}

export function FollowButton({ targetUserId, initiallyFollowing }: Props) {
  const [following, setFollowing] = useState(initiallyFollowing)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const result = following
        ? await unfollowUser(targetUserId)
        : await followUser(targetUserId)
      if (result.error) {
        alert(result.error)
        return
      }
      setFollowing(!following)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        following
          ? 'border border-slate-700 text-slate-400 hover:bg-slate-800'
          : 'bg-white text-slate-950 hover:bg-slate-200'
      }`}
    >
      {pending ? '...' : following ? '追蹤中' : '追蹤'}
    </button>
  )
}
