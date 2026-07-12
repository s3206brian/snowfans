'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { SkiRun } from '@/app/api/runs/route'

const ResortMapInner = dynamic(
  () => import('./ResortMapInner').then((m) => m.ResortMapInner),
  { ssr: false, loading: () => <div className="w-full h-64 rounded-xl bg-slate-800 animate-pulse" /> }
)

const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  novice:       { label: '初級', color: 'text-green-400' },
  easy:         { label: '初中級', color: 'text-blue-400' },
  intermediate: { label: '中級', color: 'text-orange-400' },
  advanced:     { label: '高級', color: 'text-red-400' },
  expert:       { label: '專家', color: 'text-red-600' },
  freeride:     { label: '自由雪道', color: 'text-purple-400' },
}

type Props = {
  lat: number
  lon: number
  onChange: (selectedRuns: SkiRun[]) => void
}

export function ResortRunPicker({ lat, lon, onChange }: Props) {
  const [runs, setRuns] = useState<SkiRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<'map' | 'list'>('map')

  // 座標變更時在 render 期間重設載入狀態（避免在 effect 內同步 setState）
  const [prevCoords, setPrevCoords] = useState({ lat, lon })
  if (prevCoords.lat !== lat || prevCoords.lon !== lon) {
    setPrevCoords({ lat, lon })
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    let cancelled = false
    fetch(`/api/runs?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        if (!cancelled) setRuns(data.runs ?? [])
      })
      .catch(() => {
        if (!cancelled) setError('無法載入雪道資料')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [lat, lon])

  const toggle = useCallback((run: SkiRun) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(run.osm_id)) next.delete(run.osm_id)
      else next.add(run.osm_id)
      const selected = runs.filter((r) => next.has(r.osm_id))
      onChange(selected)
      return next
    })
  }, [runs, onChange])

  if (loading) {
    return <div className="w-full h-64 rounded-xl bg-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-sm">載入雪道中...</div>
  }

  if (error || runs.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-500 text-center">
        {error ?? '此雪場暫無雪道資料'}
      </div>
    )
  }

  const namedRuns = runs.filter((r) => r.name)
  const selectedRuns = runs.filter((r) => selectedIds.has(r.osm_id))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{runs.length} 條雪道 · 點選標記已滑過的</p>
        <div className="flex rounded-lg bg-slate-800 p-0.5 gap-0.5">
          {(['map', 'list'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>
              {t === 'map' ? '地圖' : '清單'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'map' && (
        <>
          {/* Leaflet requires explicit height */}
          <div className="h-64 rounded-xl overflow-hidden border border-slate-700">
            <ResortMapInner lat={lat} lon={lon} runs={runs} selectedIds={selectedIds} onToggle={toggle} />
          </div>
          <p className="text-xs text-slate-600 text-center">點擊地圖上的雪道線條來標記</p>
        </>
      )}

      {tab === 'list' && (
        <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
          {namedRuns.length === 0 && (
            <p className="text-xs text-slate-500 py-2 text-center">此雪場雪道無命名資料</p>
          )}
          {namedRuns.map((run) => {
            const isSelected = selectedIds.has(run.osm_id)
            const diff = DIFFICULTY_LABEL[run.difficulty ?? '']
            return (
              <button key={run.osm_id} type="button" onClick={() => toggle(run)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${isSelected ? 'bg-yellow-500/20 border border-yellow-500/40' : 'bg-slate-800 border border-slate-700 hover:border-slate-500'}`}>
                <span className={`font-medium ${isSelected ? 'text-yellow-300' : 'text-white'}`}>{run.name}</span>
                {diff && <span className={`text-xs ${diff.color}`}>{diff.label}</span>}
              </button>
            )
          })}
        </div>
      )}

      {selectedRuns.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedRuns.map((r) => (
            <span key={r.osm_id} className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-full px-2.5 py-0.5">
              {r.name ?? r.osm_id}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
