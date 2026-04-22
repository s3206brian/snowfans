import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from './SettingsForm'
import { AvatarUpload } from '@/components/settings/AvatarUpload'
import { signOut } from '@/app/actions/auth'
import { deleteAccount } from '@/app/actions/profile'
import type { Tag } from '@/lib/types'

export const metadata = { title: '編輯個人資料' }

type Props = {
  searchParams: Promise<{ saved?: string }>
}

export default async function SettingsPage({ searchParams }: Props) {
  const { saved } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileRes, tagsRes, profileTagsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('tags').select('*').order('category').order('name'),
    supabase.from('profile_tags').select('tag_id').eq('profile_id', user.id),
  ])

  if (!profileRes.data) redirect('/login')

  const allTags = (tagsRes.data ?? []) as Tag[]
  const selectedTagIds = (profileTagsRes.data ?? []).map((pt) => pt.tag_id)

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pt-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">編輯個人資料</h1>
        <a href={`/${profileRes.data.username}`} className="text-sm text-gray-400 hover:text-gray-600">
          查看主頁
        </a>
      </div>

      <AvatarUpload
        userId={user.id}
        currentAvatarUrl={profileRes.data.avatar_url}
        displayName={profileRes.data.display_name ?? profileRes.data.username}
      />

      <SettingsForm
        profile={profileRes.data}
        allTags={allTags}
        selectedTagIds={selectedTagIds}
        saved={saved === '1'}
      />

      <div className="mt-10 border-t border-slate-800 pt-6 space-y-3">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-900 transition-colors"
          >
            登出
          </button>
        </form>
      </div>

      <div className="mt-4 border-t border-red-900/30 pt-6">
        <p className="text-xs text-slate-600 mb-3 text-center">危險操作</p>
        <form action={deleteAccount}>
          <button
            type="submit"
            className="w-full rounded-xl border border-red-900/50 py-2.5 text-sm font-medium text-red-500 hover:bg-red-950/30 transition-colors"
            onClick={(e) => {
              if (!confirm('確定要永久刪除帳號嗎？此操作無法復原。')) e.preventDefault()
            }}
          >
            刪除帳號
          </button>
        </form>
        <p className="text-xs text-slate-700 text-center mt-2">永久刪除帳號及所有相關資料</p>
      </div>
    </main>
  )
}
