(function() {
    // Proyectos: tags se deslizan y texto izquierda aparece al entrar en vista
    var page = document.querySelector('.proyectos-page');
    if (page) {
        var animated = false;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    page.classList.add('proyectos-animated');
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });
        observer.observe(page);
    }

    var params = new URLSearchParams(window.location.search);
    var servicio = params.get('servicio') || 'iot';
    var tagMap = { iot: 0, 'mapas-ruido': 1, webgis: 2, descontaminacion: 3, geoespacial: 4 };
    var tags = document.querySelectorAll('.proyectos-tag');
    var idx = tagMap[servicio] !== undefined ? tagMap[servicio] : 0;
    tags.forEach(function(t, i) { t.classList.toggle('active', i === idx); });

    var emptyMsg = document.getElementById('ciudades-empty-message');
    var carouselTrack = document.getElementById('ciudades-carousel-track');
    var allCards = document.querySelectorAll('.proyecto-card');
    
    function animateCardsOut(cards, callback) {
        if (!cards || cards.length === 0) {
            if (callback) callback();
            return;
        }
        cards.forEach(function(card) {
            card.classList.add('exiting');
        });
        setTimeout(function() {
            if (callback) callback();
        }, 400);
    }
    
    function animateCardsIn(cards) {
        if (!cards || cards.length === 0) return;
        cards.forEach(function(card, index) {
            card.style.display = 'block';
            card.classList.remove('exiting');
            card.classList.add('animating');
            card.style.animation = 'none';
            // Forzar reflow para reiniciar la animación
            void card.offsetWidth;
            card.style.animation = '';
            card.style.animationDelay = (index * 0.05) + 's';
        });
    }
    
    function toggleCiudadesCards() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        if (!activeTag) return;
        
        var servicioActivo = (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase();
        if (!servicioActivo) return;
        
        // Servicios permitidos para AMVA-USB - SOLO estos 2
        var serviciosPermitidosAMVA = ['iot', 'webgis'];
        
        // Servicios permitidos para CORNARE - SOLO estos 4
        var serviciosPermitidosCORNARE = ['iot', 'mapas-ruido', 'webgis', 'descontaminacion'];
        
        // Servicios permitidos para Modelo de Gestión Medellín - SOLO estos 2
        var serviciosPermitidosMedellin = ['iot', 'descontaminacion'];
        
        // Servicios permitidos para Observatorio Envigado - SOLO estos 2
        var serviciosPermitidosEnvigado = ['webgis', 'geoespacial'];
        
        // Obtener todas las cards visibles actualmente ANTES de ocultar
        var visibleCards = Array.from(allCards).filter(function(card) {
            var computedStyle = window.getComputedStyle(card);
            return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        });
        
        // Determinar qué cards deben mostrarse
        var cardsToShow = [];
        allCards.forEach(function(card) {
            var proyectoId = card.getAttribute('data-proyecto');
            
            // AMVA-USB: SOLO aparece en IoT y Ecosistemas WEBGIS
            if (proyectoId === 'amva-usb') {
                if (serviciosPermitidosAMVA.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return;
            }
            
            // CORNARE: SOLO aparece en los 4 tags específicos
            if (proyectoId === 'cornare') {
                if (serviciosPermitidosCORNARE.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return;
            }
            
            // Modelo de Gestión Medellín: SOLO aparece en IoT y Descontaminación
            if (proyectoId === 'modelo-gestion-medellin') {
                if (serviciosPermitidosMedellin.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return;
            }
            
            // Observatorio Envigado: SOLO aparece en WEBGIS y Analítica geoespacial
            if (proyectoId === 'observatorio-envigado') {
                if (serviciosPermitidosEnvigado.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return;
            }
            
            // Para otras cards, verificar sus servicios
            var servicios = card.getAttribute('data-servicios') || '';
            if (!servicios) return;
            
            var serviciosArray = servicios.toLowerCase().trim().split(/\s+/).filter(function(s) {
                return s.trim().length > 0;
            });
            
            if (serviciosArray.indexOf(servicioActivo) !== -1) {
                cardsToShow.push(card);
            }
        });
        
        var hasAnyProject = cardsToShow.length > 0;
        
        // Verificar si las cards que deben mostrarse son las mismas que las visibles
        var visibleIds = visibleCards.map(function(c) { return c.getAttribute('data-proyecto'); }).sort().join(',');
        var toShowIds = cardsToShow.map(function(c) { return c.getAttribute('data-proyecto'); }).sort().join(',');
        
        // Si son las mismas cards, no hacer nada
        if (visibleIds === toShowIds && visibleIds.length > 0) {
            return;
        }
        
        // Limpiar todas las clases de animación
        allCards.forEach(function(card) {
            card.classList.remove('exiting', 'animating');
        });
        
        // Ocultar todas las cards primero
        allCards.forEach(function(card) {
            card.style.display = 'none';
        });
        
        // Actualizar mensaje y carousel
        if (emptyMsg) emptyMsg.style.display = hasAnyProject ? 'none' : 'flex';
        if (carouselTrack) carouselTrack.style.display = hasAnyProject ? 'flex' : 'none';
        
        // Si hay cards para mostrar
        if (hasAnyProject) {
            // Si había cards visibles, animar salida primero
            if (visibleCards.length > 0) {
                animateCardsOut(visibleCards, function() {
                    // Mostrar nuevas cards y animar entrada
                    cardsToShow.forEach(function(card) {
                        card.style.display = 'block';
                    });
                    setTimeout(function() {
                        animateCardsIn(cardsToShow);
                    }, 10);
                });
            } else {
                // No había cards visibles, mostrar directamente
                cardsToShow.forEach(function(card) {
                    card.style.display = 'block';
                });
                setTimeout(function() {
                    animateCardsIn(cardsToShow);
                }, 10);
            }
        }
    }
    toggleCiudadesCards();
    
    // Animar cards iniciales
    setTimeout(function() {
        var initialCards = Array.from(allCards).filter(function(card) {
            return card.style.display !== 'none';
        });
        if (initialCards.length > 0) {
            animateCardsIn(initialCards);
        }
    }, 150);

    // Renderizar tags en el dropdown móvil
    function renderMobileTags() {
        var mobileContainer = document.getElementById('proyectos-tags-mobile');
        if (!mobileContainer) return;
        mobileContainer.innerHTML = '';
        tags.forEach(function(tag) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'proyectos-tag';
            btn.setAttribute('data-servicio', tag.getAttribute('data-servicio'));
            btn.setAttribute('role', 'tab');
            btn.textContent = tag.textContent;
            if (tag.classList.contains('active')) {
                btn.classList.add('active');
            }
            mobileContainer.appendChild(btn);
        });
    }

    // Toggle del dropdown móvil
    (function() {
        var toggle = document.getElementById('proyectos-filters-toggle');
        var dropdown = document.getElementById('proyectos-filters-dropdown');
        var page = document.querySelector('.proyectos-page');
        
        if (toggle && dropdown) {
            toggle.addEventListener('click', function() {
                var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdown.setAttribute('aria-hidden', isExpanded);
                // Agregar/quitar clase para ajustar el contenido
                if (page) {
                    if (!isExpanded) {
                        page.classList.add('dropdown-open');
                    } else {
                        page.classList.remove('dropdown-open');
                    }
                }
            });
            
            // Cerrar dropdown al hacer clic en un tag y evitar scroll
            dropdown.addEventListener('click', function(e) {
                if (e.target.classList.contains('proyectos-tag')) {
                    e.preventDefault();
                    var servicio = e.target.getAttribute('data-servicio');
                    if (servicio) {
                        var url = new URL(window.location.href);
                        url.searchParams.set('servicio', servicio);
                        window.history.replaceState({}, '', url);
                        // Actualizar tags activos primero
                        tags.forEach(function(t) { t.classList.remove('active'); });
                        var clickedTag = Array.from(tags).find(function(t) { return t.getAttribute('data-servicio') === servicio; });
                        if (clickedTag) clickedTag.classList.add('active');
                        // Actualizar tags móviles
                        renderMobileTags();
                        // Ejecutar toggle DESPUÉS de actualizar los tags, usando requestAnimationFrame para asegurar que el DOM esté actualizado
                        requestAnimationFrame(function() {
                            toggleCiudadesCards();
                        });
                    }
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdown.setAttribute('aria-hidden', 'true');
                    // Quitar clase cuando se cierra
                    if (page) {
                        page.classList.remove('dropdown-open');
                    }
                }
            });
        }
        
        renderMobileTags();
    })();

    tags.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Actualizar tags activos primero
            tags.forEach(function(t) { t.classList.remove('active'); });
            btn.classList.add('active');
            var s = btn.getAttribute('data-servicio');
            var url = new URL(window.location.href);
            url.searchParams.set('servicio', s);
            window.history.replaceState({}, '', url);
            
            // Actualizar tags móviles
            var mobileContainer = document.getElementById('proyectos-tags-mobile');
            if (mobileContainer) {
                var mobileTags = mobileContainer.querySelectorAll('.proyectos-tag');
                mobileTags.forEach(function(t) { t.classList.remove('active'); });
                var activeMobile = Array.from(mobileTags).find(function(t) { return t.getAttribute('data-servicio') === s; });
                if (activeMobile) activeMobile.classList.add('active');
            }
            
            // Ejecutar toggle DESPUÉS de actualizar los tags, usando requestAnimationFrame para asegurar que el DOM esté actualizado
            requestAnimationFrame(function() {
                toggleCiudadesCards();
            });
        });
    });

    var track = document.querySelector('.carousel-track');
    var prev = document.querySelector('.carousel-prev');
    var next = document.querySelector('.carousel-next');
    var cardWidth = 320; // Ancho fijo de las cards
    var gap = 20; // Gap entre cards

    function go(delta) {
        if (!track) return;
        var scrollAmount = (cardWidth + gap) * delta;
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function() { go(-1); });
    if (next) next.addEventListener('click', function() { go(1); });

    /* Panel de detalle: abrir al hacer clic en una card; izquierda = carrusel de imágenes del proyecto */
    var page = document.querySelector('.proyectos-page');
    var panel = document.getElementById('proyecto-panel');
    var backdrop = document.getElementById('proyecto-panel-backdrop');
    var closeBtn = document.getElementById('proyecto-panel-close');
    var panelCarouselTrack = document.getElementById('proyecto-panel-carousel-track');
    var panelCarouselPrev = document.getElementById('proyecto-panel-carousel-prev');
    var panelCarouselNext = document.getElementById('proyecto-panel-carousel-next');
    var panelTitle = document.getElementById('proyecto-panel-title');
    var panelCategoria = document.getElementById('proyecto-panel-categoria');
    var panelAno = document.getElementById('proyecto-panel-ano');
    var panelCliente = document.getElementById('proyecto-panel-cliente');
    var panelDesc = document.getElementById('proyecto-panel-desc');

    var panelCarouselIndex = 0;
    var panelCarouselImages = [];

    function buildPanelCarousel(proyectoId, titulo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        var images = [];
        var base = '';
        if (proyectoId === 'amva-usb' && typeof AMVA_USB_IMAGES !== 'undefined' && AMVA_USB_IMAGES.length) {
            images = AMVA_USB_IMAGES;
            base = '../img:video/proyectos/amvausb/';
        } else if (proyectoId === 'cornare' && typeof CORNARE_IMAGES !== 'undefined' && CORNARE_IMAGES.length) {
            images = CORNARE_IMAGES;
            base = '../proyectos/ciudades/CORNARE/';
        } else if (proyectoId === 'modelo-gestion-medellin' && typeof MODELO_GESTION_MEDELLIN_IMAGES !== 'undefined' && MODELO_GESTION_MEDELLIN_IMAGES.length) {
            images = MODELO_GESTION_MEDELLIN_IMAGES;
            base = '../proyectos/ciudades/MODELO-GESTION-MEDELLIN/';
        } else if (proyectoId === 'observatorio-envigado' && typeof OBSERVATORIO_ENVIGADO_IMAGES !== 'undefined' && OBSERVATORIO_ENVIGADO_IMAGES.length) {
            images = OBSERVATORIO_ENVIGADO_IMAGES;
            base = '../proyectos/ciudades/OBSERVATORIO-ENVIGADO/';
        }
        if (images.length === 0) return;
        panelCarouselImages = images.map(function(f) { return base + f; });
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.toggle('multiple', panelCarouselImages.length > 1);
        panelCarouselImages.forEach(function(src, i) {
            var slide = document.createElement('div');
            slide.className = 'proyecto-panel-carousel-slide' + (i === 0 ? ' active' : '');
            var img = document.createElement('img');
            img.src = src;
            img.alt = titulo + ' - Imagen ' + (i + 1);
            img.className = 'proyecto-panel-img';
            slide.appendChild(img);
            panelCarouselTrack.appendChild(slide);
        });
        panelCarouselIndex = 0;
    }

    function goPanelCarousel(delta) {
        if (panelCarouselImages.length <= 1) return;
        var slides = panelCarouselTrack ? panelCarouselTrack.querySelectorAll('.proyecto-panel-carousel-slide') : [];
        if (slides.length === 0) return;
        slides[panelCarouselIndex].classList.remove('active');
        panelCarouselIndex = (panelCarouselIndex + delta + slides.length) % slides.length;
        slides[panelCarouselIndex].classList.add('active');
    }

    function openProyectoPanel() {
        if (page) page.classList.add('proyecto-panel-open');
        document.body.classList.add('proyecto-panel-open');
        if (panel) { panel.setAttribute('aria-hidden', 'false'); }
        if (backdrop) { backdrop.setAttribute('aria-hidden', 'false'); }
    }
    function closeProyectoPanel() {
        if (page) page.classList.remove('proyecto-panel-open');
        document.body.classList.remove('proyecto-panel-open');
        if (panel) { panel.setAttribute('aria-hidden', 'true'); }
        if (backdrop) { backdrop.setAttribute('aria-hidden', 'true'); }
    }

    document.querySelectorAll('.proyecto-card').forEach(function(card) {
        var linkWrap = card.querySelector('.proyecto-card-link-wrap');
        if (!linkWrap) return;
        linkWrap.addEventListener('click', function(e) {
            e.preventDefault();
            var proyectoId = card.getAttribute('data-proyecto') || '';
            var titulo = card.getAttribute('data-proyecto-titulo') || '';
            // Obtener el servicio activo
            var activeTag = document.querySelector('.proyectos-tag.active');
            var servicioActivo = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase() : '';
            // Usar la descripción específica según el servicio activo, sino la descripción general
            var desc = '';
            if (servicioActivo === 'iot' && card.getAttribute('data-proyecto-desc-iot')) {
                desc = card.getAttribute('data-proyecto-desc-iot');
            } else if (servicioActivo === 'mapas-ruido' && card.getAttribute('data-proyecto-desc-mapas-ruido')) {
                desc = card.getAttribute('data-proyecto-desc-mapas-ruido');
            } else if (servicioActivo === 'webgis' && card.getAttribute('data-proyecto-desc-webgis')) {
                desc = card.getAttribute('data-proyecto-desc-webgis');
            } else if (servicioActivo === 'descontaminacion' && card.getAttribute('data-proyecto-desc-descontaminacion')) {
                desc = card.getAttribute('data-proyecto-desc-descontaminacion');
            } else if (servicioActivo === 'geoespacial' && card.getAttribute('data-proyecto-desc-geoespacial')) {
                desc = card.getAttribute('data-proyecto-desc-geoespacial');
            } else {
                desc = card.getAttribute('data-proyecto-desc-long') || card.getAttribute('data-proyecto-desc') || '';
            }
            var categoria = card.getAttribute('data-proyecto-categoria') || '';
            var ano = card.getAttribute('data-proyecto-ano') || '';
            var cliente = card.getAttribute('data-proyecto-cliente') || '';
            buildPanelCarousel(proyectoId, titulo);
            if (panelTitle) panelTitle.textContent = titulo;
            if (panelCategoria) panelCategoria.textContent = categoria;
            if (panelAno) panelAno.textContent = ano;
            if (panelCliente) panelCliente.textContent = cliente;
            if (panelDesc) panelDesc.textContent = desc;
            openProyectoPanel();
        });
        linkWrap.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); linkWrap.click(); }
        });
    });

    if (panelCarouselPrev) panelCarouselPrev.addEventListener('click', function() { goPanelCarousel(-1); });
    if (panelCarouselNext) panelCarouselNext.addEventListener('click', function() { goPanelCarousel(1); });
    if (closeBtn) closeBtn.addEventListener('click', closeProyectoPanel);
    if (backdrop) backdrop.addEventListener('click', closeProyectoPanel);

    /* Abrir panel al llegar desde inicio con ?proyecto=xxx */
    var openParams = new URLSearchParams(window.location.search);
    var openProyectoId = openParams.get('proyecto');
    if (openProyectoId) {
        var proyectoCard = document.querySelector('.proyecto-card[data-proyecto="' + openProyectoId + '"]');
        if (proyectoCard) {
            // Determinar qué tag activar según los servicios del proyecto
            var servicios = proyectoCard.getAttribute('data-servicios') || '';
            var serviciosArray = servicios.toLowerCase().split(/\s+/).filter(function(s) { return s.length > 0; });
            if (serviciosArray.length > 0) {
                var firstServicio = serviciosArray[0];
                var tagToActivate = document.querySelector('.proyectos-tag[data-servicio="' + firstServicio + '"]');
                if (tagToActivate) {
                    tags.forEach(function(t) { t.classList.remove('active'); });
                    tagToActivate.classList.add('active');
                }
            }
            toggleCiudadesCards();
            setTimeout(function() {
                var titulo = proyectoCard.getAttribute('data-proyecto-titulo') || '';
                // Obtener el servicio activo
                var activeTag = document.querySelector('.proyectos-tag.active');
                var servicioActivo = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase() : '';
                // Usar la descripción específica según el servicio activo, sino la descripción general
                var desc = '';
                if (servicioActivo === 'iot' && proyectoCard.getAttribute('data-proyecto-desc-iot')) {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-iot');
                } else if (servicioActivo === 'mapas-ruido' && proyectoCard.getAttribute('data-proyecto-desc-mapas-ruido')) {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-mapas-ruido');
                } else if (servicioActivo === 'webgis' && proyectoCard.getAttribute('data-proyecto-desc-webgis')) {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-webgis');
                } else if (servicioActivo === 'descontaminacion' && proyectoCard.getAttribute('data-proyecto-desc-descontaminacion')) {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-descontaminacion');
                } else if (servicioActivo === 'geoespacial' && proyectoCard.getAttribute('data-proyecto-desc-geoespacial')) {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-geoespacial');
                } else {
                    desc = proyectoCard.getAttribute('data-proyecto-desc-long') || proyectoCard.getAttribute('data-proyecto-desc') || '';
                }
                var categoria = proyectoCard.getAttribute('data-proyecto-categoria') || '';
                var ano = proyectoCard.getAttribute('data-proyecto-ano') || '';
                var cliente = proyectoCard.getAttribute('data-proyecto-cliente') || '';
                buildPanelCarousel(openProyectoId, titulo);
                if (panelTitle) panelTitle.textContent = titulo;
                if (panelCategoria) panelCategoria.textContent = categoria;
                if (panelAno) panelAno.textContent = ano;
                if (panelCliente) panelCliente.textContent = cliente;
                if (panelDesc) panelDesc.textContent = desc;
                openProyectoPanel();
            }, 100);
        }
    }
})();
