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
            <Link href="/login" className="rounded-2xl bg-blue-600 px-8 py-3.5 text-white font-semibold text-base hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
              立即加入
            </Link>
            <Link href="/explore" className="rounded-2xl border border-slate-700 px-8 py-3.5 font-semibold text-base text-slate-300 hover:bg-slate-800 transition-colors">
              探索大廳
            </Link>
          </div>
        </div>
      </section>

      {/* Demo profiles */}
      <section className="px-4 py-20 max-w-lg mx-auto">
        <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8">社群裡的雪友們</p>
        <div className="space-y-4">
          {DEMO_PROFILES.map((p) => (
            <div key={p.name} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className={`h-20 bg-gradient-to-r ${p.coverGradient} relative`}>
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg ${p.statusCls}`}>
                  {p.status}
                </span>
                <div className="absolute bottom-[-20px] left-4">
                  <div className={`h-12 w-12 ${p.avatarColor} rounded-full ring-4 ring-slate-900 flex items-center justify-center font-bold text-white text-base`}>
                    {p.name[0]}
                  </div>
                </div>
              </div>
              <div className="px-4 pt-7 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{p.meta}</p>
                  </div>
                  <span className="text-xs text-slate-600 bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg shrink-0 ml-2">
                    {p.trip}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{p.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((tag) => (
                    <span key={tag} className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/explore" className="text-sm text-blue-400 hover:underline">
            查看更多雪友 →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-lg mx-auto border-t border-slate-900">
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
        <Link href="/login" className="inline-block mt-6 rounded-2xl bg-blue-600 px-8 py-3.5 text-white font-semibold hover:bg-blue-500 transition-colors">
          建立個人頁面
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} SnowFans · snowfans.org · Open Source · Non-profit
      </footer>
    </main>
  )
}

const DEMO_PROFILES = [
  {
    name: 'Brian',
    meta: '單板 Snowboard · 5年 · CASI Lv1',
    status: '可教學',
    statusCls: 'bg-blue-600 text-white',
    coverGradient: 'from-blue-900 to-slate-900',
    avatarColor: 'bg-blue-600',
    trip: '🇯🇵 2/5–2/10 野澤',
    bio: '二月會在野澤溫泉，有新手想學單板可以找我！帶你安全推坡下山～',
    tags: ['教學', '新手友善', '野澤溫泉'],
  },
  {
    name: 'Alice',
    meta: '雙板 Ski · 3年',
    status: '找雪伴',
    statusCls: 'bg-emerald-600 text-white',
    coverGradient: 'from-emerald-900 to-slate-900',
    avatarColor: 'bg-emerald-600',
    trip: '🇯🇵 3/10–3/15 苗場',
    bio: '三月中會在苗場，主要都在紅線練功，找人一起吃飯或互相幫忙拍滑行影片！',
    tags: ['中級', '苗場', '拍攝交流'],
  },
  {
    name: 'Kenji',
    meta: '單板 Snowboard · 8年',
    status: '找教練',
    statusCls: 'bg-amber-600 text-white',
    coverGradient: 'from-amber-900 to-slate-900',
    avatarColor: 'bg-amber-600',
    trip: '🇯🇵 1/20–1/25 二世谷',
    bio: '想在二世谷進修 park 技術，尋找有 freestyle 經驗的教練帶我突破卡關！',
    tags: ['Freestyle', 'Park', '二世谷'],
  },
]

const FEATURES = [
  {
    icon: '🏔️',
    title: '雪場足跡',
    desc: '記錄你去過的每一座雪山，展示你的滑雪版圖',
  },
  {
    icon: '📅',
    title: '行程卡片',
    desc: '發布即將出發的行程，標記教學、找雪伴或找教練的需求',
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
]
