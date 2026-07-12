'use client'

import { deleteAccount } from '@/app/actions/profile'

export function DeleteAccountButton() {
  return (
    <form action={deleteAccount}>
      <button
        type="submit"
        className="w-full rounded-xl border border-red-900/50 py-2.5 text-sm font-medium text-red-500 hover:bg-red-950/30 transition-colors"
        onClick={(e) => {
          if (!confirm('確定要永久刪除帳號嗎？此操作無法復原。')) e.preventDefault()
        }}
      >
        刪除帳號
      </button>
    </form>
  )
}
