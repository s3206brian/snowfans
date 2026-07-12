const CACHE_NAME = 'snowfans-v1'
const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.json',
  '/logo.svg',
  '/logo-icon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // 只處理同源請求，Supabase 等 API 一律走網路
  if (url.origin !== self.location.origin) return

  // 頁面導航：network-first，離線時顯示 offline 頁
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/offline.html').then((res) => res ?? Response.error())
      )
    )
    return
  }

  // 預快取的靜態資源：cache-first
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    )
  }
})
