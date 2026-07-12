import Link from 'next/link'
import { MarketingHeader } from '@/components/layout/MarketingHeader'
import { MarketingFooter } from '@/components/layout/MarketingFooter'

export const metadata = {
  title: '教練・滑雪學校・民宿推廣 — 免費在 SnowFans 曝光',
  description: 'SnowFans 是非營利滑雪社群，教練、滑雪學校與雪場民宿都能免費建立名片，直接觸及正在找教學與住宿的雪友，零抽成、零廣告費。',
}

const AUDIENCES = [
  {
    emoji: '🎿',
    title: '滑雪教練',
    tagline: '讓正在找教練的雪友直接找到你',
    points: [
      '標記教學狀態與可帶的行程，出現在「找教練」篩選中',
      '展示證照、專長（單／雙板、Park、親子）與過往足跡',
      '雪友透過站內私訊直接聯繫，不經第三方',
    ],
    cta: { label: '瀏覽現有教練', href: '/explore?status=teaching' },
    accent: 'from-blue-500/15 to-blue-900/5 border-blue-800/50',
    badge: 'text-blue-400',
  },
  {
    emoji: '🏫',
    title: '滑雪學校',
    tagline: '把課程與教練團隊介紹給更多新手',
    points: [
      '建立學校名片，介紹課程、語言與所在雪場',
      '用標籤標註「新手友善」「中文教學」「親子課程」',
      '承接新手入門頁的流量，直接觸及第一次滑雪的族群',
    ],
    cta: { label: '看新手怎麼找學校', href: '/start' },
    accent: 'from-emerald-500/15 to-emerald-900/5 border-emerald-800/50',
    badge: 'text-emerald-400',
  },
  {
    emoji: '🏠',
    title: '雪場民宿・住宿',
    tagline: '出現在雪友規劃行程的第一步',
    points: [
      '介紹你的民宿位置、到雪場的距離與交通',
      '雪友在安排行程、找雪伴時順道發現你的住宿',
      '非營利平台不抽成，訂房與聯繫由雙方直接完成',
    ],
    cta: { label: '探索雪友行程', href: '/explore?tab=trips' },
    accent: 'from-violet-500/15 to-violet-900/5 border-violet-800/50',
    badge: 'text-violet-400',
  },
]

const WHY = [
  { icon: '🆓', title: '零費用・零抽成', desc: '非營利專案，不收上架費、不抽佣金、不跟你分潤。' },
  { icon: '🤝', title: '直接聯繫', desc: '雪友透過站內私訊或你的社群直接聯絡，平台不介入交易。' },
  { icon: '🎯', title: '精準受眾', desc: '來的都是正在規劃雪季、找教學與住宿的滑雪族群。' },
  { icon: '🔗', title: '專屬短連結', desc: '一組 snowfans.org/你的名稱，方便放在 IG、LINE 與名片上。' },
]

const HOW = [
  { n: '01', title: '免費註冊', desc: '用 Email 或 Google 建立帳號，一分鐘完成。' },
  { n: '02', title: '填寫名片', desc: '選擇身分、介紹服務與所在雪場，加上標籤讓人搜得到。' },
  { n: '03', title: '開始曝光', desc: '雪友就能在探索大廳與新手入門頁找到你，直接私訊聯繫。' },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-14 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-900/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 text-xs font-semibold px-3 py-1 mb-6 tracking-wide">
            教練・滑雪學校・民宿
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            把你的服務，<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">介紹給每一位雪友</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            SnowFans 是開源、非營利的滑雪社群。<br className="hidden sm:block" />
            教練、滑雪學校與雪場民宿都能<span className="text-white font-semibold">免費建立名片</span>，
            直接觸及正在找教學與住宿的雪友——零抽成、零廣告費。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="rounded-2xl bg-blue-600 px-7 py-3.5 font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
              免費建立名片
            </Link>
            <a href="#how" className="rounded-2xl border border-slate-700 px-7 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
              怎麼開始
            </a>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="px-4 py-10 max-w-3xl mx-auto">
        <div className="space-y-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className={`rounded-2xl border bg-gradient-to-b ${a.accent} p-6`}>
              <div className="flex items-start gap-4">
                <span className="text-4xl shrink-0">{a.emoji}</span>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold ${a.badge}`}>{a.title}</h2>
                  <p className="text-sm text-slate-300 mt-0.5">{a.tagline}</p>
                  <ul className="mt-4 space-y-2">
                    {a.points.map((p) => (
                      <li key={p} className="text-sm text-slate-300 flex gap-2">
                        <span className="text-slate-500 shrink-0">·</span>{p}
                      </li>
                    ))}
                  </ul>
                  <Link href={a.cta.href} className="inline-block mt-4 text-sm font-semibold text-blue-400 hover:underline">
                    {a.cta.label} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why SnowFans */}
      <section className="px-4 py-14 max-w-3xl mx-auto border-t border-slate-900">
        <h2 className="text-2xl font-bold text-center mb-2">為什麼選擇 SnowFans</h2>
        <p className="text-center text-slate-500 text-sm mb-8">我們是社群，不是仲介平台</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {WHY.map((w) => (
            <div key={w.title} className="flex items-start gap-3 rounded-xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-2xl shrink-0">{w.icon}</span>
              <div>
                <h3 className="font-semibold text-sm">{w.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to start */}
      <section id="how" className="px-4 py-14 max-w-3xl mx-auto border-t border-slate-900 scroll-mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">三步驟開始曝光</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {HOW.map((h) => (
            <div key={h.n} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-emerald-400">
                {h.n}
              </span>
              <h3 className="font-bold mt-2">{h.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-slate-900 border-t border-slate-800">
        <h2 className="text-2xl font-bold">現在就免費上架</h2>
        <p className="mt-2 text-slate-500">教練、學校、民宿都適用，不花一毛錢</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="rounded-2xl bg-blue-600 px-8 py-3.5 font-semibold hover:bg-blue-500 transition-colors">
            建立名片
          </Link>
          <Link href="/support" className="rounded-2xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            有問題？聯絡我們
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
