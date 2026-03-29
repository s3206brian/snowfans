import type { Equipment } from '@/lib/types'
import { equipmentCategoryLabel } from '@/lib/utils/formatters'

type Props = {
  equipment: Equipment[]
}

export function EquipmentCard({ equipment }: Props) {
  if (equipment.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">裝備庫</h2>
        <p className="text-sm text-slate-600">尚未記錄任何裝備</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        裝備庫 · {equipment.length} 件
      </h2>
      <ul className="space-y-2">
        {equipment.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-blue-400 bg-blue-900/30 border border-blue-800/50 rounded px-1.5 py-0.5">
                  {equipmentCategoryLabel(item.category)}
                </span>
                <p className="mt-1.5 text-sm font-medium text-white">
                  {item.brand ? `${item.brand} ` : ''}{item.model ?? '未命名'}
                </p>
                {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
              </div>
              {item.year && (
                <span className="text-xs text-slate-500 shrink-0 ml-2">{item.year}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
