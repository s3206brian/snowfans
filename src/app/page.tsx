import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-sky-500">SnowFans</h1>
      <p className="mt-3 text-lg text-gray-500">專為中文語系滑雪愛好者打造的社群平台</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/explore"
          className="rounded-xl bg-sky-500 px-6 py-3 text-white font-semibold hover:bg-sky-600 transition-colors"
        >
          探索大廳
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-gray-200 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors"
        >
          登入 / 註冊
        </Link>
      </div>
    </main>
  );
}
