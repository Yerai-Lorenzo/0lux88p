export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. LISTA DE RUTAS ELIMINADAS (410 GONE) - Exactas
    const gonePaths = new Set([
        '/modern.svg',
        '/cropped-favicon-32x32.png',
        '/cropped-favicon-180x180.png',
        '/cropped-favicon-192x192.png',
        '/gluglu-logo.svg',
        '/ejemplo-senales-confusas-1024x657.jpg',
        '/auditoria-semrush.jpg',
        '/rankings-sin-resultados.jpg',
        '/rankings-atascados.jpg',
        '/rankings-penalizados.jpg',
        '/ejemplo-contenido-desalineado-1024x605.jpg',
        '/meme-hombre-con-taza-1024x576.jpg',
        '/yerailorenzo-consultor-seo-video.jpg',
        '/ejemplo-mala-estructura-1024x557.jpg',
        '/cookie_data',
        '/wp-json/',
        '/v1/',
        '/admin-ajax.php',
        '/siteground-optimizer-combined-css-97c9b311f1ff6548e69051ab9ca0b638.css',
        '/banner-1-optin.css',
        '/siteground-optimizer-combined-css-3d93b841201f7c2b4a3f6ddc4f18ed3d.css',
        '/siteground-optimizer-combined-css-4ed1088744cd3d034a26256b137f250e.css',
        '/siteground-optimizer-combined-css-321ae26fab5e3dac2251a111c4c4a65c.css',
        '/p-e1255160.js',
        '/web-components.esm.js',
        '/p-ab62d96d.js',
        '/p-dfe6b15e.js',
        '/hooks.min.js',
        '/lazysizes.min.js',
        '/p-f49656fd.js',
        '/jquery.min.js',
        '/p-43f79dfb.js',
        '/i18n.min.js',
        '/p-752738a7.entry.js',
        '/p-0cd37339.entry.js',
        '/p-b9156af0.js',
        '/siteground-optimizer-combined-js-bc6b2775263addced9f36d65bdcc6b26.js',
        '/siteground-optimizer-combined-js-eac3dc0317eb24f2fe06bf55f235330b.js',
        '/siteground-optimizer-combined-js-a10669a278743f6bde0544cfbc15a03e.js',
        '/siteground-optimizer-combined-js-ec7bf2b290d3e0b7e7b074554987ffa6.js',
        '/dom-ready.min.js',
        '/siteground-optimizer-combined-js-f5f0aabe2279dacc10891bfef46a4a43.js',
        '/siteground-optimizer-combined-js-35d9c140a4441d9fbb57c5f439f80a1c.js',
        '/siteground-optimizer-combined-js-6d6ffa38a16c8ff50a38200c527daa6f.js',
        '/siteground-optimizer-combined-js-128f0b4f3e0e51a706b288cb0d3ccece.js'
    ]);

    // 2. VERIFICACIÓN DE PATRONES (wp-content o wp-includes)
    const isWordPressPath = pathname.includes('wp-content') || pathname.includes('wp-includes');

    // Si la ruta está en la lista O contiene los patrones de WordPress, devolvemos 410.
    if (gonePaths.has(pathname) || isWordPressPath) {
        return new Response("410 Gone", {
            status: 410,
            statusText: "Gone",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
                "Cache-Control": "public, max-age=604800"
            }
        });
    }

    // 3. COMPORTAMIENTO POR DEFECTO
    return next();
}