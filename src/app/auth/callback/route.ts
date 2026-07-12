import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeUsername } from '@/lib/utils/reservedUsernames'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Ensure profile exists (trigger may fail for OAuth users)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, eula_accepted_at')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        const emailPrefix = (user.email ?? '').split('@')[0]
        const base = safeUsername(emailPrefix.replace(/[^a-zA-Z0-9]/g, '') || `user${Date.now()}`)
        const username = base
        const short_link = base.toLowerCase()
        const display_name =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          username

        await supabase.from('profiles').insert({
          id: user.id,
          username,
          short_link,
          display_name,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          eula_accepted_at: new Date().toISOString(),
        })
      } else if (!profile.eula_accepted_at) {
        // 登入頁已顯示同意條款聲明，登入即代表同意
        await supabase
          .from('profiles')
          .update({ eula_accepted_at: new Date().toISOString() })
          .eq('id', user.id)
      }
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin
  return NextResponse.redirect(`${appUrl}/explore`)
}
