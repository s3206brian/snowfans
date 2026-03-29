import { ReactNode } from 'react'

type BadgeVariant = 'sky' | 'green' | 'amber' | 'gray' | 'rose' | 'blue' | 'emerald' | 'orange'

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
}

const variantMap: Record<BadgeVariant, string> = {
  sky:     'bg-sky-900/40 text-sky-400 border border-sky-800/50',
  green:   'bg-green-900/40 text-green-400 border border-green-800/50',
  amber:   'bg-amber-900/40 text-amber-400 border border-amber-800/50',
  gray:    'bg-slate-800 text-slate-300 border border-slate-700',
  rose:    'bg-rose-900/40 text-rose-400 border border-rose-800/50',
  blue:    'bg-blue-900/40 text-blue-400 border border-blue-800/50',
  emerald: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50',
  orange:  'bg-orange-900/40 text-orange-400 border border-orange-800/50',
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variantMap[variant]}`}>
      {children}
    </span>
  )
}
