(function() {
    'use strict';

    // Crear el botón si no existe
    function createScrollTopButton() {
        // Verificar si ya existe
        if (document.getElementById('scroll-top-btn')) {
            return;
        }

        // Crear el botón
        var button = document.createElement('button');
        button.id = 'scroll-top-btn';
        button.className = 'scroll-top-btn';
        button.setAttribute('aria-label', 'Volver arriba');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
        `;
        
        // Agregar al body
        document.body.appendChild(button);

        // Funcionalidad de scroll
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Mostrar/ocultar según el scroll (throttled con rAF)
        function toggleScrollButton() {
            var scrollY = window.scrollY || window.pageYOffset;
            var button = document.getElementById('scroll-top-btn');
            
            if (button) {
                // Mostrar la flecha desde el inicio del scroll (50px) para que esté visible durante todo el recorrido
                if (scrollY > 50) {
                    button.classList.add('visible');
                } else {
                    button.classList.remove('visible');
                }
            }
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function() {
                toggleScrollButton();
                ticking = false;
            });
        }

        // Escuchar eventos de scroll
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Verificar al cargar
        toggleScrollButton();
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScrollTopButton);
    } else {
        createScrollTopButton();
    }
})();
