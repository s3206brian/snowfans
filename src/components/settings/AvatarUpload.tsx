'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateAvatar } from '@/app/actions/avatar'

type Props = {
  userId: string
  currentAvatarUrl: string | null
  displayName: string
}

export function AvatarUpload({ userId, currentAvatarUrl, displayName }: Props) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `avatars/${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('post-images')
      .upload(path, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from('post-images').getPublicUrl(path)
      const url = `${data.publicUrl}?t=${Date.now()}`
      setPreview(url)

      const formData = new FormData()
      formData.set('avatar_url', data.publicUrl)
      startTransition(() => updateAvatar(formData))
    }

    setUploading(false)
  }

  const initials = displayName?.slice(0, 1).toUpperCase() ?? '?'

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white">{initials}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || isPending}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth={2.5} className="w-3 h-3">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-white">頭像</p>
        <p className="text-xs text-slate-500">
          {uploading || isPending ? '上傳中...' : '點擊頭像更換'}
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
