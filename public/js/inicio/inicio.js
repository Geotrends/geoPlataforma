// Detectar sección actual y cambiar color del navbar
function updateNavbarColor() {
    var navbar = document.getElementById('navbar');
    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    
    // Remover todas las clases de sección
    navbar.classList.remove('section-image', 'section-dark');
    
    if (scrollY < 50) {
        // En el hero - transparente
        navbar.classList.remove('scrolled');
        return;
    }
    
    navbar.classList.add('scrolled');
    
    // Obtener todas las secciones
    var sections = document.querySelectorAll('section');
    var currentSection = null;
    
    sections.forEach(function(section) {
        var rect = section.getBoundingClientRect();
        var sectionTop = rect.top + scrollY;
        var sectionBottom = sectionTop + rect.height;
        
        // Si el scroll está dentro de esta sección
        if (scrollY >= sectionTop - 100 && scrollY < sectionBottom) {
            currentSection = section;
        }
    });
    
    if (currentSection) {
        var sectionClass = currentSection.className;
        
        // Secciones con fondo oscuro (geotrends, tech, dashboard)
        if (sectionClass.includes('geotrends-section') || 
            sectionClass.includes('tech-section') || 
            sectionClass.includes('dashboard-section')) {
            navbar.classList.add('section-dark');
        }
        // Secciones con fondo de imagen
        else if (sectionClass.includes('hero') || 
                 sectionClass.includes('wind-section') || 
                 sectionClass.includes('process-section')) {
            navbar.classList.add('section-image');
        }
        // Secciones oscuras
        else {
            navbar.classList.add('section-dark');
        }
    }
}

// Actualizar al cargar y al hacer scroll
updateNavbarColor();
window.addEventListener('scroll', updateNavbarColor);

// Marcar enlace activo según la página actual
(function() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-links > li > a');
    
    navLinks.forEach(function(link) {
        var linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
        
        // Agregar clase activa al hacer click
        link.addEventListener('click', function() {
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
        });
    });
})();

// FAQ: acordeón (expandir/colapsar) + filtro por categoría
(function() {
    var faqSection = document.getElementById('faq-section');
    if (!faqSection) return;
    var items = faqSection.querySelectorAll('.faq-item');
    var navItems = faqSection.querySelectorAll('.faq-nav-item');

    items.forEach(function(item) {
        var btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var isOpen = item.classList.contains('faq-item-open');
            items.forEach(function(i) {
                i.classList.remove('faq-item-open');
                var q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('faq-item-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    function filterByCategory(cat) {
        items.forEach(function(item) {
            var catItem = item.getAttribute('data-category');
            if (catItem === cat) {
                item.classList.remove('faq-item-hidden');
            } else {
                item.classList.add('faq-item-hidden');
            }
        });
        navItems.forEach(function(nav) {
            var isActive = nav.getAttribute('data-category') === cat;
            nav.classList.toggle('active', isActive);
            nav.setAttribute('aria-selected', isActive);
        });
    }

    navItems.forEach(function(nav) {
        nav.addEventListener('click', function() {
            filterByCategory(nav.getAttribute('data-category'));
        });
    });

    filterByCategory('general');
})();

// Animaciones por scroll: se repiten al subir/bajar en todos los breakpoints (móvil, tablet, desktop)
function setupScrollAnimations() {
    var config = { rootMargin: '0px 0px -5% 0px', threshold: 0.05 };

    function toggleWithReflow(el, className) {
        return function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) {
                    el.classList.remove(className);
                    void el.offsetWidth; // reflow: asegura que la animación se reinicie en cualquier responsive
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            });
        };
    }

    var geotrends = document.querySelector('.geotrends-section');
    if (geotrends) {
        (new IntersectionObserver(toggleWithReflow(geotrends, 'geotrends-animated'), config)).observe(geotrends);
    }
    var wind = document.querySelector('.wind-section');
    if (wind) {
        (new IntersectionObserver(toggleWithReflow(wind, 'wind-animated'), config)).observe(wind);
    }
    var tech = document.querySelector('.tech-section');
    if (tech) {
        (new IntersectionObserver(toggleWithReflow(tech, 'tech-animated'), config)).observe(tech);
    }
    var process = document.querySelector('.process-section');
    if (process) {
        (new IntersectionObserver(toggleWithReflow(process, 'process-animated'), config)).observe(process);
    }
}
setupScrollAnimations();

// Carrusel de proyectos (Home): flechas anterior/siguiente
(function() {
    var wrap = document.querySelector('.home-projects-section .home-projects-carousel-wrap');
    if (!wrap) return;
    var track = wrap.querySelector('.home-projects-track');
    var prevBtn = wrap.querySelector('.home-projects-carousel-prev');
    var nextBtn = wrap.querySelector('.home-projects-carousel-next');
    var cardWidth = 320;
    var gap = 20;

    function go(delta) {
        if (!track) return;
        var scrollAmount = (cardWidth + gap) * delta;
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { go(1); });

    // Asegurar que los enlaces de las cards funcionen correctamente
    // Las cards ya son enlaces <a>, así que los clics deberían funcionar automáticamente
    // Solo nos aseguramos de que el scroll del carrusel no interfiera con los clics
    if (track) {
        // Prevenir que el scroll horizontal interfiera con los clics en las cards
        track.addEventListener('click', function(e) {
            // Si el clic es en una card, permitir que el enlace funcione normalmente
            var card = e.target.closest('.home-project-card');
            if (card && card.tagName === 'A') {
                // El enlace funcionará normalmente, no hacemos nada
                return;
            }
        }, true);
    }
})();

// Tarjetas wind (Inicio): al hacer clic, expandir y ocultar las otras; al volver a hacer clic, restaurar las 3
(function() {
    function initWindCards() {
        var windSection = document.querySelector('.wind-section');
        var windCards = document.querySelectorAll('.wind-card');
        var windCardsContainer = document.querySelector('.wind-cards');
        
        if (!windCards.length) return;
        
        function restoreAll() {
            windCards.forEach(function(c) {
                c.classList.remove('expanded');
                c.classList.remove('hidden');
            });
            if (windCardsContainer) windCardsContainer.classList.remove('is-expanded');
            if (windSection) windSection.classList.remove('wind-card-expanded');
        }
        
        windCards.forEach(function(card) {
            var closeBtn = card.querySelector('.wind-card-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    restoreAll();
                });
            }
            
            card.addEventListener('click', function(e) {
                // No expandir si es la card de ID + I
                if (card.hasAttribute('data-idi') || card.classList.contains('wind-card-idi')) {
                    return;
                }
                
                // No expandir si se hace clic en elementos específicos
                if (e.target.closest('.wind-card-close') || 
                    e.target.closest('.wind-project-card') || 
                    e.target.closest('.wind-inner-carousel-prev') || 
                    e.target.closest('.wind-inner-carousel-next')) {
                    return;
                }
                
                var isExpanded = card.classList.contains('expanded');
                if (isExpanded) {
                    restoreAll();
                    return;
                }

                // Expandir la actual y ocultar las demás
                restoreAll();
                card.classList.add('expanded');
                if (windCardsContainer) windCardsContainer.classList.add('is-expanded');
                if (windSection) windSection.classList.add('wind-card-expanded');
                windCards.forEach(function(other) {
                    if (other !== card) other.classList.add('hidden');
                });

                // Asegurar que la card expandida quede visible dentro del carrusel
                try {
                    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                } catch (err) {
                    // scrollIntoView options no soportadas: fallback
                    card.scrollIntoView(true);
                }
            });
        });

        // Carrusel interno (servicios): scroll con flechas; evitar que el clic cierre la card principal
        document.querySelectorAll('.wind-inner-carousel-wrap').forEach(function(wrap) {
            var track = wrap.querySelector('.wind-project-cards');
            var prevBtn = wrap.querySelector('.wind-inner-carousel-prev');
            var nextBtn = wrap.querySelector('.wind-inner-carousel-next');
            if (!track || !prevBtn || !nextBtn) return;
            function scrollBy(direction, e) {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                var step = track.offsetWidth * 0.6;
                track.scrollBy({ left: direction * step, behavior: 'smooth' });
            }
            prevBtn.addEventListener('click', function(e) { scrollBy(-1, e); });
            nextBtn.addEventListener('click', function(e) { scrollBy(1, e); });
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWindCards);
    } else {
        initWindCards();
    }
})();

// Panel de tecnologías: al hacer clic en una card se abre el panel que sube desde abajo (con X para cerrar)
(function() {
    var section = document.querySelector('.tech-section');
    var panel = document.getElementById('tech-panel');
    var backdrop = document.getElementById('tech-panel-backdrop');
    var closeBtn = document.getElementById('tech-panel-close');
    var panelTitle = document.getElementById('tech-panel-title');
    var panelUso = document.getElementById('tech-panel-uso');
    var imgPlaceholder = document.getElementById('tech-panel-img-placeholder');

    function openPanel(card) {
        if (!panel || !section) return;
        var titleEl = card.querySelector('.tech-card-title');
        var uso = card.getAttribute('data-tech-uso') || '';
        if (!titleEl) return;
        panelTitle.textContent = titleEl.textContent.trim();
        panelUso.textContent = uso;
        if (imgPlaceholder) {
            imgPlaceholder.innerHTML = '';
        }
        
        // Calcular la posición vertical del card clickeado para alinear el panel
        var cardRect = card.getBoundingClientRect();
        var sectionRect = section.getBoundingClientRect();
        var cardCenterY = cardRect.top + (cardRect.height / 2) - sectionRect.top;
        
        // Ajustar el top del panel para que esté alineado con el card
        // En pantallas angostas (≤900px) el panel sale desde la derecha
        var isNarrowScreen = window.innerWidth <= 900;
        if (isNarrowScreen) {
            // Convertir la posición del card a porcentaje relativo a la altura de la sección
            var sectionHeight = sectionRect.height;
            var topPercent = (cardCenterY / sectionHeight) * 100;
            
            // Obtener la altura del panel para verificar si se sale de la sección
            var panelHeight = panel.offsetHeight || panel.getBoundingClientRect().height;
            var panelHeightPercent = (panelHeight / sectionHeight) * 100;
            
            // Si el panel se sale de la sección (topPercent + panelHeightPercent > 100)
            // Ajustar el top para que quepa, ocupando un poco del renglón de arriba
            if (topPercent + panelHeightPercent > 100) {
                // Calcular cuánto se sale
                var overflow = (topPercent + panelHeightPercent) - 100;
                // Ajustar el top restando el overflow más un pequeño margen
                topPercent = topPercent - overflow - 2; // 2% de margen extra
            }
            
            // Limitar el porcentaje para que el panel no se salga de la pantalla
            var minTop = 2; // mínimo 2% desde arriba
            var maxTop = 98; // máximo 98% desde arriba
            topPercent = Math.max(minTop, Math.min(maxTop, topPercent));
            panel.style.top = topPercent + '%';
        } else {
            // En pantallas anchas, el panel se mantiene desde abajo
            panel.style.top = 'auto';
        }
        
        section.classList.add('tech-panel-open');
        panel.setAttribute('aria-hidden', 'false');
        backdrop.setAttribute('aria-hidden', 'false');
    }
    function closePanel() {
        if (!section) return;
        section.classList.remove('tech-panel-open');
        if (panel) {
            panel.setAttribute('aria-hidden', 'true');
            // Resetear el top para que la próxima vez use el valor por defecto
            var isNarrowScreen = window.innerWidth <= 900;
            if (isNarrowScreen) {
                panel.style.top = '50%';
            } else {
                panel.style.top = 'auto';
            }
        }
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.tech-card').forEach(function(card) {
        card.addEventListener('click', function() {
            openPanel(card);
        });
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (backdrop) backdrop.addEventListener('click', closePanel);
})();
