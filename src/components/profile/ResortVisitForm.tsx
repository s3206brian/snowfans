'use client'

import { useState, useTransition, useRef, useMemo } from 'react'
import { addResortVisit } from '@/app/actions/resortVisits'
import { ResortRunPicker } from '@/components/map/ResortRunPicker'
import type { Resort } from '@/lib/types'
import type { SkiRun } from '@/app/api/runs/route'

const SNOW_CONDITIONS = [
  { value: 'powder',   label: '粉雪 ❄️' },
  { value: 'groomed',  label: '整備 🎿' },
  { value: 'icy',      label: '冰硬 🧊' },
  { value: 'wet',      label: '濕雪 💧' },
  { value: 'variable', label: '多變 🌤' },
] as const

const COUNTRY_ZH: Record<string, string> = {
  Japan: '日本', 'South Korea': '韓國', China: '中國',
  Canada: '加拿大', USA: '美國', Switzerland: '瑞士',
  France: '法國', Australia: '澳洲', 'New Zealand': '紐西蘭',
}

type Props = { available: Resort[] }

export function ResortVisitForm({ available }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null)
  const [selectedRuns, setSelectedRuns] = useState<SkiRun[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const countries = useMemo(() =>
    [...new Set(available.map((r) => r.country))].sort(),
  [available])

  const regions = useMemo(() =>
    selectedCountry
      ? [...new Set(available.filter((r) => r.country === selectedCountry && r.region).map((r) => r.region!))]
      : [],
  [available, selectedCountry])

  const filteredResorts = useMemo(() =>
    available.filter((r) => {
      if (!selectedCountry) return false
      if (r.country !== selectedCountry) return false
      if (regions.length > 0 && selectedRegion && r.region !== selectedRegion) return false
      return true
    }),
  [available, selectedCountry, selectedRegion, regions])

  function reset() {
    setSelectedCountry('')
    setSelectedRegion('')
    setSelectedResort(null)
    setSelectedRuns([])
    setError(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    data.set('runs_json', JSON.stringify(selectedRuns.map((r) => ({
      osm_id: r.osm_id, name: r.name, difficulty: r.difficulty,
    }))))
    startTransition(async () => {
      const result = await addResortVisit(data)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
        reset()
        formRef.current?.reset()
      }
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-slate-700 py-2 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors">
        + 新增雪場足跡
      </button>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/50 p-3">

      {/* Step 1: Country */}
      <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedRegion(''); setSelectedResort(null) }}
        className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
        <option value="">選擇國家...</option>
        {countries.map((c) => (
          <option key={c} value={c}>{COUNTRY_ZH[c] ?? c}</option>
        ))}
      </select>

      {/* Step 2: Region */}
      {selectedCountry && regions.length > 0 && (
        <select value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedResort(null) }}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="">選擇地區...</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      )}

      {/* Step 3: Resort */}
      {selectedCountry && (regions.length === 0 || selectedRegion) && (
        <select name="resort_id" required
          onChange={(e) => setSelectedResort(filteredResorts.find((r) => r.id === e.target.value) ?? null)}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="">選擇雪場...</option>
          {filteredResorts.map((r) => (
            <option key={r.id} value={r.id}>{r.name_zh ?? r.name}</option>
          ))}
        </select>
      )}

      {/* Date range */}
      {selectedResort && (
        <>
          <div className="flex gap-2 items-center">
            <input name="visited_at" type="date" max={new Date().toISOString().split('T')[0]}
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-500 text-sm shrink-0">—</span>
            <input name="visited_end" type="date" max={new Date().toISOString().split('T')[0]}
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select name="snow_condition"
            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value="">雪況（選填）</option>
            {SNOW_CONDITIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {selectedResort.latitude && selectedResort.longitude && (
            <div>
              <p className="text-xs text-slate-500 mb-2">選擇你滑過的雪道（選填）</p>
              <ResortRunPicker
                lat={selectedResort.latitude}
                lon={selectedResort.longitude}
                onChange={setSelectedRuns}
              />
            </div>
          )}
        </>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={() => { setOpen(false); reset() }}
          className="flex-1 py-2 text-sm text-slate-500 hover:text-white transition-colors">
          取消
        </button>
        <button type="submit" disabled={isPending || !selectedResort}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-xl transition-colors disabled:opacity-40">
          {isPending ? '新增中...' : `新增${selectedRuns.length > 0 ? ` (${selectedRuns.length} 條)` : ''}`}
        </button>
      </div>
    </form>
  )
}
