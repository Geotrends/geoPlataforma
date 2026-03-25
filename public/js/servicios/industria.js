// Tarjetas de servicios: animación se repite al subir/bajar con scroll
(function() {
    var view = document.querySelector('.section-view');
    if (!view) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) view.classList.add('section-cards-animated');
            else view.classList.remove('section-cards-animated');
        });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    observer.observe(view);
})();

var sectionContent = document.querySelector('.section-content');
var firstCardId = 'servicio-iot';
var isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en') || window.location.pathname.startsWith('/en/');
var serviciosIndustria = [
    { id: 'servicio-iot', label: 'IoT' },
    { id: 'servicio-control-ruido', label: isEnglish ? 'Noise control' : 'Control de ruido' },
    { id: 'servicio-clasificacion-fuentes', label: isEnglish ? 'Source labeling' : 'Etiquetado acústico' },
    { id: 'servicio-modelacion-ruido', label: isEnglish ? 'Noise modeling' : 'Modelación de ruido' },
    { id: 'servicio-holografia-acustica', label: isEnglish ? 'Acoustic holography' : 'Holografía acústica' },
    { id: 'servicio-medicion-vibraciones', label: isEnglish ? 'Vibration measurement' : 'Medición de vibraciones' },
    { id: 'servicio-modelacion-ruido-subacuatico', label: isEnglish ? 'Underwater noise modeling' : 'Modelación de ruido subacuático' },
    { id: 'servicio-medicion-ruido-subacuatico', label: isEnglish ? 'Underwater noise measurement' : 'Medición de ruido subacuático' },
    { id: 'servicio-geoespacial', label: isEnglish ? 'Geospatial analytics' : 'Analítica geoespacial' },
    { id: 'servicio-fotogrametria', label: isEnglish ? 'Photogrammetry' : 'Fotogrametría' }
];

function renderServicesBar() {
    var bar = document.getElementById('section-services-bar');
    if (!bar) return;
    bar.innerHTML = '';
    serviciosIndustria.forEach(function(s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.className = 'section-service-pill';
        a.textContent = s.label;
        bar.appendChild(a);
    });
}

function renderServicesBarMobile() {
    var barMobile = document.getElementById('section-services-bar-mobile');
    if (!barMobile) return;
    barMobile.innerHTML = '';
    serviciosIndustria.forEach(function(s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.className = 'section-service-pill';
        a.textContent = s.label;
        barMobile.appendChild(a);
    });
}

function setActivePanelFromHash() {
    var hash = window.location.hash;
    var id = hash ? hash.slice(1) : firstCardId;
    if (!hash) window.location.replace('industria.html#' + firstCardId);
    document.querySelectorAll('.section-content .section-card').forEach(function(c) { c.classList.remove('active-panel'); });
    var card = document.getElementById(id);
    if (card && card.classList.contains('section-card')) {
        card.classList.add('active-panel');
    }
    document.querySelectorAll('.section-service-pill').forEach(function(p) {
        var href = p.getAttribute('href') || '';
        p.classList.toggle('active', href === '#' + id);
        p.setAttribute('aria-current', href === '#' + id ? 'page' : null);
    });
}

// Toggle del dropdown móvil
(function() {
    var toggle = document.getElementById('section-label-toggle');
    var dropdown = document.getElementById('section-label-dropdown');
    
    if (toggle && dropdown) {
        toggle.addEventListener('click', function() {
            var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            dropdown.setAttribute('aria-hidden', isExpanded);
        });
        
        // Cerrar dropdown al hacer clic en un pill y evitar scroll
        dropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('section-service-pill')) {
                e.preventDefault();
                var href = e.target.getAttribute('href');
                if (href) {
                    var id = href.slice(1);
                    // Cambiar el hash sin hacer scroll
                    history.replaceState(null, null, '#' + id);
                    // Actualizar el panel activo
                    setActivePanelFromHash();
                }
                toggle.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });
    }
})();

renderServicesBar();
renderServicesBarMobile();
setActivePanelFromHash();
window.addEventListener('hashchange', setActivePanelFromHash);

// Servicios: expandir card al clic (contenido dentro de la misma card)
(function() {
    function setupCardExpansion() {
        var cards = document.querySelectorAll('.section-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                // No expandir si se hace clic en elementos específicos
                if (e.target.closest('.section-card-back') || 
                    e.target.closest('.section-card-proyectos-link') || 
                    e.target.closest('.section-card-carousel-prev') || 
                    e.target.closest('.section-card-carousel-next')) {
                    return;
                }
                
                // Cerrar otras cards expandidas
                var expanded = document.querySelector('.section-content .section-card.expanded');
                if (expanded && expanded !== card) {
                    expanded.classList.remove('expanded');
                }
                
                // Toggle de la card actual
                card.classList.toggle('expanded');
            });
        });

        // Botón de cerrar
        document.querySelectorAll('.section-card-back').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var card = btn.closest('.section-card');
                if (card) {
                    card.classList.remove('expanded');
                }
            });
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCardExpansion);
    } else {
        setupCardExpansion();
    }
})();

// Carrusel interno por card
document.querySelectorAll('.section-card').forEach(function(card) {
    var track = card.querySelector('.section-card-carousel-track');
    var slides = card.querySelectorAll('.section-card-carousel-slide');
    var prevBtn = card.querySelector('.section-card-carousel-prev');
    var nextBtn = card.querySelector('.section-card-carousel-next');
    if (!track || !slides.length) return;
    var n = slides.length;
    track.style.width = (n * 100) + '%';
    slides.forEach(function(s) { s.style.flex = '0 0 ' + (100 / n) + '%'; });
    var idx = 0;
    function updateCarousel() {
        track.style.transform = 'translateX(-' + (idx * (100 / n)) + '%)';
    }
    prevBtn && prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        idx = idx <= 0 ? n - 1 : idx - 1;
        updateCarousel();
    });
    nextBtn && nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        idx = idx >= n - 1 ? 0 : idx + 1;
        updateCarousel();
    });
});
