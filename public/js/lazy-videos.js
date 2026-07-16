/**
 * Vídeos decorativos (autoplay + muted): por defecto no descargan hasta estar cerca del viewport.
 * En la home, el hero y el vídeo IoT (sección Geotrends) cargan siempre de inmediato.
 * Expone window.geoLazyVideosRefresh() por si el layout cambia (p. ej. filtros en proyectos).
 * Garantiza reproducción en Safari/iOS/Android: muted + playsinline + reintento al hacerse visibles.
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
        // No usar opacity: las cards animan de 0→1 y bloqueaban la activación del video
        if (st.display === 'none' || st.visibility === 'hidden') return true;
        // Si un ancestro (p. ej. la card) está oculto, el vídeo tampoco debe activarse
        var p = el.parentElement;
        while (p && p !== document.body) {
            var pst = window.getComputedStyle(p);
            if (pst.display === 'none' || pst.visibility === 'hidden') return true;
            p = p.parentElement;
        }
        return false;
    }

    /** Atributos / props necesarios para autoplay en Safari, iOS y Android. */
    function prepareForAutoplay(v) {
        if (!v) return;
        v.muted = true;
        v.defaultMuted = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', 'true');
        v.playsInline = true;
        v.setAttribute('autoplay', '');
        v.loop = true;
        // Evita que controles nativos o PiP interrumpan el loop decorativo
        v.removeAttribute('controls');
        v.disablePictureInPicture = true;
    }

    function tryPlay(v) {
        if (!v) return;
        prepareForAutoplay(v);
        try {
            var p = v.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () {
                    // Reintento breve: iOS a veces rechaza el primer play tras mostrar el elemento
                    setTimeout(function () {
                        if (isEffectivelyHidden(v)) return;
                        prepareForAutoplay(v);
                        var p2 = v.play();
                        if (p2 && typeof p2.catch === 'function') p2.catch(function () {});
                    }, 120);
                });
            }
        } catch (e) {}
    }

    /**
     * @param {HTMLVideoElement} v
     * @param {{ skipLoad?: boolean }} opts Si skipLoad: no llamar a load() (evita evento "abort" que
     *   en inicio.js activaba el fallback del hero y ocultaba el vídeo al reiniciar la descarga).
     */
    function activateVideo(v, opts) {
        if (!v) return;
        opts = opts || {};
        prepareForAutoplay(v);
        v.dataset.lazyActivated = '1';
        v.preload = 'auto';
        if (!opts.skipLoad) {
            try {
                // Solo load() si aún no hay datos (evita reinicios innecesarios)
                if (v.readyState < 2) v.load();
            } catch (e) {}
        }
        tryPlay(v);
    }

    function tryActivate(v) {
        if (isEffectivelyHidden(v)) {
            // Pausar vídeos ocultos (ahorro + evita que queden congelados al volver)
            try {
                if (!v.paused) v.pause();
            } catch (e) {}
            return;
        }
        if (v.dataset.lazyActivated === '1') {
            // Ya activado: si está visible y pausado (p. ej. tras cambiar de pestaña), reanudar
            if (v.paused) tryPlay(v);
            return;
        }
        if (isNearViewport(v)) activateVideo(v);
    }

    function collect() {
        return Array.prototype.slice.call(
            document.querySelectorAll('video[autoplay][muted], video.proyecto-card-video')
        );
    }

    function init() {
        var videos = collect();
        if (!videos.length) return;

        var lazyList = [];
        videos.forEach(function (v) {
            prepareForAutoplay(v);
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

        // iOS/Safari: al volver a la pestaña, reanudar vídeos visibles
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) return;
            collect().forEach(function (v) {
                if (!isEffectivelyHidden(v) && v.paused) tryPlay(v);
            });
        });
    }

    /**
     * Revisa vídeos en un contenedor (o en todo el documento) y activa/reanuda los visibles.
     * Llamar tras filtrar tags de proyectos o mostrar/ocultar portadas.
     */
    window.geoLazyVideosRefresh = function (root) {
        var scope = root && root.querySelectorAll ? root : document;
        var list = scope.querySelectorAll
            ? scope.querySelectorAll('video[autoplay][muted], video.proyecto-card-video')
            : collect();
        Array.prototype.forEach.call(list, function (v) {
            tryActivate(v);
            // Si ya estaba activado y ahora es visible, forzar play
            if (!isEffectivelyHidden(v) && v.dataset.lazyActivated === '1') {
                tryPlay(v);
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
