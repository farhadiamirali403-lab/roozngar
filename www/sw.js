/* روزنگار · سرویس‌ورکر: کش کامل پوسته برنامه برای کار بدون اینترنت */
const CACHE = 'roozngar-v2.1';
const ASSETS = ['./', 'index.html', 'styles.css', 'core.js', 'native.js', 'charts.js', 'ui.js', 'views.js', 'app.js', 'manifest.webmanifest', 'fonts/Vazirmatn-Variable.woff2', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
