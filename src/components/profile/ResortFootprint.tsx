import type { ResortVisit, Resort } from '@/lib/types'
import { formatVisitYear } from '@/lib/utils/formatters'
import { addResortVisit, deleteResortVisit } from '@/app/actions/resortVisits'

const SNOW_CONDITIONS = [
  { value: 'powder',   label: '粉雪 ❄️' },
  { value: 'groomed',  label: '整備 🎿' },
  { value: 'icy',      label: '冰硬 🧊' },
  { value: 'wet',      label: '濕雪 💧' },
  { value: 'variable', label: '多變 🌤' },
] as const

const SNOW_CONDITION_LABEL: Record<string, string> = {
  powder: '粉雪', groomed: '整備', icy: '冰硬', wet: '濕雪', variable: '多變',
}

type VisitWithResort = ResortVisit & { resort: Resort }

type Props = {
  visits: VisitWithResort[]
  allResorts?: Resort[]
  isOwner?: boolean
}

export function ResortFootprint({ visits, allResorts, isOwner }: Props) {
  const visitedIds = new Set(visits.map((v) => v.resort_id))
  const available = (allResorts ?? []).filter((r) => !visitedIds.has(r.id))

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        雪場足跡{visits.length > 0 ? ` · ${visits.length} 座` : ''}
      </h2>

      {visits.length === 0 && (
        <p className="text-sm text-slate-600 mb-3">尚未記錄任何雪場</p>
      )}

      {visits.length > 0 && (
        <ul className="space-y-2 mb-4">
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
              <div className="flex items-center gap-3">
                {v.snow_condition && (
                  <span className="text-xs text-slate-400">{SNOW_CONDITION_LABEL[v.snow_condition]}</span>
                )}
                {v.visited_at && (
                  <span className="text-xs text-slate-500">{formatVisitYear(v.visited_at)}</span>
                )}
                {isOwner && (
                  <form action={deleteResortVisit.bind(null, v.id)}>
                    <button type="submit" className="text-slate-600 hover:text-rose-400 transition-colors text-xs">
                      刪除
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOwner && available.length > 0 && (
        <form action={addResortVisit} className="flex gap-2">
          <select
            name="resort_id"
            required
            className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 min-w-0"
          >
            <option value="">選擇雪場...</option>
            {available.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name_zh ?? r.name} ({r.country})
              </option>
            ))}
          </select>
          <input
            name="visited_at"
            type="number"
            placeholder="年份"
            min="2000"
            max={new Date().getFullYear()}
            className="w-20 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
          />
          <select
            name="snow_condition"
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 min-w-0"
          >
            <option value="">雪況（選填）</option>
            {SNOW_CONDITIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            + 新增
          </button>
        </form>
      )}

      {isOwner && available.length === 0 && visits.length > 0 && (
        <p className="text-xs text-slate-600">已加入所有可用雪場</p>
      )}
    </section>
  )
}
