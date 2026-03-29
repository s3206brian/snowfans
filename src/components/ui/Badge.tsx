import { ReactNode } from 'react'

type BadgeVariant = 'sky' | 'green' | 'amber' | 'gray' | 'rose'

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
}

const variantMap: Record<BadgeVariant, string> = {
  sky: 'bg-sky-100 text-sky-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
  rose: 'bg-rose-100 text-rose-700',
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variantMap[variant]}`}>
      {children}
    </span>
  )
}
