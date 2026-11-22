const C='kahve-v3';
const F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// İnternet varsa en güncel sürümü al ve önbelleğe yaz; yoksa önbellekten aç.
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  // Sürüm kontrolü isteklerini (?_=...) hiç önbelleğe alma ve önbellekten cevaplama.
  if(new URL(req.url).searchParams.has('_'))return;
  e.respondWith(
    fetch(req,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));return r})
      .catch(()=>caches.match(req).then(m=>m||(req.mode==='navigate'?caches.match('./index.html'):undefined)))
  );
});
