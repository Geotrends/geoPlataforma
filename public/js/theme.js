(function() {
  // Siempre activar tema oscuro
  function applyDarkTheme() {
    var html = document.documentElement;
    html.setAttribute('data-theme', 'dark');
    
    // Actualizar logo si es necesario
    var LOGO_DARK = '../img_video/home/isologo-02.webp';
    document.querySelectorAll('.logo-img, .footer-logo-img').forEach(function(img) {
      if (img.src !== undefined) img.src = LOGO_DARK;
    });

    // Icono de pestaña: misma marca que el hero, pero en PNG cuadrado 256×256 (logo.webp es muy ancho y se veía “aplastado”)
    var FAVICON_HERO = '/img_video/home/favicon-hero.png?v=2';
    var favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('type', 'image/png');
    favicon.setAttribute('sizes', 'any');
    favicon.setAttribute('href', FAVICON_HERO);

    var apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (!apple) {
      apple = document.createElement('link');
      apple.setAttribute('rel', 'apple-touch-icon');
      document.head.appendChild(apple);
    }
    apple.setAttribute('href', FAVICON_HERO);
  }

  function init() {
    applyDarkTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
