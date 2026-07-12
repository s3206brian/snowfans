import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-900 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-slate-500 mb-6">
          <Link href="/start" className="hover:text-slate-300">新手入門</Link>
          <Link href="/partners" className="hover:text-slate-300">教練・學校・住宿</Link>
          <Link href="/explore" className="hover:text-slate-300">探索雪友</Link>
          <Link href="/support" className="hover:text-slate-300">支援中心</Link>
          <Link href="/privacy" className="hover:text-slate-300">隱私權政策</Link>
          <Link href="/terms" className="hover:text-slate-300">服務條款</Link>
        </div>
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SnowFans · snowfans.org · Open Source · Non-profit
        </p>
      </div>
    </footer>
  )
}
