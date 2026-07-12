import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditTripForm } from './EditTripForm'

export const metadata = { title: '編輯行程' }

type Props = { params: Promise<{ id: string }> }

export default async function EditTripPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (!trip || trip.profile_id !== user.id) redirect('/')

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pt-6 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <a href="javascript:history.back()" className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </a>
        <h1 className="text-xl font-bold text-white">編輯行程</h1>
      </div>

      <EditTripForm trip={trip} />
    </main>
  )
}
