'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addEquipment } from '@/app/actions/equipment'
import { equipmentCategoryLabel } from '@/lib/utils/formatters'

const CATEGORIES = [
  'board', 'skis', 'boots', 'helmet', 'goggles', 'outerwear', 'other',
] as const

type Props = { userId: string }

export function EquipmentForm({ userId }: Props) {
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [forSale, setForSale] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const supabase = createClient()
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `equipment/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('post-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('post-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    setImageUrls((prev) => [...prev, ...urls])
    setUploading(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    imageUrls.forEach((url) => data.append('image_urls', url))
    startTransition(async () => {
      await addEquipment(data)
      setImageUrls([])
      setForSale(false)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2 mt-2">
      <div className="flex gap-2">
        <select name="category" required
          className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="">類型...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{equipmentCategoryLabel(c)}</option>
          ))}
        </select>
        <input name="year" type="number" placeholder="年份" min="2000" max={new Date().getFullYear()}
          className="w-24 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
      </div>
      <div className="flex gap-2">
        <input name="brand" type="text" placeholder="品牌（如 Burton）"
          className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
        <input name="model" type="text" placeholder="型號"
          className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
        />
      </div>
      <input name="notes" type="text" placeholder="備註（選填）"
        className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
      />

      {/* Image upload */}
      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="text-sm text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50">
          {uploading ? '上傳中...' : '+ 新增照片'}
        </button>
      </div>

      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
              <button type="button" onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* For sale */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="for_sale" checked={forSale} onChange={(e) => setForSale(e.target.checked)}
            className="w-4 h-4 accent-blue-500 rounded" />
          <span className="text-sm text-slate-300">有意願出售</span>
        </label>
        {forSale && (
          <input name="sale_price" type="number" min="0" placeholder="售價 (TWD)"
            className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
          />
        )}
      </div>

      <button type="submit" disabled={isPending || uploading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
        {isPending ? '新增中...' : '+ 新增裝備'}
      </button>
    </form>
  )
}
