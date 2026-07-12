import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">支援中心</h1>
        <p className="text-slate-400 mb-12">SnowFans 使用問題與帳號管理</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-400">聯絡我們</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <p className="text-slate-300">如有任何問題、建議或回報 Bug，請透過以下方式聯繫：</p>
              <p className="text-white font-medium">📧 support@snowfans.org</p>
              <p className="text-slate-400 text-sm">我們通常在 1-3 個工作天內回覆。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-400">常見問題</h2>
            <div className="space-y-3">
              {[
                {
                  q: '如何修改我的個人資料？',
                  a: 'App：點選底部「名片」→「編輯」，或前往「設定」頁面。網站：登入後點選右上角「設定」。',
                },
                {
                  q: '如何新增行程？',
                  a: 'App：點選底部「行程」頁面右上角「+ 新增」。網站：進入探索頁面的「找行程」，點選「發布行程」。',
                },
                {
                  q: '私訊功能如何使用？',
                  a: '在探索大廳點選任意雪友名片，進入個人資料頁後點「傳送私訊」即可開始對話。',
                },
                {
                  q: '如何讓我的名片不公開？',
                  a: '進入「設定」，將「公開名片」開關關閉並儲存，其他用戶就無法在探索頁看到你。',
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="font-medium text-white mb-1">Q：{q}</p>
                  <p className="text-slate-400 text-sm">A：{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-red-400">刪除帳號</h2>
            <div className="bg-slate-900 border border-red-900/40 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                你可以在 App 或網站上刪除你的帳號。刪除後，所有個人資料、行程、裝備紀錄及對話將永久清除且無法復原。
              </p>
              <div className="space-y-1">
                <p className="text-slate-300 text-sm font-medium">透過 App 刪除：</p>
                <p className="text-slate-400 text-sm">設定 → 滑到頁面底部 → 點選「刪除帳號」→ 確認</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-300 text-sm font-medium">透過網站刪除：</p>
                <p className="text-slate-400 text-sm">登入 → 設定 → 危險操作區塊 → 「刪除帳號」</p>
              </div>
              <p className="text-slate-500 text-xs">如需協助，請寄信至 support@snowfans.org</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-400">關於 SnowFans</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <p className="text-slate-300">SnowFans 是一個開源的滑雪社群平台，讓雪友互相交流、尋找雪伴與教練。</p>
              <p className="text-slate-400 text-sm">版本：1.1 ｜ 開發者：SnowFans Team</p>
              <div className="flex gap-4 text-sm mt-2">
                <Link href="/privacy" className="text-blue-400 hover:underline">隱私政策</Link>
                <Link href="/terms" className="text-blue-400 hover:underline">服務條款</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
