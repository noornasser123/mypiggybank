self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("v1").then(cache =>
            cache.addAll([
                "./index.html",
                "./goal_tracker.css",
                "./manifest.json",
                "./your-piggy-image.png",
                "./your-piggy-image.png"
            ])
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
