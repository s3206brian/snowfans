'use client'

import { useState, useRef, useEffect, useTransition, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { blockUser, unblockUser, reportUser, type ReportState } from '@/app/actions/safety'

type Props = {
  targetUserId: string
  targetName: string
  initiallyBlocked: boolean
}

const REPORT_REASONS = [
  { value: 'inappropriate_content', label: '不當內容' },
  { value: 'harassment', label: '騷擾或霸凌' },
  { value: 'spam', label: '垃圾訊息或詐騙' },
  { value: 'other', label: '其他' },
]

const initialReportState: ReportState = {}

export function ProfileMoreMenu({ targetUserId, targetName, initiallyBlocked }: Props) {
  const [open, setOpen] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [blocked, setBlocked] = useState(initiallyBlocked)
  const [pending, startTransition] = useTransition()
  const [reportState, reportAction, reportPending] = useActionState(reportUser, initialReportState)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function handleBlockToggle() {
    setOpen(false)
    if (!blocked && !confirm(`確定要封鎖 ${targetName} 嗎？封鎖後對方將無法傳訊息給你。`)) return
    startTransition(async () => {
      const result = blocked ? await unblockUser(targetUserId) : await blockUser(targetUserId)
      if (result.error) {
        alert(result.error)
        return
      }
      setBlocked(!blocked)
      router.refresh()
    })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="更多選項"
        className="shrink-0 rounded-lg border border-slate-700 px-2 py-1.5 text-slate-400 hover:bg-slate-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden">
          <button
            onClick={() => { setOpen(false); setShowReport(true) }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            檢舉
          </button>
          <button
            onClick={handleBlockToggle}
            disabled={pending}
            className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {blocked ? '解除封鎖' : '封鎖'}
          </button>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReport(false) }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5">
            <h3 className="text-base font-bold text-white mb-1">檢舉 {targetName}</h3>
            <p className="text-xs text-slate-500 mb-4">檢舉內容僅管理團隊可見，我們會在 24 小時內處理。</p>

            {reportState.success ? (
              <>
                <div className="rounded-xl bg-green-900/30 border border-green-800/50 px-4 py-3 text-sm text-green-400 mb-4">
                  已收到你的檢舉，感謝協助維護社群安全。
                </div>
                <button
                  onClick={() => setShowReport(false)}
                  className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  關閉
                </button>
              </>
            ) : (
              <form action={reportAction} className="space-y-4">
                <input type="hidden" name="reported_id" value={targetUserId} />
                <input type="hidden" name="content_type" value="profile" />

                <div className="space-y-2">
                  {REPORT_REASONS.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="reason" value={value} required className="accent-blue-500 w-4 h-4" />
                      <span className="text-sm text-slate-300">{label}</span>
                    </label>
                  ))}
                </div>

                <textarea
                  name="details"
                  rows={3}
                  placeholder="補充說明（選填）"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-600 resize-none"
                />

                {reportState.error && (
                  <p className="text-sm text-rose-400">{reportState.error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReport(false)}
                    className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={reportPending}
                    className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-60"
                  >
                    {reportPending ? '送出中...' : '送出檢舉'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
