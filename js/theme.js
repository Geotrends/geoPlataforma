(function() {
  // Siempre activar tema oscuro
  function applyDarkTheme() {
    var html = document.documentElement;
    html.setAttribute('data-theme', 'dark');
    
    // Actualizar logo si es necesario
    var LOGO_DARK = '../img_video/home/isologo-02.png';
    document.querySelectorAll('.logo-img, .footer-logo-img').forEach(function(img) {
      if (img.src !== undefined) img.src = LOGO_DARK;
    });
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
