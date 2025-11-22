// Service Worker Simplificado
// Serve apenas para permitir que o botão "Instalar" apareça no navegador.
// Não faz cache offline complexo.

self.addEventListener('install', (e) => {
  // Instalação imediata
  self.skipWaiting();
  console.log('Service Worker: Instalado (Modo Atalho)');
});

self.addEventListener('activate', (e) => {
  // Ativação imediata
  console.log('Service Worker: Ativo');
});

self.addEventListener('fetch', (e) => {
  // Não faz nada especial, apenas deixa a internet carregar normal
  // Isso garante que o site precisa de internet para abrir
});
