'use client'

import { useActionState, useState } from 'react'
import { signIn, signUp, type AuthState } from '@/app/actions/auth'

const initialState: AuthState = {}

export function LoginForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState)

  const isPending = signInPending || signUpPending

  if (tab === 'login') {
    return (
      <div className="space-y-4">
        <TabSwitcher tab={tab} onChange={setTab} />
        <form action={signInAction} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="••••••••"
            />
          </div>
          {signInState.error && (
            <p className="text-sm text-rose-500">{signInState.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {signInPending ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    )
  }

  if (signUpState.error === undefined && !signUpPending && signUpState !== initialState) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="text-2xl">📧</p>
        <p className="font-semibold">確認信已送出</p>
        <p className="text-sm text-gray-500">請至信箱點擊確認連結後即可登入</p>
        <button
          onClick={() => setTab('login')}
          className="mt-4 text-sm text-sky-600 hover:underline"
        >
          返回登入
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TabSwitcher tab={tab} onChange={setTab} />
      <form action={signUpAction} className="space-y-3">
        <div>
          <label htmlFor="su-email" className="block text-sm font-medium text-gray-700 mb-1">
            電子郵件
          </label>
          <input
            id="su-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="su-username" className="block text-sm font-medium text-gray-700 mb-1">
            使用者名稱（選填）
          </label>
          <input
            id="su-username"
            name="username"
            type="text"
            autoComplete="username"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="snowboarder123"
          />
        </div>
        <div>
          <label htmlFor="su-password" className="block text-sm font-medium text-gray-700 mb-1">
            密碼
          </label>
          <input
            id="su-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="至少 8 個字元"
          />
        </div>
        {signUpState.error && (
          <p className="text-sm text-rose-500">{signUpState.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
        >
          {signUpPending ? '建立中...' : '建立帳號'}
        </button>
      </form>
    </div>
  )
}

function TabSwitcher({
  tab,
  onChange,
}: {
  tab: 'login' | 'signup'
  onChange: (t: 'login' | 'signup') => void
}) {
  return (
    <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
      {(['login', 'signup'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {t === 'login' ? '登入' : '註冊'}
        </button>
      ))}
    </div>
  )
}
