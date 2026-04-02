'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  username?: string | null
}

export function BottomNav({ username }: Props) {
  const pathname = usePathname()

  const links = [
    {
      href: '/explore',
      label: '探索',
      icon: CompassIcon,
      active: pathname.startsWith('/explore'),
    },
    {
      href: '/messages',
      label: '私訊',
      icon: MessageIcon,
      active: pathname.startsWith('/messages'),
    },
    {
      href: username ? `/${username}` : '/login',
      label: '我的名片',
      icon: UserIcon,
      active: username ? pathname === `/${username}` : false,
    },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/80 z-50">
      <div className="flex h-14 max-w-lg mx-auto">
        {links.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon active={active} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function CompassIcon({ active }: { active: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 2} className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function MessageIcon({ active }: { active: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 2} className="h-5 w-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.5 : 2} className="h-5 w-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
