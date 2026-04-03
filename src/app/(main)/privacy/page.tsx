export const metadata = { title: '隱私權政策' }

export default function PrivacyPage() {
  return (
    <main className="max-w-lg mx-auto px-4 pt-8 pb-24 text-slate-300">
      <h1 className="text-2xl font-bold text-white mb-2">隱私權政策</h1>
      <p className="text-slate-500 text-sm mb-8">最後更新：2025 年 4 月</p>

      <section className="space-y-6 text-sm leading-relaxed">

        <div>
          <h2 className="text-white font-semibold mb-2">1. 關於 SnowFans</h2>
          <p>
            SnowFans（snowfans.org）是一個開源、非營利的滑雪社群平台。
            我們不收費、不投放廣告、不從任何交易中抽成。本政策說明我們如何收集與使用您的資料。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">2. 我們收集的資料</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>帳號資訊：Email 地址、Google 帳號（若使用 Google 登入）</li>
            <li>個人資料：顯示名稱、使用者名稱、大頭貼、自我介紹、滑雪年資、板型</li>
            <li>滑雪紀錄：造訪雪場、裝備資訊、行程計畫、貼文</li>
            <li>私訊內容：您與其他使用者之間的對話</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">3. 資料的使用方式</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>提供平台核心功能（個人名片、探索大廳、私訊等）</li>
            <li>讓其他使用者能搜尋並找到您（依您的公開／私密設定）</li>
            <li>維護帳號安全與平台正常運作</li>
          </ul>
          <p className="mt-2">我們不會將您的資料出售、出租或用於廣告目的。</p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">4. 資料儲存</h2>
          <p>
            所有資料儲存於 Supabase（PostgreSQL）。資料庫設有存取控制規則（Row Level Security），
            確保您只能存取自己有權限的資料。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">5. 公開與私密</h2>
          <p>
            您可以在設定中將個人檔案設為「私密」，私密帳號不會出現在探索大廳。
            行程、裝備、貼文預設為公開，可依個人意願調整。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">6. 您的權利</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>您可以隨時在設定中修改或刪除個人資料</li>
            <li>如需刪除帳號與所有資料，請聯絡我們</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">7. 聯絡我們</h2>
          <p>
            若有任何隱私相關問題，請透過{' '}
            <a href="mailto:hello@snowfans.org" className="text-blue-400 hover:underline">
              hello@snowfans.org
            </a>{' '}
            與我們聯絡。
          </p>
        </div>

      </section>
    </main>
  )
}
