'use client'

import { useState } from 'react'
import { addResortVisit } from '@/app/actions/resortVisits'
import type { Resort } from '@/lib/types'

const SNOW_CONDITIONS = [
  { value: 'powder',   label: '粉雪 ❄️' },
  { value: 'groomed',  label: '整備 🎿' },
  { value: 'icy',      label: '冰硬 🧊' },
  { value: 'wet',      label: '濕雪 💧' },
  { value: 'variable', label: '多變 🌤' },
] as const

type Props = { available: Resort[] }

export function ResortVisitForm({ available }: Props) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-slate-700 py-2 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors"
      >
        + 新增雪場足跡
      </button>
    )
  }

  return (
    <form action={async (data) => { await addResortVisit(data); setOpen(false) }}
      className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/50 p-3">
      <select name="resort_id" required
        className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
        <option value="">選擇雪場...</option>
        {available.map((r) => (
          <option key={r.id} value={r.id}>{r.name_zh ?? r.name} ({r.country})</option>
        ))}
      </select>
      <div className="flex gap-2">
        <input name="visited_at" type="number" placeholder="年份" min="2000" max={new Date().getFullYear()}
          className="w-24 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
        <select name="snow_condition"
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="">雪況（選填）</option>
          {SNOW_CONDITIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)}
          className="flex-1 py-2 text-sm text-slate-500 hover:text-white transition-colors">
          取消
        </button>
        <button type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-xl transition-colors">
          新增
        </button>
      </div>
    </form>
  )
}
