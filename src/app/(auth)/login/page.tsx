import { LoginForm } from './LoginForm'

export const metadata = { title: '登入' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            SnowFans
          </h1>
          <p className="mt-1 text-sm text-slate-500">專為中文語系滑雪愛好者打造</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
