const CACHE = 'mr-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    './','/','index.html','css/style.css','js/app.js','manifest.json','img/icon-192.png','img/icon-512.png'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});