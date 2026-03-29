'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createPost } from '@/app/actions/posts'
import type { Resort } from '@/lib/types'

type Props = {
  resorts: Resort[]
  userId: string
}

export function PostForm({ resorts, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
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
      const path = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
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
    const form = e.currentTarget
    const data = new FormData(form)
    imageUrls.forEach((url) => data.append('image_urls', url))

    startTransition(async () => {
      await createPost(data)
      setImageUrls([])
      setOpen(false)
      formRef.current?.reset()
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-slate-700 py-2.5 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-colors"
      >
        + 新增網誌
      </button>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3">
      <input
        name="title"
        type="text"
        placeholder="標題（選填）"
        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600"
      />

      <select
        name="resort_id"
        className="w-full bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-300"
      >
        <option value="">關聯雪場（選填）</option>
        {resorts.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name_zh ?? r.name}
          </option>
        ))}
      </select>

      <textarea
        name="content"
        rows={4}
        placeholder="寫下你的滑雪故事..."
        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none placeholder-slate-600"
      />

      {/* Image upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-sm text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
        >
          {uploading ? '上傳中...' : '+ 新增照片'}
        </button>
      </div>

      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => { setOpen(false); setImageUrls([]) }}
          className="px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isPending || uploading}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white font-medium transition-colors disabled:opacity-60"
        >
          {isPending ? '發布中...' : '發布'}
        </button>
      </div>
    </form>
  )
}
