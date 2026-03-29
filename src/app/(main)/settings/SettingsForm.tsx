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
  { value: 'teaching', label: '可教學' },
  { value: 'learning', label: '找教練' },
  { value: 'finding_buddy', label: '找雪伴' },
]

const BOARD_TYPE_OPTIONS = [
  { value: '', label: '不設定' },
  { value: 'snowboard', label: '單板 Snowboard' },
  { value: 'ski', label: '雙板 Ski' },
  { value: 'both', label: '單雙板都玩' },
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
        <label className="block text-sm font-medium text-slate-300 mb-1">顯示名稱</label>
        <input
          name="display_name"
          type="text"
          defaultValue={profile.display_name ?? ''}
          placeholder={profile.username}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">自我介紹</label>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ''}
          rows={3}
          placeholder="介紹一下自己..."
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-600"
        />
      </div>

      {/* Board type + Years */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">板種</label>
          <div className="flex flex-wrap gap-2">
            {BOARD_TYPE_OPTIONS.map(({ value, label }) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" name="board_type" value={value}
                  defaultChecked={(profile.board_type ?? '') === value} className="sr-only peer" />
                <span className="inline-block rounded-full border px-3 py-1 text-sm font-medium transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border-slate-700 text-slate-400">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Years experience + Instructor cert */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">年資</label>
          <div className="flex items-center gap-2">
            <input
              name="years_experience"
              type="number"
              min="0"
              max="50"
              defaultValue={profile.years_experience ?? ''}
              placeholder="0"
              className="w-20 bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
            />
            <span className="text-sm text-slate-500">年</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pb-2.5">
          <input
            id="instructor_cert"
            name="instructor_cert"
            type="checkbox"
            defaultChecked={profile.instructor_cert}
            className="w-4 h-4 accent-blue-500 rounded"
          />
          <label htmlFor="instructor_cert" className="text-sm text-slate-300 cursor-pointer">
            具備教練資格
          </label>
        </div>
      </div>

      {/* Trip status */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">目前狀態</label>
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
              <span className="inline-block rounded-full border px-3 py-1 text-sm font-medium transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border-slate-700 text-slate-400">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">標籤</label>
        <div className="space-y-3">
          {(Object.keys(tagsByCategory) as Tag['category'][]).map((category) => (
            <div key={category}>
              <p className="text-xs text-slate-600 mb-1.5">{TAG_CATEGORY_LABEL[category]}</p>
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
                    <span className="inline-block rounded-full border px-3 py-1 text-sm transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 border-slate-700 text-slate-400">
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
        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-60"
      >
        {isPending ? '儲存中...' : '儲存'}
      </button>
    </form>
  )
}
