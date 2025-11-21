const CACHE_NAME = 'sophya-pwa-v1';

// Lista de arquivos que devem ser cacheados (armazenados)
// Adicione aqui todos os seus arquivos estáticos principais.
const urlsToCache = [
    '/', 
    '/index.html'
    // Não podemos cachear scripts de outras fontes (CDNs) no Service Worker
    // Mas index.html os carrega
];

// 1. Instalação: O SW é instalado e todos os arquivos essenciais são cacheados.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto e arquivos adicionados.');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Service Worker: Falha ao carregar o cache:', err))
    );
});

// 2. Ativação: Limpa caches antigos (se houver atualização de versão)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Deleta caches antigos
                    }
                })
            );
        })
    );
});

// 3. Busca (Fetch): Intercepta requisições e retorna os arquivos cacheados (Offline)
self.addEventListener('fetch', event => {
    // Tenta encontrar a requisição no cache
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se estiver no cache, retorna a versão offline
                if (response) {
                    return response;
                }
                // Caso contrário, busca na rede
                return fetch(event.request);
            })
    );
});
