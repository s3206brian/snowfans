'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendMessage } from '@/app/actions/messages'

type Message = {
  id: string
  sender_id: string
  body: string
  created_at: string
}

type Props = {
  conversationId: string
  currentUserId: string
  other: { id: string; username: string; display_name: string | null } | null
  initialMessages: Message[]
}

export function ChatWindow({ conversationId, currentUserId, other, initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [pending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim() || pending) return
    const body = input.trim()
    setInput('')
    // Optimistic update
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      sender_id: currentUserId,
      body,
      created_at: new Date().toISOString(),
    }])
    startTransition(async () => {
      await sendMessage(conversationId, body)
      router.refresh()
    })
  }

  function formatTime(dt: string) {
    return new Date(dt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-slate-800 pt-safe">
        <Link href="/messages" className="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-blue-300 font-bold">
          {(other?.display_name ?? other?.username ?? '?')[0].toUpperCase()}
        </div>
        <span className="text-white font-semibold">{other?.display_name ?? other?.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-950">
        {messages.map((m) => {
          const isMine = m.sender_id === currentUserId
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[72%] px-4 py-2 rounded-2xl text-sm ${
                isMine
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              }`}>
                <p>{m.body}</p>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-slate-500'}`}>
                  {formatTime(m.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-t border-slate-800 pb-safe">
        <input
          className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="輸入訊息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || pending}
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center disabled:opacity-40 hover:bg-blue-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
