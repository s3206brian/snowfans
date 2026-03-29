import type { ResortVisit, Resort } from '@/lib/types'
import { formatVisitYear } from '@/lib/utils/formatters'

type VisitWithResort = ResortVisit & { resort: Resort }

type Props = {
  visits: VisitWithResort[]
}

export function ResortFootprint({ visits }: Props) {
  if (visits.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">雪場足跡</h2>
        <p className="text-sm text-slate-600">尚未記錄任何雪場</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        雪場足跡 · {visits.length} 座
      </h2>
      <ul className="space-y-2">
        {visits.map((v) => (
          <li key={v.id} className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-white">
                {v.resort.name_zh ?? v.resort.name}
              </p>
              <p className="text-xs text-slate-500">
                {v.resort.country}{v.resort.region ? ` · ${v.resort.region}` : ''}
              </p>
            </div>
            {v.visited_at && (
              <span className="text-xs text-slate-500">{formatVisitYear(v.visited_at)}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
