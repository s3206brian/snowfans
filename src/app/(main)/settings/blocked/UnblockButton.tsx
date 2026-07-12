'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { unblockUser } from '@/app/actions/safety'

export function UnblockButton({ targetUserId }: { targetUserId: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const result = await unblockUser(targetUserId)
      if (result.error) {
        alert(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
    >
      {pending ? '處理中...' : '解除封鎖'}
    </button>
  )
}
