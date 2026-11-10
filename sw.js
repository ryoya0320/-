const CACHE = 'studyflow-v4';
const ASSETS = [
  './', './index.html?v=4', './style.css?v=4', './questions.js?v=4',
  './update-v4.js?v=4', './script.js?v=4', './manifest.json?v=4', './icon.svg'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => undefined));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppFile = url.origin === self.location.origin;
  if (!isAppFile) return;
  // Network first prevents an old questions.js/script.js from staying forever.
  event.respondWith(
    fetch(event.request, {cache: 'no-store'})
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html?v=4')))
  );
});
