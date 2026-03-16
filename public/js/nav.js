(function() {
    'use strict';

    // Dropdowns navbar: clic en "Servicios" o "Proyectos" para abrir/cerrar (desktop y hamburguesa, todas las páginas)
    document.addEventListener('click', function(e) {
        var toggle = e.target.closest('.nav-dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            e.stopPropagation();
            var parent = toggle.closest('.nav-dropdown');
            if (!parent) return;
            var isOpen = parent.classList.contains('open');
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            if (!isOpen) parent.classList.add('open');
            toggle.setAttribute('aria-expanded', !isOpen);
            return;
        }
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
            document.querySelectorAll('.nav-dropdown-toggle').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
        }
    }, true);

    // Menú hamburguesa (móvil): abrir/cerrar y desplegables hacia abajo
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!navbar || !hamburger) return;

    function isMobile() { return window.innerWidth <= 1100; }

    // Crear overlay si no existe
    var overlay = document.querySelector('.nav-mobile-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-mobile-overlay';
        document.body.appendChild(overlay);
    }

    function closeMobileMenu() {
        navbar.classList.remove('nav-mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú');
        document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
        document.querySelectorAll('.nav-dropdown-item-with-panel').forEach(function(d) { d.classList.remove('sub-open'); });
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(function() {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    hamburger.addEventListener('click', function() {
        if (!isMobile()) return;
        var isOpen = navbar.classList.contains('nav-mobile-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navbar.classList.add('nav-mobile-open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Cerrar menú');
            if (overlay) {
                overlay.style.display = 'block';
                setTimeout(function() {
                    overlay.classList.add('active');
                }, 10);
            }
        }
    });

    // Cerrar menú al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (isMobile()) {
                closeMobileMenu();
            }
        });
    }

    // Desplegar/plegar subopciones (Ciudades / Industria) al tocar en el menú móvil
    if (navLinks) {
        navLinks.addEventListener('click', function(e) {
            if (!isMobile()) return;
            var itemWithPanel = e.target.closest('.nav-dropdown-item-with-panel');
            var link = e.target.closest('a');
            var insidePanel = e.target.closest('.nav-services-panel');
            // Clic en "Ciudades" o "Industria" (el <a> que es hijo directo del li): desplegar subopciones
            if (link && itemWithPanel && !insidePanel && link.parentNode === itemWithPanel) {
                e.preventDefault();
                e.stopPropagation();
                var parentMenu = itemWithPanel.closest('.nav-dropdown-menu');
                if (parentMenu) {
                    parentMenu.querySelectorAll('.nav-dropdown-item-with-panel').forEach(function(sib) {
                        if (sib !== itemWithPanel) sib.classList.remove('sub-open');
                    });
                }
                itemWithPanel.classList.toggle('sub-open');
                return;
            }
            if (link && insidePanel) {
                closeMobileMenu();
                return;
            }
            if (link && !e.target.closest('.nav-dropdown-toggle')) {
                closeMobileMenu();
            }
        }, true);
    }

    document.addEventListener('click', function(e) {
        if (!isMobile()) return;
        var link = e.target.closest('a');
        if (link && e.target.closest('.nav-links') && !e.target.closest('.nav-dropdown-toggle')) {
            closeMobileMenu();
        }
    }, false);

    window.addEventListener('resize', function() {
        if (!isMobile()) {
            closeMobileMenu();
        }
    });

    // Cerrar menú al hacer scroll (opcional, mejora UX)
    var lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        if (!isMobile()) return;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(scrollTop - lastScrollTop) > 50) {
            if (navbar.classList.contains('nav-mobile-open')) {
                closeMobileMenu();
            }
        }
        lastScrollTop = scrollTop;
    }, { passive: true });
})();
