type AvatarProps = {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-2xl',
}

const COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600',
  'bg-rose-600', 'bg-amber-600', 'bg-cyan-600',
]

function avatarColor(initial: string) {
  return COLORS[(initial.charCodeAt(0) ?? 0) % COLORS.length]
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name.trim()[0]?.toUpperCase() ?? '?'

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover`} />
    )
  }

  return (
    <div className={`${sizeMap[size]} ${avatarColor(initials)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}
