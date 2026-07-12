import Link from 'next/link'

export const metadata = { title: '服務條款' }

export default function TermsPage() {
  return (
    <main className="max-w-lg mx-auto px-4 pt-8 pb-24 text-slate-300">
      <h1 className="text-2xl font-bold text-white mb-2">服務條款</h1>
      <p className="text-slate-500 text-sm mb-8">最後更新：2026 年 7 月</p>

      <section className="space-y-6 text-sm leading-relaxed">

        <div>
          <h2 className="text-white font-semibold mb-2">1. 服務說明</h2>
          <p>
            SnowFans（snowfans.org）是一個開源、非營利的滑雪社群平台，
            提供個人名片、雪場足跡、行程分享與私訊等功能。
            平台不收費、不投放廣告、不經手任何金流。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">2. 使用規範</h2>
          <p className="mb-2">使用本平台即表示你同意不從事以下行為：</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>發布不當、騷擾、仇恨或違法內容</li>
            <li>冒充他人或散布不實資訊</li>
            <li>發送垃圾訊息、詐騙或未經同意的商業訊息</li>
            <li>未經授權存取他人帳號或平台系統</li>
          </ul>
          <p className="mt-2">
            違反規範的帳號可能被限制或永久停用。你可以透過個人頁面的檢舉功能回報不當內容，
            我們會在 24 小時內處理。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">3. 用戶之間的互動</h2>
          <p>
            平台僅提供媒合與交流功能，用戶之間的私下約定（例如教學、同行、裝備買賣）
            由雙方自行負責，SnowFans 不介入也不承擔相關責任。
            請善用封鎖與檢舉功能保護自己。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">4. 內容與智慧財產</h2>
          <p>
            你所發布的內容（個人資料、貼文、照片等）仍屬於你本人，
            但你授權平台為提供服務所需而顯示這些內容。
            平台程式碼以 AGPLv3 授權開源。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">5. 帳號刪除</h2>
          <p>
            你可以隨時在「設定」頁面刪除帳號，所有相關資料將被永久移除且無法復原。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">6. 免責聲明</h2>
          <p>
            本平台為社群志願者維護的非營利專案，依「現狀」提供服務，
            不保證服務不中斷或完全無誤。滑雪為具風險性的運動，
            請自行評估身體狀況與場地安全。
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-2">7. 聯絡我們</h2>
          <p>
            如有任何問題，請透過
            <Link href="/support" className="text-blue-400 hover:underline mx-1">支援中心</Link>
            與我們聯繫。
          </p>
        </div>

      </section>
    </main>
  )
}
