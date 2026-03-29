import { Badge } from '@/components/ui/Badge'
import type { TripStatus } from '@/lib/types'

type Props = { status: TripStatus }

const config: Record<TripStatus, { label: string; variant: 'blue' | 'emerald' | 'amber' }> = {
  teaching:      { label: '可教學', variant: 'blue' },
  learning:      { label: '找教練', variant: 'amber' },
  finding_buddy: { label: '找雪伴', variant: 'emerald' },
}

export function TripStatusBadge({ status }: Props) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
