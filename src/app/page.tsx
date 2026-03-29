import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="inline-block rounded-full bg-blue-900/40 text-blue-400 border border-blue-800/50 text-xs font-semibold px-3 py-1 mb-6 tracking-wide">
            專為中文語系滑雪愛好者打造
          </span>

          <h1 className="text-6xl font-extrabold tracking-tight text-white">
            Snow<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Fans</span>
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-sm mx-auto leading-relaxed">
            記錄你的雪場足跡，<br />找到志同道合的雪友
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="rounded-2xl bg-blue-600 px-8 py-3.5 text-white font-semibold text-base hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
            >
              立即加入
            </Link>
            <Link
              href="/explore"
              className="rounded-2xl border border-slate-700 px-8 py-3.5 font-semibold text-base text-slate-300 hover:bg-slate-800 transition-colors"
            >
              探索大廳
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-12">你可以做什麼</h2>
        <div className="space-y-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 text-center bg-slate-900 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white">準備好了嗎？</h2>
        <p className="mt-2 text-slate-500">免費建立你的雪友名片</p>
        <Link
          href="/login"
          className="inline-block mt-6 rounded-2xl bg-blue-600 px-8 py-3.5 text-white font-semibold hover:bg-blue-500 transition-colors"
        >
          建立個人頁面
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} SnowFans · snowfans.org
      </footer>
    </main>
  )
}

const FEATURES = [
  {
    icon: '🏔️',
    title: '雪場足跡',
    desc: '記錄你去過的每一座雪山，展示你的滑雪版圖',
  },
  {
    icon: '🎿',
    title: '裝備庫',
    desc: '整理你的板子、靴子、裝備，讓雪友一目了然',
  },
  {
    icon: '🔗',
    title: '專屬短連結',
    desc: '一鍵分享你的個人頁面 snowfans.org/你的名稱',
  },
  {
    icon: '🔍',
    title: '探索雪友',
    desc: '搜尋想找教練、找雪友或找同好的滑雪愛好者',
  },
]
