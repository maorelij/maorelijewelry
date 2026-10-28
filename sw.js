// ─── Maor & Eli Jewelry Service Worker ───────────────────
const VERSION = 'maoreli-v19';
const CORE = ['/', '/index.html', '/manifest.json', '/install.html'];

// ── INSTALL ──────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// ── ACTIVATE ─────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // take control of all tabs immediately
      .then(() => {
        // Notify all open tabs to reload
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED', version: VERSION });
          });
        });
      })
  );
});

// ── FETCH ─────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Fonts → cache-first
  if (url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          caches.open(VERSION).then(c => c.put(e.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Images → cache-first
  if (url.includes('/images/') || url.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          caches.open(VERSION).then(c => c.put(e.request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Videos → cache-first (don't re-download the promo each time)
  if (url.includes('/videos/') || url.match(/\.(mp4|webm|mov)$/)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          // Only cache full 200 responses, not 206 partial content
          if (res.status === 200) {
            caches.open(VERSION).then(c => c.put(e.request, res.clone()));
          }
          return res;
        });
      })
    );
    return;
  }

  // HTML/JS/JSON → network-first, always fresh
  e.respondWith(
    fetch(e.request)
      .then(res => {
        caches.open(VERSION).then(c => c.put(e.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── MESSAGE ───────────────────────────────────────────────
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
