'use client'

import { useActionState } from 'react'
import { updateProfile, type ProfileState } from '@/app/actions/profile'
import type { Profile, Tag } from '@/lib/types'

type Props = {
  profile: Profile
  allTags: Tag[]
  selectedTagIds: string[]
  saved?: boolean
}

const TRIP_STATUS_OPTIONS = [
  { value: '', label: '不設定' },
  { value: 'teaching', label: '教學中' },
  { value: 'learning', label: '學習中' },
  { value: 'finding_buddy', label: '找雪友' },
]

const TAG_CATEGORY_LABEL: Record<Tag['category'], string> = {
  skill: '技術',
  style: '風格',
  resort: '雪場',
  general: '一般',
}

const initialState: ProfileState = {}

export function SettingsForm({ profile, allTags, selectedTagIds, saved }: Props) {
  const [state, action, isPending] = useActionState(updateProfile, initialState)

  const tagsByCategory = allTags.reduce<Record<string, Tag[]>>((acc, tag) => {
    ;(acc[tag.category] ??= []).push(tag)
    return acc
  }, {})

  return (
    <form action={action} className="space-y-6">
      {(saved || state.success) && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          已儲存成功
        </div>
      )}
      {state.error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {state.error}
        </div>
      )}

      {/* Display name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          顯示名稱
        </label>
        <input
          name="display_name"
          type="text"
          defaultValue={profile.display_name ?? ''}
          placeholder={profile.username}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          自我介紹
        </label>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ''}
          rows={3}
          placeholder="介紹一下自己..."
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
        />
      </div>

      {/* Trip status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          目前狀態
        </label>
        <div className="flex flex-wrap gap-2">
          {TRIP_STATUS_OPTIONS.map(({ value, label }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="trip_status"
                value={value}
                defaultChecked={(profile.trip_status ?? '') === value}
                className="sr-only peer"
              />
              <span className="inline-block rounded-full border px-3 py-1 text-sm font-medium transition-colors peer-checked:bg-sky-500 peer-checked:text-white peer-checked:border-sky-500 border-gray-200 text-gray-600">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          標籤
        </label>
        <div className="space-y-3">
          {(Object.keys(tagsByCategory) as Tag['category'][]).map((category) => (
            <div key={category}>
              <p className="text-xs text-gray-400 mb-1.5">{TAG_CATEGORY_LABEL[category]}</p>
              <div className="flex flex-wrap gap-2">
                {tagsByCategory[category].map((tag) => (
                  <label key={tag.id} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={tag.id}
                      defaultChecked={selectedTagIds.includes(tag.id)}
                      className="sr-only peer"
                    />
                    <span className="inline-block rounded-full border px-3 py-1 text-sm transition-colors peer-checked:bg-sky-500 peer-checked:text-white peer-checked:border-sky-500 border-gray-200 text-gray-600">
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
      >
        {isPending ? '儲存中...' : '儲存'}
      </button>
    </form>
  )
}
