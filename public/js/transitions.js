/**
 * Sistema de transiciones suaves entre páginas
 * Maneja el fade in/out al navegar entre secciones
 */

(function() {
  'use strict';

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Estado inicial para transición de entrada
    document.body.classList.add('transition-prep');
    markRevealItems();

    // Posicionar la página arriba al cargar
    scrollToTop();

    // Interceptar clics en enlaces de navegación
    setupNavigationTransitions();

    // Disparar la entrada en el siguiente frame para evitar "salto"
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        document.body.classList.add('loaded');
        document.body.classList.add('page-entered');
      });
    });
  }

  function scrollToTop() {
    // Safari y algunos WebKit no soportan behavior: 'instant' igual que Chrome
    function goTop() {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
    goTop();
    setTimeout(goTop, 100);
  }

  function setupNavigationTransitions() {
    // Seleccionar todos los enlaces internos del navbar
    const navLinks = document.querySelectorAll('.nav-links a, .nav-dropdown-menu a, .nav-services-panel a, .logo');
    
    navLinks.forEach(function(link) {
      // Solo procesar enlaces internos (no externos ni con #)
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      link.addEventListener('click', function(e) {
        // Obtener la ruta actual y la nueva ruta
        const currentPath = window.location.pathname;
        const newPath = new URL(href, window.location.href).pathname;
        
        // Si es un enlace a la misma página, no hacer transición
        if (currentPath === newPath || currentPath.endsWith(newPath) || newPath.endsWith(currentPath)) {
          return;
        }

        // Aplicar salida tipo diapositiva antes de navegar
        e.preventDefault();
        document.body.classList.add('page-transitioning');

        // Navegar después de un breve delay
        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  }

  function markRevealItems() {
    // Stagger para bloques principales sin tocar componentes internos complejos.
    var groups = document.querySelectorAll(
      'main > section, main > article, .proyectos-content, .contacto-main, .contacto-cards, .contacto-map-section, .blog-main, .blog-detail-main'
    );
    groups.forEach(function(el, index) {
      el.classList.add('reveal-item');
      el.style.setProperty('--reveal-delay', Math.min(index * 90, 540) + 'ms');
    });
  }

  // Manejar el botón de retroceso del navegador
  window.addEventListener('pageshow', function(event) {
    // bfcache (Safari): reaplicar clases de entrada para que CSS no quede colgado
    if (event.persisted) {
      document.body.classList.remove('page-transitioning', 'transition-prep');
      document.body.classList.add('loaded', 'page-entered');
      scrollToTop();
    }
  });

  // También hacer scroll al top cuando se carga la página normalmente
  window.addEventListener('load', function() {
    scrollToTop();
  });

})();
