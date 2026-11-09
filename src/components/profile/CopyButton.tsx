'use client'

import { useState, useSyncExternalStore } from 'react'
import { isNativeApp, shareLink } from '@/lib/native'

type Props = { text: string }

const noopSubscribe = () => () => {}

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false)
  // 在 App 內改用原生分享面板；伺服器端一律視為瀏覽器，避免 hydration 不一致
  const native = useSyncExternalStore(noopSubscribe, isNativeApp, () => false)

  async function handleCopy() {
    const result = await shareLink(text)
    if (result === 'shared') return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-sky-600 font-medium shrink-0 hover:text-sky-700"
    >
      {copied ? '已複製！' : native ? '分享' : '複製'}
    </button>
  )
}
