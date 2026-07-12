import Link from 'next/link'

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/60">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
          Snow<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Fans</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link href="/start" className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            新手入門
          </Link>
          <Link href="/partners" className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            教練・學校・住宿
          </Link>
          <Link href="/explore" className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 transition-colors">
            探索
          </Link>
        </nav>
      </div>
    </header>
  )
}
