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
    // Marcar el body como cargado para evitar parpadeo
    document.body.classList.add('loaded');

    // Posicionar la página arriba al cargar
    scrollToTop();

    // Interceptar clics en enlaces de navegación
    setupNavigationTransitions();
  }

  function scrollToTop() {
    // Scroll suave al top de la página al cargar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Usar 'instant' para que sea inmediato sin animación
    });

    // También asegurar que el scroll esté en 0 después de un breve delay
    // por si hay contenido que se carga dinámicamente
    setTimeout(function() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
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

        // Aplicar fade out antes de navegar
        e.preventDefault();
        document.body.classList.add('page-transitioning');

        // Navegar después de un breve delay
        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  }

  // Manejar el botón de retroceso del navegador
  window.addEventListener('pageshow', function(event) {
    // Si la página se carga desde el cache, asegurar que esté visible
    if (event.persisted) {
      document.body.classList.remove('page-transitioning');
      document.body.classList.add('loaded');
      scrollToTop();
    }
  });

  // También hacer scroll al top cuando se carga la página normalmente
  window.addEventListener('load', function() {
    scrollToTop();
  });

})();
