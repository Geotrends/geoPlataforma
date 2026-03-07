(function() {
  var STORAGE_KEY = 'geoPlataforma-theme';
  var THEME_LIGHT = 'light';
  var THEME_DARK = 'dark';
  var LOGO_LIGHT = '../img_video/home/isologo-02.png';
  var LOGO_DARK = '../img_video/home/isologo-02.png';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || THEME_LIGHT;
    } catch (e) {
      return THEME_LIGHT;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  function updateLogo(theme) {
    var src = theme === THEME_DARK ? LOGO_DARK : LOGO_LIGHT;
    document.querySelectorAll('.logo-img, .footer-logo-img').forEach(function(img) {
      if (img.src !== undefined) img.src = src;
    });
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === THEME_DARK) {
      html.setAttribute('data-theme', THEME_DARK);
    } else {
      html.removeAttribute('data-theme');
    }
    updateToggleUI(theme);
    updateLogo(theme);
  }

  function updateToggleUI(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme === THEME_DARK;
    btn.setAttribute('aria-label', isDark ? 'Usar modo claro' : 'Usar modo oscuro');
    btn.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
    /* En modo oscuro mostramos el sol para volver a tema claro; en modo claro mostramos la luna para ir a oscuro */
    btn.querySelector('.nav-theme-icon-sun').hidden = !isDark;
    btn.querySelector('.nav-theme-icon-moon').hidden = isDark;
  }

  function init() {
    var theme = getStoredTheme();
    applyTheme(theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function() {
        var current = getStoredTheme();
        var next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        setStoredTheme(next);
        applyTheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
