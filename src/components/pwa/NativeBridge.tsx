'use client'

import { useEffect } from 'react'
import { isNativeApp, closeAuthBrowser, tapHaptic, NATIVE_AUTH_CALLBACK } from '@/lib/native'

/**
 * Runs only inside the iOS app:
 * - receives the OAuth redirect (com.snowfansorg.snowfans://auth/callback?code=…) from the
 *   system browser and finishes sign-in on /auth/callback inside the WebView,
 *   where the PKCE verifier cookie lives
 * - light haptic feedback on bottom-nav taps
 * - marks <html> with `native-app` for app-only styling
 */
export function NativeBridge() {
  useEffect(() => {
    if (!isNativeApp()) return

    document.documentElement.classList.add('native-app')

    let removeUrlListener: (() => void) | undefined
    import('@capacitor/app').then(async ({ App }) => {
      const handle = await App.addListener('appUrlOpen', async ({ url }) => {
        if (!url.startsWith(NATIVE_AUTH_CALLBACK)) return
        await closeAuthBrowser()
        const query = url.slice(NATIVE_AUTH_CALLBACK.length) // "?code=…" or "?error=…"
        window.location.href = `/auth/callback${query}`
      })
      removeUrlListener = () => handle.remove()
    })

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('nav a, [data-haptic]')) void tapHaptic()
    }
    document.addEventListener('click', onClick)

    return () => {
      removeUrlListener?.()
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
