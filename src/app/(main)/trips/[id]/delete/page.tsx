import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteTrip } from '@/app/actions/trips'

type Props = { params: Promise<{ id: string }> }

export default async function DeleteTripPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify ownership
  const { data: trip } = await supabase
    .from('trips')
    .select('id, resort_name, start_date, profile_id')
    .eq('id', id)
    .single()

  if (!trip || trip.profile_id !== user.id) redirect('/')

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pt-6">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center">
        <p className="text-2xl mb-3">🗑️</p>
        <h1 className="text-lg font-bold text-white mb-2">確定要刪除這筆行程？</h1>
        <p className="text-sm text-slate-400 mb-6">
          {trip.resort_name ?? '未指定雪場'} · {trip.start_date}
        </p>
        <div className="flex gap-3">
          <a
            href="javascript:history.back()"
            className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors text-center"
          >
            取消
          </a>
          <form action={deleteTrip.bind(null, id)} className="flex-1">
            <button
              type="submit"
              className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors"
            >
              確定刪除
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
