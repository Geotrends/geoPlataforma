/**
 * Banner de cookies: carga el HTML, lo muestra y guarda la elección en una cookie.
 * Incluir este script en las páginas donde quieras el aviso (junto con cookie-banner.css).
 */

(function () {
  'use strict';

  var COOKIE_NAME = 'geo_cookie_consent';
  var COOKIE_MAX_AGE_DAYS = 365;
  var BANNER_ID = 'cookie-banner';
  var GA4_MEASUREMENT_ID = 'G-KWZXRBBZVF';
  var GA4_LOADED_FLAG = '__geo_ga4_loaded__';

  function loadGa4IfNeeded() {
    try {
      if (!GA4_MEASUREMENT_ID) return;
      if (window[GA4_LOADED_FLAG]) return;
      window[GA4_LOADED_FLAG] = true;

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      }
      window.gtag = window.gtag || gtag;

      // Cargar gtag.js (GA4) dinámicamente
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
      document.head.appendChild(s);

      // Inicializar configuración (se cola en dataLayer incluso si el script aún no cargó)
      window.gtag('js', new Date());
      window.gtag('config', GA4_MEASUREMENT_ID);
    } catch (e) {
      // Si falla, no rompemos el sitio ni el banner
    }
  }

  function getBannerBasePath() {
    var scripts = document.querySelectorAll('script[src*="cookie-banner.js"]');
    if (scripts.length === 0) return 'cookies/';
    var src = scripts[scripts.length - 1].src;
    return src.replace(/\/cookie-banner\.js(\?.*)?$/, '/');
  }

  function getConsent() {
    var match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    return match ? match[1] : null;
  }

  function setConsent(value) {
    var maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
  }

  /** Borra cookies de GA4 cuando el usuario rechaza */
  function clearGaCookies() {
    var host = window.location.hostname || '';
    var domain = host === 'localhost' ? '' : '; domain=.' + host.split('.').slice(-2).join('.');
    var expire = '; path=/; max-age=0';
    var names = ['_ga', '_gid', '_ga_' + GA4_MEASUREMENT_ID.replace('G-', '')];
    for (var i = 0; i < names.length; i++) {
      document.cookie = names[i] + '=x' + expire;
      if (domain) document.cookie = names[i] + '=x' + expire + domain;
    }
  }

  function hideBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) {
      banner.setAttribute('aria-hidden', 'true');
      banner.hidden = true;
    }
  }

  function showBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) {
      banner.removeAttribute('aria-hidden');
      banner.hidden = false;
    }
  }

  function bindButtons() {
    var banner = document.getElementById(BANNER_ID);
    if (!banner) return;

    var acceptBtn = banner.querySelector('#cookie-banner-accept');
    var rejectBtn = banner.querySelector('#cookie-banner-reject');
    var policyLink = banner.querySelector('.cookie-banner-link');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('accepted');
        loadGa4IfNeeded();
        hideBanner();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent('rejected');
        clearGaCookies();
        hideBanner();
      });
    }
    if (policyLink) {
      policyLink.addEventListener('click', function (e) {
        var path = window.location.pathname || '';
        var isPolicyPage = path.indexOf('politicas-privacidad') !== -1;
        if (isPolicyPage) {
          e.preventDefault();
          hideBanner();
        }
      });
    }
  }

  function injectBanner() {
    if (document.getElementById(BANNER_ID)) return;

    var basePath = getBannerBasePath();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', basePath + 'cookie-banner.html', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        var wrap = document.createElement('div');
        wrap.innerHTML = xhr.responseText.trim();
        var banner = wrap.firstElementChild;
        if (banner) {
          document.body.appendChild(banner);
          bindButtons();
          if (getConsent() !== null) {
            hideBanner();
          } else {
            showBanner();
          }
        }
      }
    };
    xhr.send();
  }

  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadGa4IfNeeded();
    }

    if (consent !== null) {
      injectBanner();
      hideBanner();
      return;
    }

    injectBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
