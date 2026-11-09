'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/native'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // WKWebView 只允許 App-Bound Domains 使用 Service Worker，App 內不註冊
    if (!isNativeApp() && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 註冊失敗不影響網站使用
      })
    }
  }, [])

  return null
}
