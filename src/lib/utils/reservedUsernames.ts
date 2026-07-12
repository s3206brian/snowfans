// 路由與系統保留字，不可作為使用者名稱
const RESERVED_USERNAMES = new Set([
  'support', 'admin', 'administrator', 'moderator', 'mod', 'root', 'system',
  'snowfans', 'official', 'help', 'contact', 'about', 'team',
  'explore', 'settings', 'messages', 'trips', 'login', 'logout', 'signup',
  'register', 'privacy', 'terms', 'api', 'auth', 'callback', 'app', 'www',
  'mail', 'static', 'assets', 'public', 'profile', 'user', 'users',
  'search', 'notifications', 'follow', 'followers', 'following',
  'blocked', 'report', 'new', 'edit', 'delete',
])

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase())
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username) && !isReservedUsername(username)
}

/** 為自動產生的 username 避開保留字 */
export function safeUsername(base: string): string {
  return isReservedUsername(base) ? `${base}${Math.floor(1000 + Math.random() * 9000)}` : base
}
