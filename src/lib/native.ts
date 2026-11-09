'use client'

/**
 * Thin wrapper around Capacitor so the same web code runs in a browser and in
 * the iOS app. Every helper is a safe no-op (or web fallback) outside the app.
 */
import { Capacitor } from '@capacitor/core'

/** Custom URL scheme registered in ios/App/App/Info.plist (CFBundleURLTypes). */
export const NATIVE_AUTH_CALLBACK = 'org.snowfans.app://auth/callback'

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform()
}

/** Open an OAuth URL in the system browser sheet (Google blocks sign-in inside WebViews). */
export async function openAuthBrowser(url: string): Promise<void> {
  const { Browser } = await import('@capacitor/browser')
  await Browser.open({ url, presentationStyle: 'popover' })
}

export async function closeAuthBrowser(): Promise<void> {
  const { Browser } = await import('@capacitor/browser')
  await Browser.close().catch(() => {})
}

/** Native share sheet in the app; Web Share API or clipboard in a browser. Returns 'shared' | 'copied'. */
export async function shareLink(url: string, title = 'SnowFans'): Promise<'shared' | 'copied'> {
  if (isNativeApp()) {
    const { Share } = await import('@capacitor/share')
    await Share.share({ title, url, dialogTitle: '分享' }).catch(() => {})
    return 'shared'
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}

export async function tapHaptic(): Promise<void> {
  if (!isNativeApp()) return
  const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
  await Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}
