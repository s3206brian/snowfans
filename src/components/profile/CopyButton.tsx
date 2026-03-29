'use client'

import { useState } from 'react'

type Props = { text: string }

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-sky-600 font-medium shrink-0 hover:text-sky-700"
    >
      {copied ? '已複製！' : '複製'}
    </button>
  )
}
