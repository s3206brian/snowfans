import type { Equipment } from '@/lib/types'
import { equipmentCategoryLabel } from '@/lib/utils/formatters'
import { addEquipment, deleteEquipment } from '@/app/actions/equipment'

type Props = {
  equipment: Equipment[]
  isOwner?: boolean
}

const CATEGORIES = [
  'board', 'skis', 'boots', 'helmet', 'goggles', 'outerwear', 'other',
] as const

export function EquipmentCard({ equipment, isOwner }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        裝備庫{equipment.length > 0 ? ` · ${equipment.length} 件` : ''}
      </h2>

      {equipment.length === 0 && (
        <p className="text-sm text-slate-600 mb-3">尚未記錄任何裝備</p>
      )}

      {equipment.length > 0 && (
        <ul className="space-y-2 mb-4">
          {equipment.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-medium text-blue-400 bg-blue-900/30 border border-blue-800/50 rounded px-1.5 py-0.5">
                    {equipmentCategoryLabel(item.category)}
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {item.brand ? `${item.brand} ` : ''}{item.model ?? '未命名'}
                  </p>
                  {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.year && <span className="text-xs text-slate-500">{item.year}</span>}
                  {isOwner && (
                    <form action={deleteEquipment.bind(null, item.id)}>
                      <button type="submit" className="text-slate-600 hover:text-rose-400 transition-colors text-xs">
                        刪除
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <form action={addEquipment} className="space-y-2">
          <div className="flex gap-2">
            <select
              name="category"
              required
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">類型...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{equipmentCategoryLabel(c)}</option>
              ))}
            </select>
            <input
              name="year"
              type="number"
              placeholder="年份"
              min="2000"
              max={new Date().getFullYear()}
              className="w-24 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <input
              name="brand"
              type="text"
              placeholder="品牌（如 Burton）"
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
            <input
              name="model"
              type="text"
              placeholder="型號"
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <input
              name="notes"
              type="text"
              placeholder="備註（選填）"
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
            <button
              type="submit"
              className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              + 新增
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
