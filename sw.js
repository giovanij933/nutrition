// Bump the version string whenever you change index.html so clients pick up the new shell.
const CACHE = 'isx-fuel-v30';
// all ISIONXXX apps share one site and one cache storage: only ever clear this app's own old caches
const MINE = k => k.startsWith('isx-fuel-') || k.startsWith('nj-');
const SHELL = ['./', './index.html', './manifest.json', './icon.svg', './sync.js', './ui.js', './ui.css', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

// fetch this site's own files past the browser's HTTP cache (GitHub Pages lets it keep them ~10 min), so a new
// version never installs or refreshes with the previous one's files; other sites (fonts, runtimes) as usual
const net = r => new URL(r.url).origin === location.origin ? fetch(r.url, { cache: 'no-cache' }) : fetch(r);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => MINE(k) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: serve from cache instantly, refresh in the background.
// Also caches the IBM Plex Mono font files on first load so the app works offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/api\.github\.com|githubusercontent\.com/.test(e.request.url)) return;   // sync talks to GitHub live, never from cache
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(e.request);
      const fresh = net(e.request)
        .then(res => {
          if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
