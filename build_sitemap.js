const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const DOMAIN = 'https://yerailorenzo.com';
const OUTPUT_FILE = 'sitemap.xml';

// 1. Archivos/Carpetas a ignorar por nombre
const IGNORE_FILES = ['404.html', 'google', '_', 'robots.txt', 'sitemap.xml'];

// 2. Extensiones permitidas (Solo HTML ahora)
const ALLOWED_EXTENSIONS = ['.html'];
// ---------------------

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Ignorar carpetas de sistema, ocultas o de funciones
            if (file !== 'node_modules' && file !== '.git' && file !== 'functions' && !file.startsWith('.')) {
                getFiles(filePath, fileList);
            }
        } else {
            const ext = path.extname(file).toLowerCase();

            // FILTRO 1: Solo extensiones .html
            if (ALLOWED_EXTENSIONS.includes(ext)) {

                // FILTRO 2: Ignorar archivos prohibidos por nombre
                const shouldIgnoreName = IGNORE_FILES.some(ignore => file.includes(ignore));

                if (!shouldIgnoreName) {
                    // FILTRO 3: LEER CONTENIDO PARA BUSCAR "NOINDEX"
                    const content = fs.readFileSync(filePath, 'utf8');

                    // Regex para detectar <meta name="robots" content="...noindex...">
                    // Soporta comillas simples/dobles y espacios, e ignora mayúsculas/minúsculas
                    const hasNoIndex = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(content) ||
                        /<meta[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(content);

                    if (hasNoIndex) {
                        console.log(`🙈 Ignorando (tiene noindex): ${file}`);
                    } else {
                        fileList.push(filePath);
                    }
                }
            }
        }
    });
    return fileList;
}

console.log('🔍 Escaneando archivos HTML...');
const files = getFiles('./');

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

files.forEach(file => {
    // Normalizar ruta (Windows/Linux)
    let urlPath = file.replace(/\\/g, '/');

    // Quitar './' del inicio
    if (urlPath.startsWith('./')) urlPath = urlPath.substring(2);

    // --- LIMPIEZA DE URLS ---

    // 1. Si es index.html -> raíz de carpeta
    if (urlPath.endsWith('index.html')) {
        urlPath = urlPath.replace('index.html', '');
    }
    // 2. Si es otro .html -> quitar extensión
    else if (urlPath.endsWith('.html')) {
        urlPath = urlPath.replace('.html', '');
    }

    // Construir URL absoluta
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