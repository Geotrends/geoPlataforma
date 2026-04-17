(function() {
    var INDUSTRIA_IMAGES_BASE = '../../img_video/proyectos/industria/';
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
    var servicio = params.get('servicio') || 'control-ruido';
    var tagMap = {
        'control-ruido': 0, 'clasificacion-fuentes': 1, 'modelacion-ruido': 2,
        'holografia-acustica': 3, 'medicion-vibraciones': 4,
        'modelacion-ruido-subacuatico': 5, 'medicion-ruido-subacuatico': 6,
        geoespacial: 7, fotogrametria: 8
    };
    var tags = document.querySelectorAll('.proyectos-tag');
    var idx = tagMap[servicio] !== undefined ? tagMap[servicio] : 0;
    tags.forEach(function(t, i) { t.classList.toggle('active', i === idx); });

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
        if (typeof window.geoLazyVideosRefresh === 'function') {
            window.requestAnimationFrame(function () { window.geoLazyVideosRefresh(); });
        }
    }
    
    var emptyMsg = document.getElementById('proyectos-empty-message');
    var carouselTrack = document.getElementById('industria-carousel-track');
    var allCards = document.querySelectorAll('.proyecto-card');
    
    function toggleIndustryCards() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        if (!activeTag) return;
        
        var servicioActivo = (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase();
        if (!servicioActivo) return;
        
        // Servicios permitidos para ARCLAD - SOLO estos 4 (clasificacion-fuentes = solo ARclad)
        var serviciosPermitidosARCLAD = ['control-ruido', 'clasificacion-fuentes', 'modelacion-ruido', 'fotogrametria'];
        
        // CCR Palagua en industria: aparece en "control-ruido" y "fotogrametria"
        var serviciosPermitidosCCRPalagua = ['control-ruido', 'fotogrametria'];
        
        // Campaña política en industria: SOLO aparece en "geoespacial"
        var servicioPermitidoCampanaPolitica = 'geoespacial';
        
        // Obtener todas las cards visibles actualmente ANTES de ocultar
        var visibleCards = Array.from(allCards).filter(function(card) {
            var computedStyle = window.getComputedStyle(card);
            return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        });
        
        // Determinar qué cards deben mostrarse
        var cardsToShow = [];
        allCards.forEach(function(card) {
            var proyectoId = card.getAttribute('data-proyecto');
            
            // ARCLAD: SOLO aparece en Control de ruido, Clasificación de fuentes, Modelación de ruido y Fotogrametría
            if (proyectoId === 'arclad') {
                if (serviciosPermitidosARCLAD.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para ARCLAD
            }
            
            // CCR Palagua: SOLO aparece en "fotogrametria"
            if (proyectoId === 'ccr-palagua') {
                if (serviciosPermitidosCCRPalagua.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return;
            }
            
            // Campaña política: SOLO aparece en "geoespacial"
            if (proyectoId === 'campana-politica') {
                if (servicioActivo === servicioPermitidoCampanaPolitica) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para Campaña política
            }
            
            // Para otras cards, verificar sus servicios
            var servicios = card.getAttribute('data-servicios') || card.getAttribute('data-servicio') || '';
            if (!servicios) return;
            
            var serviciosArray = servicios.toLowerCase().trim().split(/\s+/).filter(function(s) {
                return s.trim().length > 0;
            });
            
            if (serviciosArray.indexOf(servicioActivo) !== -1) {
                cardsToShow.push(card);
            }
        });
        
        var hasAnyProject = cardsToShow.length > 0;
        
        // Actualizar títulos, descripciones e imágenes de las cards según el servicio activo
        function updateCardTitlesAndDescs(cards, servicio) {
            cards.forEach(function(card) {
                var suffix = servicio ? ('-' + servicio) : '';
                var titulo = card.getAttribute('data-proyecto-titulo' + suffix) || card.getAttribute('data-proyecto-titulo') || '';
                var desc = card.getAttribute('data-proyecto-desc' + suffix) || card.getAttribute('data-proyecto-desc') || '';
                var titleEl = card.querySelector('.proyecto-card-title');
                var descEl = card.querySelector('.proyecto-card-desc');
                if (titleEl && titulo) titleEl.textContent = titulo;
                if (descEl && desc) descEl.textContent = desc;
                var imgDiv = card.querySelector('.proyecto-card-img');
                if (imgDiv) {
                    var video = imgDiv.querySelector('.proyecto-card-video');
                    var sinImagen = card.getAttribute('data-proyecto-sin-imagen' + suffix) === 'true';
                    var proyectoImg = sinImagen ? '' : (card.getAttribute('data-proyecto-img' + suffix) || card.getAttribute('data-proyecto-img') || '');
                    if (proyectoImg) {
                        imgDiv.style.backgroundImage = "url('" + proyectoImg + "')";
                        if (video) video.style.display = 'none';
                    } else {
                        imgDiv.style.backgroundImage = '';
                        if (video) video.style.display = sinImagen ? 'none' : '';
                    }
                }
            });
        }
        updateCardTitlesAndDescs(cardsToShow, servicioActivo);
        
        // Verificar si las cards que deben mostrarse son las mismas que las visibles
        var visibleIds = visibleCards.map(function(c) { return c.getAttribute('data-proyecto'); }).sort().join(',');
        var toShowIds = cardsToShow.map(function(c) { return c.getAttribute('data-proyecto'); }).sort().join(',');
        
        // Si son las mismas cards, no hacer nada
        if (visibleIds === toShowIds && visibleIds.length > 0) {
            if (typeof window.geoLazyVideosRefresh === 'function') {
                window.requestAnimationFrame(function () { window.geoLazyVideosRefresh(); });
            }
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
    toggleIndustryCards();
    
    // Animar cards iniciales
    setTimeout(function() {
        var initialCards = Array.from(allCards).filter(function(card) {
            return card.style.display !== 'none';
        });
        if (initialCards.length > 0) {
            animateCardsIn(initialCards);
        }
    }, 150);

    /* Asignar imagen de cada tarjeta desde los arrays en data/*.js y base ../../img_video/proyectos/industria/ */
    var arrByName = {
        REFINERIA_CARTAGENA_IMAGES: typeof REFINERIA_CARTAGENA_IMAGES !== 'undefined' ? REFINERIA_CARTAGENA_IMAGES : [],
        ALMA_MAGDALENA_IMAGES: typeof ALMA_MAGDALENA_IMAGES !== 'undefined' ? ALMA_MAGDALENA_IMAGES : [],
        ARCLAD_IMAGES: typeof ARCLAD_IMAGES !== 'undefined' ? ARCLAD_IMAGES : [],
        SEGOVIA_IMAGES: typeof SEGOVIA_IMAGES !== 'undefined' ? SEGOVIA_IMAGES : [],
        CCR_PALAGUA_IMAGES: typeof CCR_PALAGUA_IMAGES !== 'undefined' ? CCR_PALAGUA_IMAGES : [],
        COLCAFE_IMAGES: typeof COLCAFE_IMAGES !== 'undefined' ? COLCAFE_IMAGES : [],
        CERREJON_IMAGES: typeof CERREJON_IMAGES !== 'undefined' ? CERREJON_IMAGES : [],
        SPIA_IMAGES: typeof SPIA_IMAGES !== 'undefined' ? SPIA_IMAGES : [],
        CORNARE_IMAGES: typeof CORNARE_IMAGES !== 'undefined' ? CORNARE_IMAGES : [],
        CAMPANA_POLITICA_IMAGES: typeof CAMPANA_POLITICA_IMAGES !== 'undefined' ? CAMPANA_POLITICA_IMAGES : []
    };
    (function setInitialCardImages() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        var servicioActivo = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase() : '';
        document.querySelectorAll('.proyecto-card').forEach(function(card) {
            var imgDiv = card.querySelector('.proyecto-card-img');
            if (!imgDiv) return;
            var suffix = servicioActivo ? ('-' + servicioActivo) : '';
            var proyectoImg = card.getAttribute('data-proyecto-img' + suffix) || card.getAttribute('data-proyecto-img');
            if (proyectoImg) {
                imgDiv.style.backgroundImage = "url('" + proyectoImg + "')";
                var video = imgDiv.querySelector('.proyecto-card-video');
                if (video) video.style.display = 'none';
                return;
            }
            var varName = imgDiv.getAttribute('data-img-from');
            var carpeta = card.getAttribute('data-carpeta');
            if (!varName || !carpeta) return;
            var arr = arrByName[varName];
            if (arr && arr.length) {
                var first = arr[0];
                var url = INDUSTRIA_IMAGES_BASE + carpeta + '/' + encodeURIComponent(first);
                imgDiv.style.backgroundImage = "url('" + url + "')";
            }
        });
    })();

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
                            toggleIndustryCards();
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
                toggleIndustryCards();
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

    /* Servicios (tags) que muestran botón "Ver imagen ampliada" en Industria: modelación de ruido, modelación subacuática, analítica geoespacial */
    var serviciosConVerAmpliadaIndustria = ['modelacion-ruido', 'modelacion-ruido-subacuatico', 'geoespacial'];
    var btnVerAmpliada = document.getElementById('proyecto-panel-ver-ampliada');
    var imagenModal = document.getElementById('proyecto-imagen-modal');
    var imagenModalImg = document.getElementById('proyecto-imagen-modal-img');
    var imagenModalBackdrop = document.getElementById('proyecto-imagen-modal-backdrop');
    var imagenModalClose = document.getElementById('proyecto-imagen-modal-close');

    function getIndustryImagesAndBase(proyectoId) {
        var images = [];
        var folder = '';
        if (proyectoId === 'refineria-cartagena' && typeof REFINERIA_CARTAGENA_IMAGES !== 'undefined' && REFINERIA_CARTAGENA_IMAGES.length) {
            images = REFINERIA_CARTAGENA_IMAGES;
            base = '../img_video/proyectos/refineria/';
            return { images: images, base: base };
        } else if (proyectoId === 'alma-magdalena' && typeof ALMA_MAGDALENA_IMAGES !== 'undefined' && ALMA_MAGDALENA_IMAGES.length) {
            images = ALMA_MAGDALENA_IMAGES;
            folder = 'almaMagdalena';
        } else if (proyectoId === 'arclad' && typeof ARCLAD_IMAGES !== 'undefined' && ARCLAD_IMAGES.length) {
            images = ARCLAD_IMAGES;
            base = '../img_video/proyectos/arclad/';
            return { images: images, base: base };
        } else if ((proyectoId === 'segovia' || proyectoId === 'cafe-verde') && typeof SEGOVIA_IMAGES !== 'undefined' && SEGOVIA_IMAGES.length) {
            images = SEGOVIA_IMAGES;
            base = '../img_video/proyectos/segovia/';
            return { images: images, base: base };
        } else if (proyectoId === 'ccr-palagua' && typeof CCR_PALAGUA_IMAGES !== 'undefined' && CCR_PALAGUA_IMAGES.length) {
            images = CCR_PALAGUA_IMAGES;
            base = '../img_video/proyectos/promigas/';
            return { images: images, base: base };
        } else if (proyectoId === 'colcafe' && typeof COLCAFE_IMAGES !== 'undefined' && COLCAFE_IMAGES.length) {
            images = COLCAFE_IMAGES;
            base = '../img_video/proyectos/colcafe/';
            return { images: images, base: base };
        } else if (proyectoId === 'cerrejon' && typeof CERREJON_IMAGES !== 'undefined' && CERREJON_IMAGES.length) {
            images = CERREJON_IMAGES;
            base = '../img_video/proyectos/cerrejon/';
            return { images: images, base: base };
        } else if (proyectoId === 'spia' && typeof SPIA_IMAGES !== 'undefined' && SPIA_IMAGES.length) {
            images = SPIA_IMAGES;
            base = '../img_video/proyectos/spia/';
            return { images: images, base: base };
        } else if (proyectoId === 'cornare' && typeof CORNARE_IMAGES !== 'undefined' && CORNARE_IMAGES.length) {
            images = CORNARE_IMAGES;
            folder = 'CORNARE';
        } else if (proyectoId === 'campana-politica' && typeof CAMPANA_POLITICA_IMAGES !== 'undefined' && CAMPANA_POLITICA_IMAGES.length) {
            images = CAMPANA_POLITICA_IMAGES;
            folder = 'campanaPolitica';
        }
        var base = folder ? (INDUSTRIA_IMAGES_BASE + folder + '/') : '';
        return { images: images, base: base };
    }

    function buildPanelCarousel(proyectoId, titulo, imageSrc, imgFit, servicioActivo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        if (!imageSrc) imageSrc = '../img_video/servicios/industria/clasificacionFuentes.webp';
        panelCarouselImages = [imageSrc];
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.remove('multiple');
        var slide = document.createElement('div');
        slide.className = 'proyecto-panel-carousel-slide active';
        var img = document.createElement('img');
        img.src = imageSrc;
        img.alt = titulo;
        img.className = 'proyecto-panel-img proyecto-panel-img-fit-16-9';
        slide.appendChild(img);
        
        // Agregar botón de ampliar imagen para ARCLAD en Modelación de ruido (Evaluación de impacto acústico), SPIA en Modelación de ruido subacuático, y Campaña política en Analítica geoespacial
        var shouldAddExpandBtn = (servicioActivo === 'modelacion-ruido' && proyectoId === 'arclad' && titulo === 'Evaluación de impacto acústico') ||
                                 (servicioActivo === 'modelacion-ruido-subacuatico' && proyectoId === 'spia') ||
                                 (servicioActivo === 'geoespacial' && proyectoId === 'campana-politica');
        
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
        panelCarouselIndex = 0;
        // Ocultar siempre el botón "Ver imagen ampliada" - ahora se usa el botón de expandir en la imagen
        if (btnVerAmpliada) {
            btnVerAmpliada.style.display = 'none';
        }
    }

    function openImagenModal(imgSrc, titulo) {
        if (!imagenModal || !imagenModalImg) return;
        imagenModalImg.src = imgSrc || '';
        imagenModalImg.alt = titulo || 'Imagen ampliada';
        imagenModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('proyecto-imagen-modal-open');
        document.body.style.overflow = 'hidden';
    }
    function closeImagenModal() {
        if (!imagenModal) return;
        imagenModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('proyecto-imagen-modal-open');
        document.body.style.overflow = '';
        // Asegurar que el modal no bloquee clics después de cerrar
        if (imagenModalBackdrop) {
            imagenModalBackdrop.style.pointerEvents = 'none';
        }
        // Forzar reflow para asegurar que los cambios se apliquen
        void document.body.offsetWidth;
    }
    if (btnVerAmpliada) {
        btnVerAmpliada.addEventListener('click', function() {
            var activeSlide = panelCarouselTrack ? panelCarouselTrack.querySelector('.proyecto-panel-carousel-slide.active') : null;
            var img = activeSlide ? activeSlide.querySelector('.proyecto-panel-img') : null;
            var src = img ? img.src : '';
            if (src) openImagenModal(src);
        });
    }
    if (imagenModalBackdrop) imagenModalBackdrop.addEventListener('click', closeImagenModal);
    if (imagenModalClose) imagenModalClose.addEventListener('click', closeImagenModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagenModal && imagenModal.getAttribute('aria-hidden') === 'false') {
            closeImagenModal();
        }
    });

    function goPanelCarousel(delta) {
        if (panelCarouselImages.length <= 1) return;
        var slides = panelCarouselTrack ? panelCarouselTrack.querySelectorAll('.proyecto-panel-carousel-slide') : [];
        if (slides.length === 0) return;
        slides[panelCarouselIndex].classList.remove('active');
        panelCarouselIndex = (panelCarouselIndex + delta + slides.length) % slides.length;
        slides[panelCarouselIndex].classList.add('active');
    }

    function syncProyectoPanelDesktopLayout() {
        var pg = document.querySelector('.proyectos-page');
        var anchor = document.querySelector('.proyectos-cards-container');
        if (!pg) return;
        if (window.matchMedia('(max-width: 900px)').matches) {
            pg.style.removeProperty('--proyecto-panel-top-px');
            return;
        }
        if (!anchor) return;
        var rect = anchor.getBoundingClientRect();
        var topPx = Math.max(8, Math.round(rect.top));
        pg.style.setProperty('--proyecto-panel-top-px', topPx + 'px');
    }

    var syncProyectoPanelScheduled = false;
    function scheduleSyncProyectoPanelDesktopLayout() {
        if (!document.body.classList.contains('proyecto-panel-open')) return;
        if (window.matchMedia('(max-width: 900px)').matches) return;
        if (syncProyectoPanelScheduled) return;
        syncProyectoPanelScheduled = true;
        window.requestAnimationFrame(function() {
            syncProyectoPanelScheduled = false;
            syncProyectoPanelDesktopLayout();
        });
    }
    window.addEventListener('resize', scheduleSyncProyectoPanelDesktopLayout, { passive: true });
    window.addEventListener('scroll', scheduleSyncProyectoPanelDesktopLayout, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleSyncProyectoPanelDesktopLayout);
        window.visualViewport.addEventListener('scroll', scheduleSyncProyectoPanelDesktopLayout);
    }

    function openProyectoPanel() {
        syncProyectoPanelDesktopLayout();
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
        window.requestAnimationFrame(function() {
            syncProyectoPanelDesktopLayout();
        });
    }
    function closeProyectoPanel() {
        if (page) {
            page.classList.remove('proyecto-panel-open');
            page.style.removeProperty('--proyecto-panel-top-px');
        }
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
            var activeTag = document.querySelector('.proyectos-tag.active');
            var servicioActivo = activeTag ? (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase() : '';
            var panelData = getPanelData(card, servicioActivo);
            var titulo = panelData.titulo;
            var desc = panelData.desc;
            var categoria = card.getAttribute('data-proyecto-categoria') || '';
            var ano = panelData.ano;
            var cliente = panelData.cliente;
            var panelImg = panelData.panelImg || '';
            var imgFit = panelData.imgFit || '';
            buildPanelCarousel(proyectoId, titulo, panelImg, imgFit, servicioActivo);
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

    /* Abrir panel al llegar desde inicio con ?proyecto=xxx */
    var openParams = new URLSearchParams(window.location.search);
    var openProyectoId = openParams.get('proyecto');
    var proyectoToServicio = {
        'refineria-cartagena': 'control-ruido', 'alma-magdalena': 'control-ruido', 'arclad': 'control-ruido',
        'segovia': 'medicion-vibraciones', 'ccr-palagua': 'control-ruido', 'colcafe': 'control-ruido',
        'cerrejon': 'holografia-acustica', 'cafe-verde': 'holografia-acustica', 'campana-politica': 'geoespacial',
        'spia': 'modelacion-ruido-subacuatico'
    };

    function getPanelData(card, servicioActivo) {
        var suffix = servicioActivo ? ('-' + servicioActivo) : '';
        var titulo = card.getAttribute('data-proyecto-titulo' + suffix) || card.getAttribute('data-proyecto-titulo') || '';
        var ano = card.getAttribute('data-proyecto-ano' + suffix) || card.getAttribute('data-proyecto-ano') || '';
        var cliente = card.getAttribute('data-proyecto-cliente' + suffix) || card.getAttribute('data-proyecto-cliente') || '';
        var desc = card.getAttribute('data-proyecto-desc-full' + suffix) || card.getAttribute('data-proyecto-desc-full') || card.getAttribute('data-proyecto-desc' + suffix) || card.getAttribute('data-proyecto-desc') || '';
        var panelImg = card.getAttribute('data-proyecto-img-interna' + suffix) || card.getAttribute('data-proyecto-img-interna') || '';
        var imgFit = card.getAttribute('data-proyecto-img-interna-fit' + suffix) || card.getAttribute('data-proyecto-img-interna-fit') || '';
        return { titulo: titulo, ano: ano, cliente: cliente, desc: desc, panelImg: panelImg, imgFit: imgFit };
    }
    if (openProyectoId && proyectoToServicio[openProyectoId] !== undefined) {
        var servicioToOpen = proyectoToServicio[openProyectoId];
        var tagIndex = tagMap[servicioToOpen];
        if (tagIndex !== undefined) {
            tags.forEach(function(t, i) { t.classList.toggle('active', i === tagIndex); });
            var url = new URL(window.location.href);
            url.searchParams.set('servicio', servicioToOpen);
            window.history.replaceState({}, '', url);
        }
        toggleIndustryCards();
        setTimeout(function() {
            var card = document.querySelector('.proyecto-card[data-proyecto="' + openProyectoId + '"]');
            if (card) {
                var panelData = getPanelData(card, servicioToOpen);
                var titulo = panelData.titulo;
                var desc = panelData.desc;
                var categoria = card.getAttribute('data-proyecto-categoria') || '';
                var ano = panelData.ano;
                var cliente = panelData.cliente;
                var panelImg = panelData.panelImg || '';
                var imgFit = panelData.imgFit || '';
                buildPanelCarousel(openProyectoId, titulo, panelImg, imgFit, servicioToOpen);
                if (panelTitle) panelTitle.textContent = titulo;
                if (panelCategoria) panelCategoria.textContent = categoria;
                if (panelAno) panelAno.textContent = ano;
                if (panelCliente) panelCliente.textContent = cliente;
                if (panelDesc) panelDesc.textContent = desc;
                openProyectoPanel();
            }
        }, 150);
    }
})();
