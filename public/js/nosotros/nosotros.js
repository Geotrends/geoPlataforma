(function() {
    var pathLower = (window.location.pathname || '').toLowerCase();
    var isEnglish =
        (document.documentElement.lang || '').toLowerCase().startsWith('en') ||
        pathLower.startsWith('/en/') ||
        pathLower === '/en' ||
        pathLower.indexOf('/html/en/') !== -1 ||
        pathLower.endsWith('/html/en');
    var content = {
        'quienes-somos': {
            title: 'Quiénes somos',
            body: '<p>Somos una startup especializada en acústica que integra ciencia, ingeniería y tecnología avanzada para transformar la manera en que ciudades e industrias gestionan el ruido. Combinamos monitoreo inteligente con sensores IoT, analítica geoespacial, modelación predictiva, gemelos digitales y soluciones de mitigación diseñadas a la medida para abordar desafíos acústicos de alta complejidad técnica. Hemos contribuido a la formulación y soporte de política pública y ejecutado intervenciones para infraestructura crítica bajo los más altos estándares técnicos. Nuestro enfoque conecta desempeño ambiental, cumplimiento normativo y estrategia ESG, reduciendo riesgos, fortaleciendo la trazabilidad y generando valor reputacional. En Geotrends acompañamos a empresas y territorios, transformando los desafíos acústicos en oportunidades de sostenibilidad, cumplimiento y liderazgo competitivo.</p>'
        },
        proposito: {
            title: 'Propósito',
            body: '<p>En Geotrends creemos que promover entornos más limpios, saludables y seguros es fundamental en la construcción de territorios sostenibles que beneficien a todos los seres vivos. Por eso, aprovechamos la innovación y las tecnologías 4.0 para transformar el ruido, un contaminante invisible que afecta a millones, en inteligencia accionable que impulsa decisiones con impacto real. A través de nuestros ecosistemas inteligentes y tecnologías IoT, empoderamos a comunidades, ciudades e industrias para no solo medir, sino transformar sus entornos hacia un mejor futuro.</p>' +
                '<div class="about-proposito-video-wrap"><video class="about-proposito-video" controls playsinline preload="metadata" aria-label="Video de propósito Geotrends"><source src="../img_video/sobreNosotros/proposito.mp4" type="video/mp4"></video></div>'
        },
        valores: {
            title: 'Valores corporativos',
            body: '<div class="about-valores-cards about-valores-in-panel">' +
                '<article class="about-valores-card about-valores-card-innovation"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/pasion.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Pasión por la excelencia</strong><span class="about-valores-card-sub">Creemos que la excelencia comienza por dentro. Cada día nos desafiamos a crecer, aprender y dar lo mejor. No porque nos lo pidan, sino porque creemos en lo que estamos creando.</span></div></article>' +
                '<article class="about-valores-card about-valores-card-rigor"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/hands.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">La confianza como base</strong><span class="about-valores-card-sub">Construimos relaciones duraderas mediante la transparencia, la integridad y la responsabilidad. La confianza es el centro de cómo colaboramos con clientes, socios y entre nosotros.</span></div></article>' +
                '<article class="about-valores-card about-valores-card-territorio"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/award.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Empoderados para asumirlo</strong><span class="about-valores-card-sub">Creemos que el empoderamiento real significa liderar el propio trabajo con convicción, autonomía e innovación. Cada miembro del equipo es confiable para actuar con criterio, asumir sus decisiones y contribuir a un propósito compartido.</span></div></article>' +
                '<article class="about-valores-card about-valores-card-innovation"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/happyFace.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Felicidad en lo que construimos</strong><span class="about-valores-card-sub">Creemos que la innovación y el impacto duradero vienen de trabajar con pasión y alegría. La felicidad impulsa la creatividad, la resiliencia y las conexiones auténticas. Hace que nuestro camino sea significativo y nuestros logros sostenibles.</span></div></article>' +
                '<article class="about-valores-card about-valores-card-rigor"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/team.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Unidos para resonar nuestro impacto</strong><span class="about-valores-card-sub">Logramos más, más rápido y mejor cuando trabajamos juntos. La colaboración, el propósito compartido y la ambición colectiva transforman grandes ideas en realidades poderosas.</span></div></article>' +
                '</div>'
        },
        'reconocimientos-clientes': {
            title: 'Reconocimientos y clientes',
            body:                 '<section class="about-recon-clientes-seccion" aria-label="Reconocimientos"><h3 class="about-recon-clientes-seccion-title">Reconocimientos</h3>' +
                '<div class="about-recon-clientes-scroll-wrap"><ul class="about-recon-logos-list" aria-label="Logos de reconocimientos">' +
                '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/rutan.webp" alt="RUTAN" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/ituseed.webp" alt="ITUSEED" class="about-recon-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/royal.webp" alt="Royal" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/innpulsa.webp" alt="Innpulsa" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                '</ul></div></section>' +
                '<section class="about-recon-clientes-seccion" aria-label="Clientes"><h3 class="about-recon-clientes-seccion-title">Clientes</h3>' +
                '<div class="about-recon-clientes-scroll-wrap"><ul class="about-clientes-logos about-clientes-logos-inline" aria-label="Logos de clientes">' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/udea.webp" alt="Universidad de Antioquia" class="about-clientes-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/pepsico.webp" alt="PepsiCo" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/colcafe.webp" alt="Colcafé" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/pg.webp" alt="Procter & Gamble" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/aislaterm.webp" alt="Aislather" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/aqua-terra.webp" alt="Aqua & Terra" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/arclad.webp" alt="ARCLAD" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/usb.webp" alt="Universidad de San Buenaventura" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/envigado.png" alt="Alcaldía de Envigado" class="about-clientes-logo-img about-clientes-logo-envigado" width="120" height="48" loading="lazy"></li>' +
                '<li class="about-clientes-logo-item"><img src="../img_video/clientes/ing.webp" alt="CCR Ingenieros Asociados" class="about-clientes-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                '</ul></div></section>'
        }
    };

    if (isEnglish) {
        content = {
            'quienes-somos': {
                title: 'Who we are',
                body: '<p>We are an acoustics-focused startup that integrates science, engineering, and advanced technology to transform how cities and industries manage noise. We combine smart monitoring with IoT sensors, geospatial analytics, predictive modeling, digital twins, and tailored mitigation solutions to address high-complexity acoustic challenges. We have contributed to public policy design and support, and delivered interventions for critical infrastructure under the highest technical standards. Our approach connects environmental performance, regulatory compliance, and ESG strategy—reducing risk, strengthening traceability, and creating reputational value. At Geotrends, we support companies and territories, turning acoustic challenges into opportunities for sustainability, compliance, and competitive leadership.</p>'
            },
            proposito: {
                title: 'Purpose',
                body: '<p>At Geotrends, we believe that promoting cleaner, healthier, and safer environments is essential to building sustainable territories that benefit all living beings. That’s why we leverage innovation and Industry 4.0 technologies to transform noise—an invisible pollutant that affects millions—into actionable intelligence that drives decisions with real impact. Through our smart ecosystems and IoT technologies, we empower communities, cities, and industries not only to measure, but to transform their environments toward a better future.</p>' +
                    '<div class="about-proposito-video-wrap"><video class="about-proposito-video" controls playsinline preload="metadata" aria-label="Geotrends purpose video"><source src="../img_video/sobreNosotros/proposito.mp4" type="video/mp4"></video></div>'
            },
            valores: {
                title: 'Core values',
                body: '<div class="about-valores-cards about-valores-in-panel">' +
                    '<article class="about-valores-card about-valores-card-innovation"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/pasion.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Passion for excellence</strong><span class="about-valores-card-sub">We believe excellence starts within. Every day we challenge ourselves to grow, learn, and give our best—not because we’re asked to, but because we believe in what we are building.</span></div></article>' +
                    '<article class="about-valores-card about-valores-card-rigor"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/hands.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Trust as the foundation</strong><span class="about-valores-card-sub">We build lasting relationships through transparency, integrity, and accountability. Trust is at the center of how we collaborate with clients, partners, and each other.</span></div></article>' +
                    '<article class="about-valores-card about-valores-card-territorio"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/award.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Empowered to own it</strong><span class="about-valores-card-sub">We believe real empowerment means leading your work with conviction, autonomy, and innovation. Each team member is trusted to use good judgment, take ownership of decisions, and contribute to a shared purpose.</span></div></article>' +
                    '<article class="about-valores-card about-valores-card-innovation"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/happyFace.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">Joy in what we build</strong><span class="about-valores-card-sub">We believe innovation and lasting impact come from working with passion and joy. Happiness fuels creativity, resilience, and authentic connections—making our journey meaningful and our achievements sustainable.</span></div></article>' +
                    '<article class="about-valores-card about-valores-card-rigor"><span class="about-valores-card-circle" aria-hidden="true"><img src="../img_video/sobreNosotros/valores/team.webp" alt="" class="about-valores-card-icon-img"></span><div class="about-valores-card-text"><strong class="about-valores-card-title">United to amplify our impact</strong><span class="about-valores-card-sub">We achieve more—faster and better—when we work together. Collaboration, shared purpose, and collective ambition turn great ideas into powerful realities.</span></div></article>' +
                    '</div>'
            },
            'reconocimientos-clientes': {
                title: 'Recognition & clients',
                body: '<section class="about-recon-clientes-seccion" aria-label="Recognition"><h3 class="about-recon-clientes-seccion-title">Recognition</h3>' +
                    '<div class="about-recon-clientes-scroll-wrap"><ul class="about-recon-logos-list" aria-label="Recognition logos">' +
                    '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/rutan.webp" alt="RUTAN" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                    '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/ituseed.webp" alt="ITUSEED" class="about-recon-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                    '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/royal.webp" alt="Royal" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                    '<li class="about-recon-logo-item"><img src="../img_video/reconocimientos/innpulsa.webp" alt="Innpulsa" class="about-recon-logo-img" width="160" height="80" loading="lazy"></li>' +
                    '</ul></div></section>' +
                    '<section class="about-recon-clientes-seccion" aria-label="Clients"><h3 class="about-recon-clientes-seccion-title">Clients</h3>' +
                    '<div class="about-recon-clientes-scroll-wrap"><ul class="about-clientes-logos about-clientes-logos-inline" aria-label="Client logos">' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/udea.webp" alt="Universidad de Antioquia" class="about-clientes-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/pepsico.webp" alt="PepsiCo" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/colcafe.webp" alt="Colcafé" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/pg.webp" alt="Procter & Gamble" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/aislaterm.webp" alt="Aislather" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/aqua-terra.webp" alt="Aqua & Terra" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/arclad.webp" alt="ARCLAD" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/usb.webp" alt="Universidad de San Buenaventura" class="about-clientes-logo-img" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/envigado.png" alt="Alcaldía de Envigado" class="about-clientes-logo-img about-clientes-logo-envigado" width="120" height="48" loading="lazy"></li>' +
                    '<li class="about-clientes-logo-item"><img src="../img_video/clientes/ing.webp" alt="CCR Ingenieros Asociados" class="about-clientes-logo-img about-logo-size-match" width="160" height="80" loading="lazy"></li>' +
                    '</ul></div></section>'
            }
        };
    }

    var tabs = document.querySelectorAll('.about-tab[data-tab]');
    var panel = document.getElementById('about-panel');
    var panelTitle = document.getElementById('about-panel-title');
    var panelBody = document.getElementById('about-panel-body');
    var gridWrap = document.getElementById('about-equipo-grid');
    var detalleWrap = document.querySelector('.about-equipo-detalle-wrap');

    /** Sincroniza título y cuerpo con el idioma activo al cargar (evita HTML inicial en ES en /en). */
    function syncInitialPanelFromContent() {
        var activeTabEl = document.querySelector('.about-tab.active[data-tab]');
        var key = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'quienes-somos';
        var c = content[key];
        if (!c || !panelTitle || !panelBody) return;
        panelTitle.textContent = key === 'reconocimientos-clientes' ? '' : c.title;
        panelBody.innerHTML = c.body;
        if (gridWrap) {
            if (key === 'quienes-somos') {
                gridWrap.removeAttribute('hidden');
                gridWrap.setAttribute('aria-hidden', 'false');
                gridWrap.style.opacity = '1';
            } else {
                gridWrap.setAttribute('hidden', '');
                gridWrap.setAttribute('aria-hidden', 'true');
            }
        }
        if (detalleWrap) {
            if (key === 'quienes-somos') {
                detalleWrap.setAttribute('data-visible', 'true');
                detalleWrap.style.display = 'block';
            } else {
                detalleWrap.setAttribute('data-visible', 'false');
                detalleWrap.style.display = 'none';
            }
        }
    }

    function showPanel(key) {
        var c = content[key];
        if (!c) return;
        if (panel) {
            panel.hidden = false;
            panel.removeAttribute('aria-hidden');
            panel.style.opacity = '1';
            panel.setAttribute('data-tab-active', key);
        }
        if (panel && panelBody && panelTitle) {
            panel.classList.add('about-panel-exit');
            setTimeout(function() {
                panelTitle.textContent = (key === 'reconocimientos-clientes') ? '' : c.title;
                panelBody.innerHTML = c.body;
                panel.classList.remove('about-panel-exit');
                void panel.offsetWidth;
                panel.classList.add('about-panel-enter');
                setTimeout(function() {
                    panel.classList.remove('about-panel-enter');
                }, 550);
            }, 280);
        }
        if (gridWrap) {
            if (key === 'quienes-somos') {
                gridWrap.removeAttribute('hidden');
                gridWrap.setAttribute('aria-hidden', 'false');
                gridWrap.style.opacity = '1';
            } else {
                gridWrap.setAttribute('hidden', '');
                gridWrap.setAttribute('aria-hidden', 'true');
            }
        }
        // Mostrar/ocultar sección detallada solo en "Quiénes somos"
        if (detalleWrap) {
            if (key === 'quienes-somos') {
                detalleWrap.setAttribute('data-visible', 'true');
                detalleWrap.style.display = 'block';
            } else {
                detalleWrap.setAttribute('data-visible', 'false');
                detalleWrap.style.display = 'none';
            }
        }
    }

    syncInitialPanelFromContent();

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var key = tab.getAttribute('data-tab');
            if (!key) return;
            showPanel(key);
            tabs.forEach(function(t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        });
    });

    // Mostrar sección detallada al cargar si "Quiénes somos" está activa por defecto
    var activeTab = document.querySelector('.about-tab.active');
    if (activeTab) {
        var activeKey = activeTab.getAttribute('data-tab');
        if (activeKey === 'quienes-somos' && detalleWrap) {
            detalleWrap.setAttribute('data-visible', 'true');
            detalleWrap.style.display = 'block';
        }
    }

    // Carrusel de equipo para responsive
    (function() {
        var carouselWrap = document.querySelector('.about-equipo-carousel-mobile');
        if (!carouselWrap) return;
        
        var track = document.getElementById('about-equipo-track-mobile');
        var prevBtn = carouselWrap.querySelector('.about-equipo-carousel-prev');
        var nextBtn = carouselWrap.querySelector('.about-equipo-carousel-next');
        var cards = track ? track.querySelectorAll('.about-equipo-card') : [];
        
        if (!track || cards.length === 0) return;
        
        var currentIndex = 0;
        var cardWidth = 0;
        var gap = 20; // gap entre cards (1.25rem = 20px aproximadamente)
        
        function updateCardWidth() {
            if (cards.length > 0 && cards[0]) {
                var card = cards[0];
                var computedStyle = window.getComputedStyle(card);
                cardWidth = card.offsetWidth + gap;
            }
        }
        
        function scrollToIndex(index) {
            if (!track) return;
            updateCardWidth();
            var scrollPosition = index * cardWidth;
            track.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            currentIndex = index;
            updateButtons();
        }
        
        function updateButtons() {
            if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
            }
            if (nextBtn) {
                nextBtn.disabled = currentIndex >= cards.length - 1;
                nextBtn.style.opacity = currentIndex >= cards.length - 1 ? '0.5' : '1';
                nextBtn.style.cursor = currentIndex >= cards.length - 1 ? 'not-allowed' : 'pointer';
            }
        }
        
        function goToNext() {
            if (currentIndex < cards.length - 1) {
                scrollToIndex(currentIndex + 1);
            }
        }
        
        function goToPrev() {
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex > 0) {
                    goToPrev();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex < cards.length - 1) {
                    goToNext();
                }
            });
        }
        
        // Actualizar índice basado en el scroll
        if (track) {
            track.addEventListener('scroll', function() {
                updateCardWidth();
                var scrollLeft = track.scrollLeft;
                var newIndex = Math.round(scrollLeft / cardWidth);
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                    currentIndex = newIndex;
                    updateButtons();
                }
            });
        }
        
        // Inicializar botones
        updateButtons();
        
        // Actualizar en resize
        var resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateCardWidth();
                scrollToIndex(currentIndex);
            }, 150);
        });
        
        // Inicializar al cargar
        updateCardWidth();
    })();

    // Animaciones por scroll: cada sección aparece al entrar en vista (todos los responsive)
    (function() {
        var config = { rootMargin: '0px 0px -5% 0px', threshold: 0.05 };

        function toggleWithReflow(el, className) {
            return function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) {
                        el.classList.remove(className);
                        void el.offsetWidth;
                        el.classList.add(className);
                    } else {
                        el.classList.remove(className);
                    }
                });
            };
        }

        var mainCard = document.querySelector('.about-main-card');
        if (mainCard) {
            (new IntersectionObserver(toggleWithReflow(mainCard, 'about-main-animated'), config)).observe(mainCard);
        }
        var equipoGrid = document.getElementById('about-equipo-grid');
        if (equipoGrid) {
            (new IntersectionObserver(toggleWithReflow(equipoGrid, 'about-equipo-animated'), config)).observe(equipoGrid);
        }
        var detalleWrap = document.querySelector('.about-equipo-detalle-wrap');
        if (detalleWrap) {
            (new IntersectionObserver(toggleWithReflow(detalleWrap, 'about-detalle-animated'), config)).observe(detalleWrap);
        }
    })();

})();
