import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from './SettingsForm'
import { signOut } from '@/app/actions/auth'
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

      <SettingsForm
        profile={profileRes.data}
        allTags={allTags}
        selectedTagIds={selectedTagIds}
        saved={saved === '1'}
      />

      <div className="mt-10 border-t border-gray-100 pt-6">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            登出
          </button>
        </form>
      </div>
    </main>
  )
}
