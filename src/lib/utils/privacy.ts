import type { PrivacySettings, PrivacyLevel } from '@/lib/types'

export function getPrivacyLevel(
  settings: unknown,
  key: keyof PrivacySettings
): PrivacyLevel {
  if (
    settings &&
    typeof settings === 'object' &&
    !Array.isArray(settings) &&
    key in (settings as object)
  ) {
    const val = (settings as Record<string, unknown>)[key]
    if (val === 'public' || val === 'followers' || val === 'private') return val
  }
  return 'public'
}

export function canView(level: PrivacyLevel, isOwner: boolean): boolean {
  if (isOwner) return true
  return level === 'public'
}
