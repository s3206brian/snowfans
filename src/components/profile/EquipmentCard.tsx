import type { Equipment } from '@/lib/types'
import { equipmentCategoryLabel } from '@/lib/utils/formatters'
import { deleteEquipment } from '@/app/actions/equipment'
import { EquipmentForm } from './EquipmentForm'
import { EquipmentEditForm } from './EquipmentEditForm'

type Props = {
  equipment: Equipment[]
  isOwner?: boolean
  userId?: string
}

export function EquipmentCard({ equipment, isOwner, userId }: Props) {
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
            <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
              {item.image_urls?.length > 0 && (
                <div className="flex gap-1 overflow-x-auto">
                  {item.image_urls.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt=""
                      className="h-36 w-auto object-cover flex-shrink-0 first:rounded-tl-xl last:rounded-tr-xl" />
                  ))}
                </div>
              )}
              <div className="px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-blue-400 bg-blue-900/30 border border-blue-800/50 rounded px-1.5 py-0.5">
                      {equipmentCategoryLabel(item.category)}
                    </span>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      {item.brand ? `${item.brand} ` : ''}{item.model ?? '未命名'}
                    </p>
                    {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                    {item.for_sale && (
                      <p className="text-xs text-emerald-400 mt-1">
                        出售中{item.sale_price ? ` · NT$ ${item.sale_price.toLocaleString()}` : ''}
                      </p>
                    )}
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
                {isOwner && <EquipmentEditForm item={item} />}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOwner && userId && <EquipmentForm userId={userId} />}
    </section>
  )
}
