/**
 * Enlaces "Idioma / Language": apuntan a /prefer-es y /prefer-en con ?next=
 * para (1) fijar cookie site_lang y (2) abrir la misma ruta + query en ES o EN.
 * Así no gana Accept-Language por encima de la elección del usuario.
 */
(function () {
    'use strict';

    function buildLangHrefs() {
        if (window.location.protocol === 'file:') return;

        var path = window.location.pathname || '/';
        if (path.length > 1 && path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }
        var search = window.location.search || '';
        var hash = window.location.hash || '';
        var suffix = search + hash;
        var isEn =
            path === '/en' ||
            path.indexOf('/en/') === 0 ||
            path.indexOf('/html/en') !== -1;

        var esPath;
        var enPath;
        if (isEn) {
            enPath = path + suffix;
            if (path.indexOf('/html/en') !== -1) {
                esPath = '/html' + path.slice('/html/en'.length) + suffix;
            } else if (path === '/en') {
                esPath = '/' + suffix;
            } else {
                esPath = path.slice('/en'.length) + suffix;
            }
        } else {
            esPath = path + suffix;
            if (path.indexOf('/html/') === 0 && path.indexOf('/html/en') === -1) {
                var enFromHtml = path.replace(/^\/html\//, '/html/en/');
                if (enFromHtml === '/html/en/') enFromHtml = '/html/en';
                enPath = enFromHtml + suffix;
            } else if (!path || path === '/') {
                enPath = '/en' + suffix;
            } else {
                enPath = '/en' + path + suffix;
            }
        }

        document.querySelectorAll('a.nav-lang-option[lang]').forEach(function (a) {
            var lang = a.getAttribute('lang');
            if (lang === 'es') {
                a.setAttribute('href', '/prefer-es?next=' + encodeURIComponent(esPath));
            } else if (lang === 'en') {
                a.setAttribute('href', '/prefer-en?next=' + encodeURIComponent(enPath));
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildLangHrefs);
    } else {
        buildLangHrefs();
    }
})();
