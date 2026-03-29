import { Badge } from '@/components/ui/Badge'
import type { TripStatus } from '@/lib/types'

type Props = { status: TripStatus }

const config: Record<TripStatus, { label: string; variant: 'green' | 'sky' | 'amber' }> = {
  teaching: { label: '🎿 教學中', variant: 'green' },
  learning: { label: '📚 學習中', variant: 'sky' },
  finding_buddy: { label: '🤝 找雪友', variant: 'amber' },
}

export function TripStatusBadge({ status }: Props) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
