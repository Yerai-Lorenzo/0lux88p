const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const DOMAIN = 'https://yerailorenzo.com';
const OUTPUT_FILE = 'sitemap.xml';

// 1. Qué archivos ignorar por nombre (ej. error pages, google verification)
const IGNORE_FILES = ['404.html', 'google', '_', 'robots.txt', 'sitemap.xml'];

// 2. Qué extensiones incluir (HTML + Imágenes)
const ALLOWED_EXTENSIONS = [
    '.html',
    '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'
];
// ---------------------

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Ignorar carpetas de sistema/build
            if (file !== 'node_modules' && file !== '.git' && file !== 'functions') {
                getFiles(filePath, fileList);
            }
        } else {
            const ext = path.extname(file).toLowerCase();

            // FILTRO PRINCIPAL: Solo extensiones permitidas
            if (ALLOWED_EXTENSIONS.includes(ext)) {

                // FILTRO SECUNDARIO: Ignorar archivos prohibidos por nombre
                const shouldIgnore = IGNORE_FILES.some(ignore => file.includes(ignore));

                if (!shouldIgnore) {
                    fileList.push(filePath);
                }
            }
        }
    });
    return fileList;
}

console.log('🔍 Escaneando archivos...');
const files = getFiles('./');

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

files.forEach(file => {
    // Convertir ruta de sistema a URL (Windows/Linux compatible)
    let urlPath = file.replace(/\\/g, '/');

    // Quitar './' del inicio si existe
    if (urlPath.startsWith('./')) urlPath = urlPath.substring(2);

    // --- LÓGICA DE URLS ---

    // Caso 1: Es un archivo index.html -> Se convierte en la raíz de la carpeta
    if (urlPath.endsWith('index.html')) {
        urlPath = urlPath.replace('index.html', '');
    }
    // Caso 2: Es cualquier otro HTML -> Le quitamos la extensión (URL limpia)
    else if (urlPath.endsWith('.html')) {
        urlPath = urlPath.replace('.html', '');
    }
    // Caso 3: Es una imagen -> DEJAMOS la extensión (ej: foto.jpg)
    else {
        // No hacemos nada, mantenemos .jpg, .png, etc.
    }

    // Construir URL final absoluta
    const finalUrl = `${DOMAIN}/${urlPath}`.replace(/([^:]\/)\/+/g, "$1");

    sitemapContent += `
    <url>
        <loc>${finalUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </url>`;
});

sitemapContent += `
</urlset>`;

fs.writeFileSync(OUTPUT_FILE, sitemapContent);
console.log(`✅ Sitemap generado con éxito: ${files.length} URLs añadidas.`);
