import Link from 'next/link'
import { MarketingHeader } from '@/components/layout/MarketingHeader'
import { MarketingFooter } from '@/components/layout/MarketingFooter'

export const metadata = {
  title: '滑雪新手入門 — 第一次滑雪就上手',
  description: '第一次滑雪不知道從哪開始？單板還是雙板、要準備什麼、怎麼找教練與雪伴，SnowFans 新手入門一次告訴你。',
}

const BOARD_CHOICE = [
  {
    emoji: '🏂',
    name: '單板 Snowboard',
    vibe: '街頭、自由、帥氣',
    pros: ['站姿自然、跌倒多在同一區塊', '換刃節奏抓到後進步很快', 'Park、跳台、地形玩法多元'],
    cons: ['前兩天最挫折，屁股和手腕容易瘀青', '平地移動與上纜車較不方便'],
    who: '喜歡滑板／衝浪手感、不怕前期摔、想玩花式',
    accent: 'from-blue-500/20 to-blue-900/10 border-blue-800/50',
    badge: 'bg-blue-600',
  },
  {
    emoji: '⛷️',
    name: '雙板 Ski',
    vibe: '速度、優雅、直覺',
    pros: ['第一天就能滑動、成就感來得快', '面向前進、視野與平衡直覺', '平地與纜車移動輕鬆'],
    cons: ['要同時控制兩隻腳與四個邊', '進階要練的細節較多'],
    who: '想快點滑起來、喜歡速度感、家庭同遊',
    accent: 'from-emerald-500/20 to-emerald-900/10 border-emerald-800/50',
    badge: 'bg-emerald-600',
  },
]

const CHECKLIST = [
  { icon: '🎫', title: '雪票 Lift Pass', desc: '雪場纜車票，建議買半天／一日票，先確認自己的體力。' },
  { icon: '🧥', title: '防水雪衣褲', desc: '第一次可以先租，重點是防水透氣，別穿一般羽絨衣濕透了。' },
  { icon: '🧤', title: '手套・雪鏡・帽子', desc: '手套要防水，雪鏡防雪盲，毛帽或安全帽保暖防撞。' },
  { icon: '🛡️', title: '護具', desc: '護臀、護膝、護腕能大幅降低新手期的疼痛，強烈建議。' },
  { icon: '🎿', title: '雪具租借', desc: '新手先租板／靴／杖，等確定會繼續玩再買自己的。' },
  { icon: '☀️', title: '防曬・保暖', desc: '雪地反光曬傷很快，防曬、暖暖包、保溫水壺都別忘了。' },
]

const STEPS = [
  {
    n: '01',
    title: '上第一堂課',
    desc: '別自學！找一位教練或滑雪學校，一堂課學會安全跌倒、煞車與轉彎，比自己摸索三天還快，也更不容易受傷。',
    href: '/partners',
    cta: '找教練・滑雪學校 →',
  },
  {
    n: '02',
    title: '找雪伴一起練',
    desc: '有伴一起滑最不無聊，還能互相拍影片檢討動作。在探索大廳用「找雪伴」篩選，找到同場同期的雪友。',
    href: '/explore?status=finding_buddy',
    cta: '找雪伴 →',
  },
  {
    n: '03',
    title: '記錄你的足跡',
    desc: '建立免費名片，把去過的雪場、裝備與行程記錄下來，累積屬於你的滑雪版圖，也讓雪友更容易找到你。',
    href: '/login',
    cta: '建立名片 →',
  },
]

const FAQ = [
  {
    q: '完全沒運動基礎也可以嗎？',
    a: '可以。滑雪不需要特別的體能門檻，新手最重要的是學會「安全跌倒」和控制速度。上一堂教練課，當天就能在初學者緩坡滑動。',
  },
  {
    q: '幾歲適合開始？',
    a: '大多數雪場的兒童課程從 3–4 歲開始，成人任何年齡都能學。日本、台灣近郊雪場都有中文教練與親子課程。',
  },
  {
    q: '一趟要準備多少預算？',
    a: '以日本雪場為例，新手一天大致包含雪票、雪具租借與一堂團體課。裝備先用租的、住宿選擇雪場周邊民宿，能有效控制花費。',
  },
  {
    q: '該去哪個雪場？',
    a: '新手建議選緩坡多、有中文教學的雪場。二世谷、野澤溫泉、苗場都是台灣雪友常去的入門友善選擇，交通與住宿也成熟。',
  },
]

export default function StartPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-14 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-blue-900/40 text-blue-400 border border-blue-800/50 text-xs font-semibold px-3 py-1 mb-6 tracking-wide">
            新手入門指南
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            第一次滑雪，<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">從這裡開始</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            單板還是雙板？要準備什麼？怎麼找教練和雪伴？<br className="hidden sm:block" />
            這一頁幫你把新手最常卡住的問題一次搞懂。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#choose" className="rounded-2xl bg-blue-600 px-7 py-3.5 font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
              單板 vs 雙板
            </a>
            <Link href="/partners" className="rounded-2xl border border-slate-700 px-7 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
              找教練・滑雪學校
            </Link>
          </div>
        </div>
      </section>

      {/* Snowboard vs Ski */}
      <section id="choose" className="px-4 py-14 max-w-3xl mx-auto scroll-mt-16">
        <h2 className="text-2xl font-bold text-center mb-2">單板還是雙板？</h2>
        <p className="text-center text-slate-500 text-sm mb-8">沒有標準答案，選你更想玩的那一種就對了</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {BOARD_CHOICE.map((b) => (
            <div key={b.name} className={`rounded-2xl border bg-gradient-to-b ${b.accent} p-5`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{b.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{b.name}</h3>
                  <p className="text-xs text-slate-400">{b.vibe}</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-1">優點</p>
              <ul className="space-y-1 mb-3">
                {b.pros.map((p) => (
                  <li key={p} className="text-sm text-slate-300 flex gap-2"><span className="text-emerald-500">＋</span>{p}</li>
                ))}
              </ul>
              <p className="text-xs font-semibold text-amber-400 mb-1">要有心理準備</p>
              <ul className="space-y-1 mb-4">
                {b.cons.map((c) => (
                  <li key={c} className="text-sm text-slate-400 flex gap-2"><span className="text-amber-500">－</span>{c}</li>
                ))}
              </ul>
              <div className="rounded-xl bg-slate-950/50 border border-slate-800 px-3 py-2">
                <p className="text-xs text-slate-500">適合你，如果你…</p>
                <p className="text-sm text-slate-200 mt-0.5">{b.who}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">
          還是猶豫？大多數人會先各租半天試試，身體會告訴你答案。
        </p>
      </section>

      {/* Checklist */}
      <section className="px-4 py-14 max-w-3xl mx-auto border-t border-slate-900">
        <h2 className="text-2xl font-bold text-center mb-2">新手第一次的準備清單</h2>
        <p className="text-center text-slate-500 text-sm mb-8">不用一次買齊，打勾的先用租的就好</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CHECKLIST.map((c) => (
            <div key={c.title} className="flex items-start gap-3 rounded-xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <h3 className="font-semibold text-sm">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 steps */}
      <section className="px-4 py-14 max-w-3xl mx-auto border-t border-slate-900">
        <h2 className="text-2xl font-bold text-center mb-2">三步驟開始你的滑雪路</h2>
        <p className="text-center text-slate-500 text-sm mb-8">從第一堂課到記錄足跡，SnowFans 都幫你接起來</p>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4 rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-emerald-400 shrink-0">
                {s.n}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                <Link href={s.href} className="inline-block mt-3 text-sm font-semibold text-blue-400 hover:underline">
                  {s.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 max-w-3xl mx-auto border-t border-slate-900">
        <h2 className="text-2xl font-bold text-center mb-8">新手常見問題</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-xl bg-slate-900 border border-slate-800 px-4 py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-sm">
                {f.q}
                <span className="text-slate-500 transition-transform group-open:rotate-45 text-lg leading-none">＋</span>
              </summary>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-slate-900 border-t border-slate-800">
        <h2 className="text-2xl font-bold">準備好踏上雪場了嗎？</h2>
        <p className="mt-2 text-slate-500">免費建立雪友名片，找教練、找雪伴、記錄每一趟雪</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="rounded-2xl bg-blue-600 px-8 py-3.5 font-semibold hover:bg-blue-500 transition-colors">
            免費加入
          </Link>
          <Link href="/partners" className="rounded-2xl border border-slate-700 px-8 py-3.5 font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            找教練・學校・住宿
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
