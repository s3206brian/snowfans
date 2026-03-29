'use client'

import { useActionState } from 'react'
import { createTrip, type TripState } from '@/app/actions/trips'

const initialState: TripState = {}

const STATUS_OPTIONS = [
  { value: 'teaching',      label: '可教學 — 有空帶新手' },
  { value: 'finding_buddy', label: '找雪伴 — 約一起滑' },
  { value: 'learning',      label: '找教練 — 我想學習' },
]

export function NewTripForm() {
  const [state, action, isPending] = useActionState(createTrip, initialState)

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-xl bg-rose-900/30 border border-rose-800/50 px-4 py-3 text-sm text-rose-400">
          {state.error}
        </div>
      )}

      {/* Resort */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">雪場名稱</label>
        <input
          name="resort_name"
          type="text"
          placeholder="例：二世谷、野澤溫泉、苗場"
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">出發日期 <span className="text-rose-400">*</span></label>
          <input
            name="start_date"
            type="date"
            required
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">回程日期</label>
          <input
            name="end_date"
            type="date"
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">這次行程的狀態 <span className="text-rose-400">*</span></label>
        <div className="space-y-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={value}
                required
                className="accent-blue-500 w-4 h-4 shrink-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">補充說明（選填）</label>
        <textarea
          name="description"
          rows={3}
          placeholder="例：初學者友善，有教練資格，可協助租借裝備..."
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-600 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
      >
        {isPending ? '新增中...' : '建立行程'}
      </button>
    </form>
  )
}
