'use client'

import { useState, useTransition } from 'react'
import { updateEquipment } from '@/app/actions/equipment'
import type { Equipment } from '@/lib/types'

type Props = { item: Equipment }

export function EquipmentEditForm({ item }: Props) {
  const [open, setOpen] = useState(false)
  const [forSale, setForSale] = useState(item.for_sale)
  const [isPending, startTransition] = useTransition()

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
        編輯
      </button>
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateEquipment(item.id, data)
      setOpen(false)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2 border-t border-slate-700 pt-2">
      <div className="flex gap-2">
        <input name="brand" type="text" defaultValue={item.brand ?? ''} placeholder="品牌"
          className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
        <input name="model" type="text" defaultValue={item.model ?? ''} placeholder="型號"
          className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
        <input name="year" type="number" defaultValue={item.year ?? ''} placeholder="年份" min="2000" max={new Date().getFullYear()}
          className="w-20 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
      </div>
      <input name="notes" type="text" defaultValue={item.notes ?? ''} placeholder="備註"
        className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-slate-600"
      />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="for_sale" checked={forSale} onChange={(e) => setForSale(e.target.checked)}
            className="w-3.5 h-3.5 accent-blue-500 rounded" />
          <span className="text-xs text-slate-300">出售中</span>
        </label>
        {forSale && (
          <input name="sale_price" type="number" min="0" defaultValue={item.sale_price ?? ''} placeholder="售價 (TWD)"
            className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-slate-600"
          />
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)}
          className="flex-1 py-1.5 text-xs text-slate-500 hover:text-white transition-colors">
          取消
        </button>
        <button type="submit" disabled={isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 rounded-lg transition-colors disabled:opacity-60">
          {isPending ? '儲存中...' : '儲存'}
        </button>
      </div>
    </form>
  )
}
