export function formatVisitYear(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

export function formatVisitRange(start: string | null, end: string | null): string {
  if (!start) return ''
  const fmt = (d: string) => new Intl.DateTimeFormat('zh-Hant', { month: 'numeric', day: 'numeric' }).format(new Date(d))
  const year = new Date(start).getFullYear()
  if (!end || end === start) return `${year}/${fmt(start)}`
  return `${year}/${fmt(start)} – ${fmt(end)}`
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('zh-Hant', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(dateStr))
}

export function equipmentCategoryLabel(
  category: 'board' | 'skis' | 'boots' | 'helmet' | 'goggles' | 'outerwear' | 'other'
): string {
  const map: Record<typeof category, string> = {
    board: '單板',
    skis: '雙板',
    boots: '靴子',
    helmet: '安全帽',
    goggles: '護目鏡',
    outerwear: '外套',
    other: '其他',
  }
  return map[category]
}
