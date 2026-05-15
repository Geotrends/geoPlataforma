/**
 * Selector Idioma / Language:
 * - Enlace directo a la misma página en ES o EN (funciona en hosting estático: S3, CloudFront, etc.).
 * - Al hacer clic se guarda la cookie site_lang (1 año) para que un servidor Express, si existe,
 *   pueda alinear URL con la elección del usuario. En estático puro, solo importa la URL destino.
 */
(function () {
    'use strict';

    var COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

    function setLangCookie(value) {
        if (value !== 'es' && value !== 'en') return;
        var parts = [
            'site_lang=' + encodeURIComponent(value),
            'path=/',
            'max-age=' + COOKIE_MAX_AGE,
            'SameSite=Lax',
        ];
        if (window.location.protocol === 'https:') {
            parts.push('Secure');
        }
        document.cookie = parts.join('; ');
    }

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
                a.setAttribute('href', esPath);
            } else if (lang === 'en') {
                a.setAttribute('href', enPath);
            }
        });
    }

    /** Cookie antes de seguir el enlace (útil con Express + middleware de idioma). */
    document.addEventListener(
        'click',
        function (e) {
            var a = e.target && e.target.closest && e.target.closest('a.nav-lang-option[lang]');
            if (!a) return;
            var lang = a.getAttribute('lang');
            if (lang === 'es') {
                setLangCookie('es');
            } else if (lang === 'en') {
                setLangCookie('en');
            }
        },
        true
    );

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildLangHrefs);
    } else {
        buildLangHrefs();
    }
})();
