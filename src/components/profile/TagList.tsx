import type { Tag } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'

type Props = {
  tags: Tag[]
}

const categoryVariant: Record<Tag['category'], 'sky' | 'green' | 'amber' | 'gray'> = {
  skill: 'sky',
  style: 'green',
  resort: 'amber',
  general: 'gray',
}

export function TagList({ tags }: Props) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag.id} variant={categoryVariant[tag.category]}>
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}
