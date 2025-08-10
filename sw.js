const CACHE_NAME = 'piggybank-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/feedback.html',
    '/dashboard.html',
    '/history.html',
    '/goal_tracker.html',
    '/feedback.css',
    '/feedback.js',
    '/your-piggy-image.png'
    // Add other files you want to cache here
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
