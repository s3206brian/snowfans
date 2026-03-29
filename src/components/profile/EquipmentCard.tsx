import type { Equipment } from '@/lib/types'
import { equipmentCategoryLabel } from '@/lib/utils/formatters'

type Props = {
  equipment: Equipment[]
}

export function EquipmentCard({ equipment }: Props) {
  if (equipment.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">裝備庫</h2>
        <p className="text-sm text-gray-400">尚未記錄任何裝備</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        裝備庫 · {equipment.length} 件
      </h2>
      <ul className="space-y-2">
        {equipment.map((item) => (
          <li key={item.id} className="rounded-xl border border-gray-100 px-3 py-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-sky-600 bg-sky-50 rounded px-1.5 py-0.5">
                  {equipmentCategoryLabel(item.category)}
                </span>
                <p className="mt-1 text-sm font-medium">
                  {item.brand ? `${item.brand} ` : ''}{item.model ?? '未命名'}
                </p>
                {item.notes && <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>}
              </div>
              {item.year && (
                <span className="text-xs text-gray-400 shrink-0 ml-2">{item.year}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
