(function() {
    // Proyectos: animación se repite al subir/bajar con scroll
    var page = document.querySelector('.proyectos-page');
    if (page) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) page.classList.add('proyectos-animated');
                else page.classList.remove('proyectos-animated');
            });
        }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
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
    
    function updateCornarePortada(servicioActivo) {
        var cornareCard = document.querySelector('.proyecto-card-cornare');
        if (!cornareCard) return;
        var imgWrap = cornareCard.querySelector('.proyecto-card-img-cornare');
        if (!imgWrap) return;
        var videoEl = imgWrap.querySelector('.proyecto-card-portada-iot');
        var mapasEl = imgWrap.querySelector('.proyecto-card-portada-mapas-ruido');
        var webgisEl = imgWrap.querySelector('.proyecto-card-portada-webgis');
        var descontEl = imgWrap.querySelector('.proyecto-card-portada-descontaminacion');
        if (!videoEl || !mapasEl || !webgisEl) return;
        videoEl.style.display = servicioActivo === 'iot' ? 'block' : 'none';
        mapasEl.style.display = servicioActivo === 'mapas-ruido' ? 'block' : 'none';
        webgisEl.style.display = servicioActivo === 'webgis' ? 'block' : 'none';
        if (descontEl) descontEl.style.display = servicioActivo === 'descontaminacion' ? 'block' : 'none';
    }

    function updateAmvaPortada(servicioActivo) {
        var amvaCard = document.querySelector('.proyecto-card-amva-usb');
        if (!amvaCard) return;
        var imgWrap = amvaCard.querySelector('.proyecto-card-img-amva');
        if (!imgWrap) return;
        var videoEl = imgWrap.querySelector('.proyecto-card-portada-iot');
        var imgEl = imgWrap.querySelector('.proyecto-card-portada-webgis');
        if (!videoEl || !imgEl) return;
        if (servicioActivo === 'webgis') {
            videoEl.style.display = 'none';
            imgEl.style.display = 'block';
        } else {
            videoEl.style.display = 'block';
            imgEl.style.display = 'none';
        }
    }

    function updateModeloPortada(servicioActivo) {
        var modeloCard = document.querySelector('.proyecto-card-modelo-gestion-medellin');
        if (!modeloCard) return;
        var imgWrap = modeloCard.querySelector('.proyecto-card-img-modelo');
        if (!imgWrap) return;
        var videoIot = imgWrap.querySelector('.proyecto-card-portada-iot');
        var videoDescont = imgWrap.querySelector('.proyecto-card-portada-descontaminacion');
        if (!videoIot || !videoDescont) return;
        videoIot.style.display = servicioActivo === 'iot' ? 'block' : 'none';
        videoDescont.style.display = servicioActivo === 'descontaminacion' ? 'block' : 'none';
    }

    function updateObservatorioPortada(servicioActivo) {
        var obsCard = document.querySelector('.proyecto-card-observatorio-envigado');
        if (!obsCard) return;
        var imgWrap = obsCard.querySelector('.proyecto-card-img-observatorio');
        if (!imgWrap) return;
        var webgisEl = imgWrap.querySelector('.proyecto-card-portada-webgis');
        var geoespacialEl = imgWrap.querySelector('.proyecto-card-portada-geoespacial');
        if (!webgisEl || !geoespacialEl) return;
        webgisEl.style.display = servicioActivo === 'webgis' ? 'block' : 'none';
        geoespacialEl.style.display = servicioActivo === 'geoespacial' ? 'block' : 'none';
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
        
        if (visibleIds === toShowIds && visibleIds.length > 0) {
            updateCornarePortada(servicioActivo);
            updateAmvaPortada(servicioActivo);
            updateModeloPortada(servicioActivo);
            updateObservatorioPortada(servicioActivo);
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
                    updateCornarePortada(servicioActivo);
                    updateAmvaPortada(servicioActivo);
                    updateModeloPortada(servicioActivo);
                    updateObservatorioPortada(servicioActivo);
                    setTimeout(function() {
                        animateCardsIn(cardsToShow);
                    }, 10);
                });
            } else {
                // No había cards visibles, mostrar directamente
                cardsToShow.forEach(function(card) {
                    card.style.display = 'block';
                });
                updateCornarePortada(servicioActivo);
                updateAmvaPortada(servicioActivo);
                updateModeloPortada(servicioActivo);
                updateObservatorioPortada(servicioActivo);
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
    var gap = 20;

    function getCardWidth() {
        var card = track ? track.querySelector('.proyecto-card') : null;
        return card ? card.offsetWidth : (window.innerWidth <= 375 ? 240 : window.innerWidth <= 600 ? 220 : window.innerWidth <= 900 ? 280 : 400);
    }

    function go(delta) {
        if (!track) return;
        var cardWidth = getCardWidth();
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


    function buildPanelCarousel(proyectoId, titulo, imageSrc, servicioActivo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.remove('multiple');
        if (imageSrc) {
            panelCarouselImages = [imageSrc];
            var slide = document.createElement('div');
            slide.className = 'proyecto-panel-carousel-slide active';
            var img = document.createElement('img');
            img.src = imageSrc;
            img.alt = titulo;
            var fitClass = (servicioActivo === 'iot' ? ' img-completa' : '') + (servicioActivo === 'descontaminacion' ? ' proyecto-panel-img-fit-16-9' : '');
            img.className = 'proyecto-panel-img' + fitClass;
            slide.appendChild(img);
            
            // Agregar botón de ampliar imagen para proyectos WEBGIS, CORNARE en Mapas de ruido, y Observatorio en Analítica geoespacial
            var shouldAddExpandBtn = servicioActivo === 'webgis' || 
                                    (servicioActivo === 'mapas-ruido' && proyectoId === 'cornare') ||
                                    (servicioActivo === 'geoespacial' && proyectoId === 'observatorio-envigado');
            
            if (shouldAddExpandBtn) {
                var expandBtn = document.createElement('button');
                expandBtn.type = 'button';
                expandBtn.className = 'proyecto-panel-expand-btn';
                expandBtn.setAttribute('aria-label', 'Ampliar imagen');
                expandBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
                
                // Agregar listener en fase de captura para interceptar antes del backdrop
                expandBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // Desactivar temporalmente el backdrop
                    if (backdrop) {
                        var originalPointerEvents = backdrop.style.pointerEvents;
                        backdrop.style.pointerEvents = 'none';
                        setTimeout(function() {
                            if (backdrop) backdrop.style.pointerEvents = originalPointerEvents || 'auto';
                        }, 200);
                    }
                    // Abrir el modal
                    setTimeout(function() {
                        openImagenModal(imageSrc, titulo);
                    }, 10);
                    return false;
                }, true); // Fase de captura - se ejecuta antes que otros listeners
                
                // También agregar en fase de burbujeo por si acaso
                expandBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, false);
                
                slide.appendChild(expandBtn);
            }
            
            panelCarouselTrack.appendChild(slide);
        }
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
        if (panel) { 
            panel.setAttribute('aria-hidden', 'false');
            panel.style.pointerEvents = 'auto';
        }
        if (backdrop) { 
            backdrop.setAttribute('aria-hidden', 'false');
            backdrop.style.pointerEvents = 'auto';
        }
    }
    function closeProyectoPanel() {
        if (page) page.classList.remove('proyecto-panel-open');
        document.body.classList.remove('proyecto-panel-open');
        if (panel) { 
            panel.setAttribute('aria-hidden', 'true');
            // Asegurar que el panel no bloquee clics
            panel.style.pointerEvents = 'none';
        }
        if (backdrop) { 
            backdrop.setAttribute('aria-hidden', 'true');
            // Restaurar pointer-events del backdrop
            backdrop.style.pointerEvents = 'none';
        }
        // Forzar reflow para asegurar que los cambios se apliquen
        void document.body.offsetWidth;
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
            var panelImg = '';
            if (servicioActivo === 'iot') {
                panelImg = card.getAttribute('data-proyecto-img') || '';
            } else if (servicioActivo === 'mapas-ruido') {
                panelImg = card.getAttribute('data-proyecto-img-mapas-ruido') || '';
            } else if (servicioActivo === 'webgis') {
                panelImg = card.hasAttribute('data-proyecto-img-webgis') ? (card.getAttribute('data-proyecto-img-webgis') || '') : (card.getAttribute('data-proyecto-img') || '');
            } else if (servicioActivo === 'descontaminacion') {
                panelImg = card.hasAttribute('data-proyecto-img-descontaminacion') ? (card.getAttribute('data-proyecto-img-descontaminacion') || '') : (card.getAttribute('data-proyecto-img') || '');
            } else if (servicioActivo === 'geoespacial') {
                panelImg = card.hasAttribute('data-proyecto-img-geoespacial') ? (card.getAttribute('data-proyecto-img-geoespacial') || '') : (card.getAttribute('data-proyecto-img') || '');
            } else {
                panelImg = card.getAttribute('data-proyecto-img') || '';
            }
            buildPanelCarousel(proyectoId, titulo, panelImg, servicioActivo);
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
    if (backdrop) {
        backdrop.addEventListener('click', function(e) {
            // No cerrar si el clic fue dentro del panel
            var panel = document.getElementById('proyecto-panel');
            if (panel && (panel.contains(e.target) || e.target.closest('.proyecto-panel'))) {
                e.stopPropagation();
                return; // El clic fue dentro del panel, no cerrar
            }
            // Verificar si el clic fue en el botón de ampliar
            var expandBtn = document.querySelector('.proyecto-panel-expand-btn');
            if (expandBtn && (e.target === expandBtn || expandBtn.contains(e.target) || e.target.closest('.proyecto-panel-expand-btn'))) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            // Verificar coordenadas del clic - si está dentro del área del panel, no cerrar
            if (panel) {
                var panelRect = panel.getBoundingClientRect();
                var clickX = e.clientX;
                var clickY = e.clientY;
                if (clickX >= panelRect.left && clickX <= panelRect.right && 
                    clickY >= panelRect.top && clickY <= panelRect.bottom) {
                    e.stopPropagation();
                    return; // El clic fue dentro del área del panel
                }
            }
            closeProyectoPanel();
            // Asegurar que el backdrop no bloquee clics después de cerrar
            setTimeout(function() {
                if (backdrop) {
                    backdrop.style.pointerEvents = 'none';
                }
            }, 100);
        });
    }

    /* Modal de imagen ampliada para proyectos WEBGIS */
    var imagenModal = document.getElementById('proyecto-imagen-modal');
    var imagenModalBackdrop = document.getElementById('proyecto-imagen-modal-backdrop');
    var imagenModalClose = document.getElementById('proyecto-imagen-modal-close');
    var imagenModalImg = document.getElementById('proyecto-imagen-modal-img');

    function openImagenModal(imageSrc, titulo) {
        if (!imagenModal || !imagenModalImg) return;
        imagenModalImg.src = imageSrc;
        imagenModalImg.alt = titulo || 'Imagen ampliada';
        imagenModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('proyecto-imagen-modal-open');
    }

    function closeImagenModal() {
        if (!imagenModal) return;
        imagenModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('proyecto-imagen-modal-open');
        // Asegurar que el modal no bloquee clics después de cerrar
        if (imagenModalBackdrop) {
            imagenModalBackdrop.style.pointerEvents = 'none';
        }
        // Forzar reflow para asegurar que los cambios se apliquen
        void document.body.offsetWidth;
    }

    if (imagenModalClose) imagenModalClose.addEventListener('click', closeImagenModal);
    if (imagenModalBackdrop) imagenModalBackdrop.addEventListener('click', closeImagenModal);
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagenModal && imagenModal.getAttribute('aria-hidden') === 'false') {
            closeImagenModal();
        }
    });

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
                var panelImg = '';
                if (servicioActivo === 'iot') {
                    panelImg = proyectoCard.getAttribute('data-proyecto-img') || '';
                } else if (servicioActivo === 'mapas-ruido') {
                    panelImg = proyectoCard.getAttribute('data-proyecto-img-mapas-ruido') || '';
                } else if (servicioActivo === 'webgis') {
                    panelImg = proyectoCard.hasAttribute('data-proyecto-img-webgis') ? (proyectoCard.getAttribute('data-proyecto-img-webgis') || '') : (proyectoCard.getAttribute('data-proyecto-img') || '');
                } else if (servicioActivo === 'descontaminacion') {
                    panelImg = proyectoCard.hasAttribute('data-proyecto-img-descontaminacion') ? (proyectoCard.getAttribute('data-proyecto-img-descontaminacion') || '') : (proyectoCard.getAttribute('data-proyecto-img') || '');
                } else if (servicioActivo === 'geoespacial') {
                    panelImg = proyectoCard.hasAttribute('data-proyecto-img-geoespacial') ? (proyectoCard.getAttribute('data-proyecto-img-geoespacial') || '') : (proyectoCard.getAttribute('data-proyecto-img') || '');
                } else {
                    panelImg = proyectoCard.getAttribute('data-proyecto-img') || '';
                }
                buildPanelCarousel(openProyectoId, titulo, panelImg, servicioActivo);
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
