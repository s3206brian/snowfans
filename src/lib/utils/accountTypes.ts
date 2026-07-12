export type AccountType = 'skier' | 'coach' | 'school' | 'lodging'

export const ACCOUNT_TYPES: Record<AccountType, {
  label: string
  emoji: string
  badgeCls: string
}> = {
  skier: {
    label: '一般雪友',
    emoji: '🏂',
    badgeCls: '',
  },
  coach: {
    label: '教練',
    emoji: '🎿',
    badgeCls: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
  },
  school: {
    label: '滑雪學校',
    emoji: '🏫',
    badgeCls: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50',
  },
  lodging: {
    label: '雪場民宿',
    emoji: '🏠',
    badgeCls: 'bg-violet-900/40 text-violet-400 border-violet-800/50',
  },
}

export function isAccountType(val: unknown): val is AccountType {
  return val === 'skier' || val === 'coach' || val === 'school' || val === 'lodging'
}

/** 非一般雪友才顯示身分徽章 */
export function accountBadge(type: string | null | undefined) {
  if (!type || type === 'skier' || !(type in ACCOUNT_TYPES)) return null
  return ACCOUNT_TYPES[type as AccountType]
}
