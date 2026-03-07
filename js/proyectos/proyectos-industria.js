(function() {
    var INDUSTRIA_IMAGES_BASE = '../../img_video/proyectos/industria/';
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
    var tagMap = {
        iot: 0, 'control-ruido': 1, 'clasificacion-fuentes': 2, 'modelacion-ruido': 3,
        'holografia-acustica': 4, 'medicion-vibraciones': 5, 'modelacion-vibraciones': 6,
        'modelacion-ruido-subacuatico': 7, 'medicion-ruido-subacuatico': 8,
        geoespacial: 9, fotogrametria: 10
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
    }
    
    var emptyMsg = document.getElementById('proyectos-empty-message');
    var carouselTrack = document.getElementById('industria-carousel-track');
    var allCards = document.querySelectorAll('.proyecto-card');
    
    function toggleIndustryCards() {
        var activeTag = document.querySelector('.proyectos-tag.active');
        if (!activeTag) return;
        
        var servicioActivo = (activeTag.getAttribute('data-servicio') || '').trim().toLowerCase();
        if (!servicioActivo) return;
        
        // CORNARE en industria: SOLO aparece en "clasificacion-fuentes"
        var servicioPermitidoCORNARE = 'clasificacion-fuentes';
        
        // Servicios permitidos para ARCLAD - SOLO estos 4
        var serviciosPermitidosARCLAD = ['control-ruido', 'clasificacion-fuentes', 'modelacion-ruido', 'fotogrametria'];
        
        // CCR Palagua en industria: SOLO aparece en "fotogrametria"
        var servicioPermitidoCCRPalagua = 'fotogrametria';
        
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
            
            // CORNARE: SOLO aparece en "clasificacion-fuentes"
            if (proyectoId === 'cornare') {
                if (servicioActivo === servicioPermitidoCORNARE) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para CORNARE
            }
            
            // ARCLAD: SOLO aparece en Control de ruido, Clasificación de fuentes, Modelación de ruido y Fotogrametría
            if (proyectoId === 'arclad') {
                if (serviciosPermitidosARCLAD.indexOf(servicioActivo) !== -1) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para ARCLAD
            }
            
            // CCR Palagua: SOLO aparece en "fotogrametria"
            if (proyectoId === 'ccr-palagua') {
                if (servicioActivo === servicioPermitidoCCRPalagua) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para CCR Palagua
            }
            
            // Campaña política: SOLO aparece en "geoespacial"
            if (proyectoId === 'campana-politica') {
                if (servicioActivo === servicioPermitidoCampanaPolitica) {
                    cardsToShow.push(card);
                }
                return; // No verificar más para Campaña política
            }
            
            // P&G: SOLO aparece en "holografia-acustica"
            if (proyectoId === 'p-and-g') {
                if (servicioActivo === 'holografia-acustica') {
                    cardsToShow.push(card);
                }
                return; // No verificar más para P&G
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
        MINEROS_BIC_IMAGES: typeof MINEROS_BIC_IMAGES !== 'undefined' ? MINEROS_BIC_IMAGES : [],
        P_AND_G_IMAGES: typeof P_AND_G_IMAGES !== 'undefined' ? P_AND_G_IMAGES : [],
        PEPSICO_IMAGES: typeof PEPSICO_IMAGES !== 'undefined' ? PEPSICO_IMAGES : [],
        SPIA_IMAGES: typeof SPIA_IMAGES !== 'undefined' ? SPIA_IMAGES : [],
        CORNARE_IMAGES: typeof CORNARE_IMAGES !== 'undefined' ? CORNARE_IMAGES : [],
        CAMPANA_POLITICA_IMAGES: typeof CAMPANA_POLITICA_IMAGES !== 'undefined' ? CAMPANA_POLITICA_IMAGES : []
    };
    document.querySelectorAll('.proyecto-card[data-carpeta]').forEach(function(card) {
        var imgDiv = card.querySelector('.proyecto-card-img[data-img-from]');
        if (!imgDiv) return;
        var proyectoImg = card.getAttribute('data-proyecto-img');
        if (proyectoImg) {
            imgDiv.style.backgroundImage = "url('" + proyectoImg + "')";
            return;
        }
        var varName = imgDiv.getAttribute('data-img-from');
        var carpeta = card.getAttribute('data-carpeta');
        var arr = arrByName[varName];
        if (arr && arr.length && carpeta) {
            var first = arr[0];
            var url = INDUSTRIA_IMAGES_BASE + carpeta + '/' + encodeURIComponent(first);
            imgDiv.style.backgroundImage = "url('" + url + "')";
        }
    });

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
        } else if (proyectoId === 'segovia' && typeof SEGOVIA_IMAGES !== 'undefined' && SEGOVIA_IMAGES.length) {
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
        } else if (proyectoId === 'mineros-bic' && typeof MINEROS_BIC_IMAGES !== 'undefined' && MINEROS_BIC_IMAGES.length) {
            images = MINEROS_BIC_IMAGES;
            base = '../img_video/proyectos/minerosbic/';
            return { images: images, base: base };
        } else if (proyectoId === 'p-and-g' && typeof P_AND_G_IMAGES !== 'undefined' && P_AND_G_IMAGES.length) {
            images = P_AND_G_IMAGES;
            base = '../img_video/proyectos/p&g/';
            return { images: images, base: base };
        } else if (proyectoId === 'pepsico' && typeof PEPSICO_IMAGES !== 'undefined' && PEPSICO_IMAGES.length) {
            images = PEPSICO_IMAGES;
            base = '../img_video/proyectos/pepsico/';
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

    function buildPanelCarousel(proyectoId, titulo) {
        if (!panelCarouselTrack) return;
        panelCarouselTrack.innerHTML = '';
        panelCarouselImages = [];
        // Usar la imagen de clasificación de fuentes de servicios como imagen horizontal única para todos los proyectos
        var imageSrc = '../img_video/servicios/industria/clasificacionFuentes.webp';
        panelCarouselImages = [imageSrc];
        var wrap = panelCarouselTrack.closest('.proyecto-panel-carousel-wrap');
        if (wrap) wrap.classList.remove('multiple'); // Siempre una sola imagen, no múltiple
            var slide = document.createElement('div');
        slide.className = 'proyecto-panel-carousel-slide active';
            var img = document.createElement('img');
        img.src = imageSrc;
        img.alt = titulo;
            img.className = 'proyecto-panel-img';
            slide.appendChild(img);
            panelCarouselTrack.appendChild(slide);
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
        if (panel) panel.setAttribute('aria-hidden', 'false');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    }
    function closeProyectoPanel() {
        if (page) page.classList.remove('proyecto-panel-open');
        document.body.classList.remove('proyecto-panel-open');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.proyecto-card').forEach(function(card) {
        var linkWrap = card.querySelector('.proyecto-card-link-wrap');
        if (!linkWrap) return;
        linkWrap.addEventListener('click', function(e) {
            e.preventDefault();
            var proyectoId = card.getAttribute('data-proyecto') || '';
            var titulo = card.getAttribute('data-proyecto-titulo') || '';
            var desc = card.getAttribute('data-proyecto-desc-full') || card.getAttribute('data-proyecto-desc') || '';
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
    var proyectoToServicio = {
        'refineria-cartagena': 'control-ruido', 'alma-magdalena': 'control-ruido', 'arclad': 'control-ruido',
        'segovia': 'medicion-vibraciones', 'ccr-palagua': 'fotogrametria', 'colcafe': 'control-ruido',
        'cerrejon': 'holografia-acustica', 'mineros-bic': 'holografia-acustica', 'p-and-g': 'holografia-acustica', 'pepsico': 'control-ruido',
        'spia': 'modelacion-ruido-subacuatico'
    };
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
                var titulo = card.getAttribute('data-proyecto-titulo') || '';
                var desc = card.getAttribute('data-proyecto-desc-full') || card.getAttribute('data-proyecto-desc') || '';
                var categoria = card.getAttribute('data-proyecto-categoria') || '';
                var ano = card.getAttribute('data-proyecto-ano') || '';
                var cliente = card.getAttribute('data-proyecto-cliente') || '';
                buildPanelCarousel(openProyectoId, titulo);
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
