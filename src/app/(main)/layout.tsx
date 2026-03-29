import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let username: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()
    username = profile?.username ?? null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-14">
        {children}
      </div>
      <BottomNav username={username} />
    </div>
  )
}
