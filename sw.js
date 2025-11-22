const CACHE_NAME = 'sophya-pwa-v4'; // Aumentei a versão para forçar o recache
const BASE_URL = self.location.origin;

// Lista de arquivos que DEVEM ser cacheados (Incluindo CDNs para funcionar OFFLINE)
const urlsToCache = [
    '/', 
    '/index.html',
    '/manifest.json',
    '/styles.css',
    
    // CRUCIAL: CDNs para o App rodar offline (Tailwind, React, ReactDOM, Babel)
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    // Ícone 
    'https://i.imgur.com/mP04ist.jpeg' 
];

// 1. Instalação: O SW é instalado e todos os arquivos essenciais são cacheados.
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto e arquivos adicionados.');
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`Falha ao cachear: ${url}. O App pode não ser 100% offline sem isso.`, err);
                        });
                    })
                );
            })
            .catch(err => console.error('Service Worker: Falha ao carregar o cache principal:', err))
    );
});

// 2. Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        self.clients.claim().then(() => {
            return caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            console.log('Service Worker: Deletando cache antigo:', cacheName);
                            return caches.delete(cacheName); 
                        }
                    })
                );
            });
        })
    );
});

// 3. Busca (Fetch): Estratégia Cache-First
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se estiver no cache, retorna a versão offline
                if (response) {
                    return response;
                }
                
                // Caso contrário, busca na rede
                return fetch(event.request).catch(error => {
                    console.log('Falha na rede e não encontrado no cache:', event.request.url, error);
                });
            })
    );
});
