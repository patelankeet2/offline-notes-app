// Service worker for the Offline Notes App
// It saves the app files in the browser cache so the app can open without internet.

// Change this name when the caching logic changes, so old caches get removed
const CACHE_NAME = 'offline-notes-cache-v1'

// List of built files (html, js, css, icons) added by vite-plugin-pwa at build time
const BUILD_FILES = self.__WB_MANIFEST.map((entry) => entry.url)

// Also cache the root page, and remove any duplicates
const FILES_TO_CACHE = [...new Set(['/', ...BUILD_FILES])]

// The server sends "Vary: Origin", so script and css requests would not match
// the cached copies. ignoreVary tells the cache to skip that check.
const MATCH_OPTIONS = { ignoreVary: true }

// INSTALL: runs once when the service worker is first installed
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing and caching static files')

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      // Activate the new service worker straight away
      .then(() => self.skipWaiting())
  )
})

// ACTIVATE: clean up caches from older versions of the app
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((oldCache) => caches.delete(oldCache))
        )
      )
      // Take control of open pages without needing a reload
      .then(() => self.clients.claim())
  )
})

// FETCH: decide where each request should be answered from
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle simple GET requests from our own site
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return
  }

  // Page loads: try the network first, use the cached page when offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/', MATCH_OPTIONS))
    )
    return
  }

  // Static files (js, css, images): cache first, then network
  event.respondWith(
    caches.match(request, MATCH_OPTIONS).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      // Not in the cache yet, so download it and keep a copy for next time
      return fetch(request).then((networkResponse) => {
        // Only cache successful responses
        if (networkResponse.ok) {
          const copy = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return networkResponse
      })
    })
  )
})
