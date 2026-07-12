'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'

export function FloatingMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-20 left-4 z-50 flex flex-col items-start gap-2">
      {open && (
        <>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-white shadow-lg hover:bg-slate-700 transition-colors"
          >
            <HomeIcon />
            首頁
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-rose-400 shadow-lg hover:bg-slate-700 transition-colors"
            >
              <LogoutIcon />
              登出
            </button>
          </form>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 shadow-lg flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
