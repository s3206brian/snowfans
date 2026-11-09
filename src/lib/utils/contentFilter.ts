/**
 * Objectionable-content filter for user-generated text (App Store Guideline 1.2).
 *
 * Masks profanity, sexual, hateful and scam terms with full-width asterisks before
 * the text is stored. Matching is case-insensitive and ignores spaces / punctuation
 * inserted between characters of a Latin term (e.g. "f.u.c.k").
 *
 * Extend BLOCKED_TERMS as moderation reports come in.
 */

const BLOCKED_TERMS: string[] = [
  // 中文：辱罵 / 髒話
  '幹你娘', '幹妳娘', '操你媽', '操你妈', '肏', '屌你', '雞掰', '機掰', '鸡巴', '雞巴', '靠北', '靠杯',
  '王八蛋', '婊子', '賤人', '贱人', '去死', '智障', '白痴', '白癡', '腦殘', '脑残', '低能兒', '廢物',
  '畜生', '人渣', '垃圾人', '死全家', '傻逼', '傻屄', '煞筆', '草泥馬', '尼瑪', '你妈的', '他媽的', '他妈的',
  // 中文：色情 / 性交易
  '約炮', '约炮', '一夜情', '援交', '外送茶', '性交易', '裸照', '色情', '做愛', '做爱', '口交', '肛交',
  // 中文：仇恨 / 詐騙
  '支那', '黑鬼', '台巴子', '殘障仔', '飛機杯', '代儲', '博弈', '娛樂城', '保證獲利', '飆股',
  // English
  'fuck', 'fucking', 'motherfucker', 'shit', 'bitch', 'bastard', 'asshole', 'dickhead', 'cunt',
  'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'porn', 'nude', 'nudes', 'onlyfans',
  'escort', 'hookup', 'kill yourself', 'kys',
]

const LATIN = /^[a-z ]+$/

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Latin terms: word-bounded, allow separators between letters. CJK terms: plain substring.
const PATTERNS: RegExp[] = BLOCKED_TERMS.map((term) => {
  const t = term.toLowerCase()
  if (LATIN.test(t)) {
    const body = [...t.replace(/ /g, '')].map(escapeRegExp).join('[\\s._\\-*]*')
    return new RegExp(`(?<![a-z])${body}(?![a-z])`, 'gi')
  }
  return new RegExp(escapeRegExp(t), 'g')
})

/** True when the text contains any blocked term. */
export function containsObjectionable(text: string | null | undefined): boolean {
  if (!text) return false
  return PATTERNS.some((re) => {
    re.lastIndex = 0
    return re.test(text)
  })
}

/** Returns the text with blocked terms masked; null/empty passes through unchanged. */
export function cleanText<T extends string | null | undefined>(text: T): T {
  if (!text) return text
  let out: string = text
  for (const re of PATTERNS) {
    re.lastIndex = 0
    out = out.replace(re, (m) => '＊'.repeat([...m].length))
  }
  return out as T
}
