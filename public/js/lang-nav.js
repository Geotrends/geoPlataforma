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
        var isEn = path === '/en' || path.indexOf('/en/') === 0;

        var esPath;
        var enPath;
        if (isEn) {
            enPath = path + search;
            if (path === '/en') {
                esPath = '/' + search;
            } else {
                esPath = path.slice('/en'.length) + search;
            }
        } else {
            esPath = path + search;
            if (!path || path === '/') {
                enPath = '/en' + search;
            } else {
                enPath = '/en' + path + search;
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
