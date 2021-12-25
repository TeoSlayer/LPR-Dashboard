self.addEventListener("install", function (event) {
    console.log("Hello world from the Service Worker 🤙");
    event.waitUntil(
        caches.open("v1").then(function (cache) {
            console.log("Opened cache");
            return cache.addAll([
                "/",
                "/pwa.webmanifest",
                "/pwa.js",
            ]);
        })
    );
});