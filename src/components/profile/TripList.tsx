import type { Trip, Resort } from '@/lib/types'

type TripWithResort = Trip & { resort: Resort | null }

type Props = {
  trips: TripWithResort[]
  isOwner?: boolean
}

const STATUS_CONFIG = {
  teaching:      { label: '可教學', cls: 'bg-blue-600 text-white' },
  finding_buddy: { label: '找雪伴', cls: 'bg-emerald-600 text-white' },
  learning:      { label: '找教練', cls: 'bg-amber-600 text-white' },
}

function formatDateRange(start: string, end: string | null) {
  const s = new Date(start)
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}`
  if (!end) return fmt(s)
  const e = new Date(end)
  if (s.getFullYear() !== e.getFullYear())
    return `${s.getFullYear()}/${fmt(s)} – ${e.getFullYear()}/${fmt(e)}`
  return `${s.getFullYear()} ${fmt(s)} – ${fmt(e)}`
}

export function TripList({ trips, isOwner }: Props) {
  const now = new Date()
  const upcoming = trips.filter((t) => new Date(t.start_date) >= now)
  const past = trips.filter((t) => new Date(t.start_date) < now)

  if (trips.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">行程</h2>
        <p className="text-sm text-slate-600">尚未建立任何行程</p>
        {isOwner && (
          <a href="/trips/new" className="inline-block mt-2 text-xs text-blue-400 hover:underline">
            + 新增行程
          </a>
        )}
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          行程 · {trips.length} 筆
        </h2>
        {isOwner && (
          <a href="/trips/new" className="text-xs text-blue-400 hover:underline">
            + 新增
          </a>
        )}
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">即將出發</p>
          {upcoming.map((trip) => <TripCard key={trip.id} trip={trip} isOwner={isOwner} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">過往行程</p>
          {past.map((trip) => <TripCard key={trip.id} trip={trip} isOwner={isOwner} isPast />)}
        </div>
      )}
    </section>
  )
}

function TripCard({ trip, isOwner, isPast }: { trip: TripWithResort; isOwner?: boolean; isPast?: boolean }) {
  const status = STATUS_CONFIG[trip.status]
  const resortLabel = trip.resort?.name_zh ?? trip.resort?.name ?? trip.resort_name ?? '未指定雪場'

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${isPast ? 'border-slate-800 opacity-60' : 'border-slate-700 bg-slate-900'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${status.cls}`}>
              {status.label}
            </span>
            <span className="text-sm font-semibold text-white truncate">{resortLabel}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {formatDateRange(trip.start_date, trip.end_date)}
          </p>
          {trip.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{trip.description}</p>
          )}
        </div>
        {isOwner && (
          <a href={`/trips/${trip.id}/delete`} className="shrink-0 text-slate-600 hover:text-rose-400 transition-colors text-xs">
            刪除
          </a>
        )}
      </div>
    </div>
  )
}
