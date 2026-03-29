'use client'

import { useActionState, useState } from 'react'
import { signIn, signUp, type AuthState } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

const initialState: AuthState = {}

export function LoginForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState)

  const isPending = signInPending || signUpPending

  async function handleGoogleLogin() {
    const supabase = createClient()
    const base = process.env.NEXT_PUBLIC_APP_URL ?? location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${base}/auth/callback`,
      },
    })
  }

  if (tab === 'login') {
    return (
      <div className="space-y-4">
        <TabSwitcher tab={tab} onChange={setTab} />

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <GoogleIcon />
          使用 Google 登入
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600">或</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form action={signInAction} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              電子郵件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>
          {signInState.error && (
            <p className="text-sm text-rose-400">{signInState.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-60"
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
        <p className="font-semibold text-white">確認信已送出</p>
        <p className="text-sm text-slate-400">請至信箱點擊確認連結後即可登入</p>
        <button
          onClick={() => setTab('login')}
          className="mt-4 text-sm text-blue-400 hover:underline"
        >
          返回登入
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TabSwitcher tab={tab} onChange={setTab} />

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
      >
        <GoogleIcon />
        使用 Google 註冊
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600">或</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <form action={signUpAction} className="space-y-3">
        <div>
          <label htmlFor="su-email" className="block text-sm font-medium text-slate-300 mb-1">
            電子郵件
          </label>
          <input
            id="su-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="su-username" className="block text-sm font-medium text-slate-300 mb-1">
            使用者名稱（選填）
          </label>
          <input
            id="su-username"
            name="username"
            type="text"
            autoComplete="username"
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
            placeholder="snowboarder123"
          />
        </div>
        <div>
          <label htmlFor="su-password" className="block text-sm font-medium text-slate-300 mb-1">
            密碼
          </label>
          <input
            id="su-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
            placeholder="至少 8 個字元"
          />
        </div>
        {signUpState.error && (
          <p className="text-sm text-rose-400">{signUpState.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-60"
        >
          {signUpPending ? '建立中...' : '建立帳號'}
        </button>
      </form>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
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
    <div className="flex rounded-xl bg-slate-800 p-1 gap-1">
      {(['login', 'signup'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tab === t ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          {t === 'login' ? '登入' : '註冊'}
        </button>
      ))}
    </div>
  )
}
