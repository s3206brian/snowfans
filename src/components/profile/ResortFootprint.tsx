import type { ResortVisit, Resort } from '@/lib/types'
import { formatVisitRange } from '@/lib/utils/formatters'
import { deleteResortVisit } from '@/app/actions/resortVisits'
import { ResortVisitForm } from './ResortVisitForm'

type VisitRun = { osm_id: string; run_name: string | null; difficulty: string | null }
type VisitWithResort = ResortVisit & { resort: Resort; visit_runs?: VisitRun[] }

type Props = {
  visits: VisitWithResort[]
  allResorts?: Resort[]
  isOwner?: boolean
}

const SNOW_CONDITION_LABEL: Record<string, string> = {
  powder: '粉雪', groomed: '整備', icy: '冰硬', wet: '濕雪', variable: '多變',
}

const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  novice:       { label: '初', color: 'text-green-400' },
  easy:         { label: '初中', color: 'text-blue-400' },
  intermediate: { label: '中', color: 'text-orange-400' },
  advanced:     { label: '高', color: 'text-red-400' },
  expert:       { label: '專', color: 'text-red-600' },
}

function calcTotalDays(visits: VisitWithResort[]): number {
  return visits.reduce((sum, v) => {
    if (!v.visited_at) return sum + 1
    const start = new Date(v.visited_at)
    const end = v.visited_end ? new Date(v.visited_end) : start
    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
    return sum + days
  }, 0)
}

export function ResortFootprint({ visits, allResorts, isOwner }: Props) {
  const visitedIds = new Set(visits.map((v) => v.resort_id))
  const available = (allResorts ?? []).filter((r) => !visitedIds.has(r.id))
  const totalDays = visits.length > 0 ? calcTotalDays(visits) : 0

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          雪場足跡{visits.length > 0 ? ` · ${visits.length} 座` : ''}
        </h2>
        {totalDays > 0 && (
          <span className="text-xs text-blue-400 font-medium">
            雪齡 {totalDays} 天
          </span>
        )}
      </div>

      {visits.length === 0 && (
        <p className="text-sm text-slate-600 mb-3">尚未記錄任何雪場</p>
      )}

      {visits.length > 0 && (
        <ul className="space-y-2 mb-4">
          {visits.map((v) => (
            <li key={v.id} className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {v.resort.name_zh ?? v.resort.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {v.resort.country}{v.resort.region ? ` · ${v.resort.region}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {v.snow_condition && (
                    <span className="text-xs text-slate-400">{SNOW_CONDITION_LABEL[v.snow_condition]}</span>
                  )}
                  {v.visited_at && (
                    <span className="text-xs text-slate-500">{formatVisitRange(v.visited_at, v.visited_end ?? null)}</span>
                  )}
                  {isOwner && (
                    <form action={deleteResortVisit.bind(null, v.id)}>
                      <button type="submit" className="text-slate-600 hover:text-rose-400 transition-colors text-xs">
                        刪除
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {v.visit_runs && v.visit_runs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {v.visit_runs.map((r) => {
                    const diff = DIFFICULTY_LABEL[r.difficulty ?? '']
                    return (
                      <span key={r.osm_id}
                        className="inline-flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5 text-slate-300">
                        {r.run_name ?? r.osm_id}
                        {diff && <span className={`text-[10px] ${diff.color}`}>{diff.label}</span>}
                      </span>
                    )
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOwner && available.length > 0 && (
        <ResortVisitForm available={available} />
      )}

      {isOwner && available.length === 0 && visits.length > 0 && (
        <p className="text-xs text-slate-600">已加入所有可用雪場</p>
      )}
    </section>
  )
}
