'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  username?: string | null
}

export function BottomNav({ username }: Props) {
  const pathname = usePathname()

  const links = [
    { href: '/explore', label: '探索', icon: SearchIcon },
    {
      href: username ? `/${username}` : '/login',
      label: '個人',
      icon: UserIcon,
    },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex h-14 max-w-lg mx-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/explore'
            ? pathname.startsWith('/explore')
            : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                active ? 'text-sky-600' : 'text-gray-400'
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      className="h-5 w-5"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
