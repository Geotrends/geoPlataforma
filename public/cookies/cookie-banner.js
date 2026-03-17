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

  function getBannerMarkup() {
    return (
      '<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Aviso de cookies" aria-modal="true" hidden>' +
      '  <div class="cookie-banner-backdrop" aria-hidden="true"></div>' +
      '  <div class="cookie-banner-dialog">' +
      '    <div class="cookie-banner-header">' +
      '      <span class="cookie-banner-icon" aria-hidden="true">' +
      '        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">' +
      '          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm4.5 4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-6 2c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S6.5 16.33 6.5 15.5 7.17 14 8 14zm3 4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm.5-14c-.28 0-.5.22-.5.5V5h-.5c-.28 0-.5.22-.5.5s.22.5.5.5h.5v.5c0 .28.22.5.5.5s.5-.22.5-.5V6h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H12V4.5c0-.28-.22-.5-.5-.5z"/>' +
      '        </svg>' +
      '      </span>' +
      '      <h2 class="cookie-banner-title">Aviso sobre cookies</h2>' +
      '    </div>' +
      '    <p class="cookie-banner-text">' +
      '      Este sitio utiliza cookies técnicas y, en su caso, de análisis, para el correcto funcionamiento de los servicios y la medición de uso. Los detalles se encuentran en nuestra ' +
      '      <a href="/politicas-privacidad" class="cookie-banner-link">política de privacidad y cookies</a>.' +
      '    </p>' +
      '    <div class="cookie-banner-actions">' +
      '      <button type="button" class="cookie-banner-btn cookie-banner-btn-accept" id="cookie-banner-accept" aria-label="Aceptar cookies">Aceptar</button>' +
      '      <button type="button" class="cookie-banner-btn cookie-banner-btn-reject" id="cookie-banner-reject" aria-label="Rechazar cookies">Rechazar</button>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

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

    var wrap = document.createElement('div');
    wrap.innerHTML = getBannerMarkup();
    var banner = wrap.firstElementChild;
    if (!banner) return;

    document.body.appendChild(banner);
    bindButtons();
    if (getConsent() !== null) {
      hideBanner();
    } else {
      showBanner();
    }
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
