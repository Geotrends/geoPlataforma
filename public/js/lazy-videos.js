/**
 * Vídeos decorativos (autoplay + muted): por defecto no descargan hasta estar cerca del viewport.
 * En la home, el hero y el vídeo IoT (sección Geotrends) cargan siempre de inmediato.
 * Expone window.geoLazyVideosRefresh() por si el layout cambia (p. ej. filtros en proyectos).
 */
(function () {
    var ROOT_MARGIN = '180px 0px';

    /** Siempre con prioridad: mismo comportamiento en cualquier tamaño de pantalla. */
    function isEagerPriorityVideo(v) {
        return v.matches && (v.matches('.hero-video-bg') || v.matches('.geotrends-video'));
    }

    function isNearViewport(el) {
        var r = el.getBoundingClientRect();
        var m = 200;
        return r.bottom > -m && r.top < (window.innerHeight || document.documentElement.clientHeight) + m;
    }

    function isEffectivelyHidden(el) {
        if (!el || !el.getBoundingClientRect) return true;
        var r = el.getBoundingClientRect();
        if (r.width < 2 && r.height < 2) return true;
        var st = window.getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return true;
        return false;
    }

    /**
     * @param {HTMLVideoElement} v
     * @param {{ skipLoad?: boolean }} opts Si skipLoad: no llamar a load() (evita evento "abort" que
     *   en inicio.js activaba el fallback del hero y ocultaba el vídeo al reiniciar la descarga).
     */
    function activateVideo(v, opts) {
        if (!v || v.dataset.lazyActivated === '1') return;
        opts = opts || {};
        v.dataset.lazyActivated = '1';
        v.preload = 'auto';
        if (!opts.skipLoad) {
            try {
                v.load();
            } catch (e) {}
        }
        try {
            v.muted = true;
            v.setAttribute('muted', '');
            var p = v.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (e2) {}
    }

    function tryActivate(v) {
        if (v.dataset.lazyActivated === '1') return;
        if (isEffectivelyHidden(v)) return;
        if (isNearViewport(v)) activateVideo(v);
    }

    function collect() {
        return Array.prototype.slice.call(
            document.querySelectorAll('video[autoplay][muted]')
        );
    }

    function init() {
        var videos = collect();
        if (!videos.length) return;

        var lazyList = [];
        videos.forEach(function (v) {
            if (isEagerPriorityVideo(v)) {
                v.preload = 'auto';
                activateVideo(v, { skipLoad: true });
            } else {
                v.preload = 'none';
                lazyList.push(v);
            }
        });

        function onIntersect(entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) tryActivate(entry.target);
            });
        }

        var io =
            'IntersectionObserver' in window
                ? new IntersectionObserver(onIntersect, {
                      root: null,
                      rootMargin: ROOT_MARGIN,
                      threshold: 0.01,
                  })
                : null;

        lazyList.forEach(function (v) {
            tryActivate(v);
            if (io && v.dataset.lazyActivated !== '1') io.observe(v);
        });

        if (!io) {
            lazyList.forEach(function (v) {
                tryActivate(v);
            });
        }
    }

    window.geoLazyVideosRefresh = function (root) {
        var scope = root && root.querySelectorAll ? root : document;
        var list = scope.querySelectorAll
            ? scope.querySelectorAll('video[autoplay][muted]')
            : collect();
        Array.prototype.forEach.call(list, function (v) {
            if (v.dataset.lazyActivated === '1') return;
            tryActivate(v);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
