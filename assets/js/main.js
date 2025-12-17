document.addEventListener("DOMContentLoaded", function () {

    /* --- 1. Back to Top Button --- */
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.desktop-nav');

    // 1. Abrir menú principal
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        nav.classList.toggle('active');

        // Bloquear scroll del fondo
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // 2. Manejo del Dropdown (Acordeón)
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(drop => {
        const link = drop.querySelector('.nav-link');

        // Importante: Usamos una función anónima para controlar el evento
        link.addEventListener('click', (e) => {
            // Solo activar lógica de acordeón si estamos en móvil (< 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Evita navegar si hay href
                drop.classList.toggle('open'); // Añade/Quita la clase que muestra el CSS
            }
        });
    });

    // 3. Cerrar menú al hacer clic en enlaces normales
    const links = document.querySelectorAll('a:not(.dropdown .nav-link)');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// Cookies
document.addEventListener("DOMContentLoaded", function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const declineBtn = document.getElementById('decline-cookies-btn');
    const resetBtn = document.getElementById('reset-consent-btn');

    // 1. Check if user has already made a choice
    const userConsent = localStorage.getItem('cookieConsent');

    if (!userConsent) {
        // Case A: No choice made yet -> Show banner, hide reset button
        cookieBanner.style.display = 'flex';
        resetBtn.style.display = 'none';
    } else {
        // Case B: Choice already made -> Hide banner, show reset button
        cookieBanner.style.display = 'none';
        resetBtn.style.display = 'block';

        // If they previously accepted, load the scripts
        if (userConsent === 'accepted') {
            loadCookies();
        }
    }

    // 2. Accept Button Logic
    acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.display = 'none';
        resetBtn.style.display = 'block'; // Show the reset button now
        loadCookies();
    });

    // 3. Decline Button Logic
    declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.style.display = 'none';
        resetBtn.style.display = 'block'; // Show the reset button now
    });

    // 4. Reset Button Logic (The new part)
    resetBtn.addEventListener('click', function () {
        // Clear the memory
        localStorage.removeItem('cookieConsent');
        // Reload the page to reset all scripts to their blocked state
        location.reload();
    });

    // Helper Function: Load Scripts
    function loadCookies() {
        const scripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');

        scripts.forEach(function (script) {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.innerHTML = script.innerHTML;
            }
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'type' && attr.name !== 'data-cookie-category') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            document.head.appendChild(newScript);
            // Optional: Prevent duplicate loading if function is called twice
            script.parentNode.removeChild(script);
        });
    }
});