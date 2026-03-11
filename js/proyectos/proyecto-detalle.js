(function() {
    var params = new URLSearchParams(window.location.search);
    var seccion = params.get('seccion') || 'industria';
    var proyecto = params.get('proyecto') || '';
    var backLink = document.getElementById('proyecto-detalle-back');
    var backServicio = (proyecto === 'refineria-cartagena' || proyecto === 'alma-magdalena' || proyecto === 'arclad' || proyecto === 'colcafe' || proyecto === 'pepsico') ? 'control-ruido' : (proyecto === 'amva-usb' ? 'iot' : (proyecto === 'segovia' ? 'medicion-vibraciones' : (proyecto === 'ccr-palagua' ? 'fotogrametria' : (proyecto === 'cerrejon' || proyecto === 'mineros-bic' || proyecto === 'p-and-g' ? 'holografia-acustica' : (proyecto === 'spia' ? 'medicion-ruido-subacuatico' : '')))));
    backLink.href = seccion === 'ciudades' ? 'proyectos-ciudades.html' + (backServicio ? '?servicio=' + backServicio : '') : 'proyectos-industria.html' + (backServicio ? '?servicio=' + backServicio : '');

    var titulo = params.get('titulo') || (seccion === 'ciudades' ? 'Proyecto Ciudades' : 'Proyecto Industria');
    var categoria = params.get('categoria') || seccion;
    var ano = params.get('ano') || '2023';
    var cliente = params.get('cliente') || (seccion === 'ciudades' ? 'Cliente Ejemplo' : 'Cliente Industrial Ejemplo');
    var desc = params.get('desc');
    if (!desc) {
        if (proyecto === 'refineria-cartagena')
            desc = 'Proyecto integral de control y modelación acústica en Refinería Cartagena: mediciones in situ, mapas de ruido, identificación de fuentes y planes de mitigación para cumplimiento normativo y mejora del entorno laboral. Combinamos holografía acústica, modelación numérica y analítica geoespacial para entregar soluciones que reducen la exposición al ruido y optimizan la operación industrial.';
        else if (proyecto === 'alma-magdalena')
            desc = 'Proyecto de control de ruido y evaluación acústica en Alma Magdalena: mediciones en campo, mapas de ruido, identificación de fuentes y propuestas de mitigación para cumplimiento ambiental y mejora de la calidad sonora del entorno. Integramos modelación predictiva y mediciones in situ para entregar diagnósticos y planes de acción alineados con la normativa vigente.';
        else if (proyecto === 'amva-usb')
            desc = 'Proyecto de monitoreo urbano y soluciones geoespaciales para el Área Metropolitana del Valle de Aburrá (AMVA): mediciones ambientales, mapas de ruido, sensores IoT y plataformas de información territorial para la gestión inteligente de la ciudad. Integramos datos en tiempo real, analítica geoespacial y acústica para apoyar la toma de decisiones y el cumplimiento normativo en entornos urbanos.';
        else if (proyecto === 'arclad')
            desc = 'Proyecto integral de control de ruido, clasificación de fuentes y modelación acústica industrial para ARCLAD: mediciones in situ, identificación de fuentes de ruido, mapas de ruido y modelación predictiva para cumplimiento normativo y mejora del entorno laboral. Combinamos medición, clasificación de fuentes y modelación numérica para entregar soluciones que reducen la exposición al ruido y optimizan la operación.';
        else if (proyecto === 'segovia')
            desc = 'Proyecto de medición de vibraciones industriales en Segovia: mediciones in situ con equipos especializados, análisis de señales y espectros, identificación de fuentes de vibración y evaluación de impacto para cumplimiento normativo y mejora del entorno. Integramos medición de vibraciones con analítica geoespacial para entregar diagnósticos y recomendaciones técnicas.';
        else if (proyecto === 'ccr-palagua')
            desc = 'Proyecto de fotogrametría y levantamiento geoespacial en CCR Palagua: captura de imágenes para modelado 3D, ortofotos y productos cartográficos para gestión de activos industriales. Combinamos vuelos con drone, procesamiento fotogramétrico y analítica geoespacial para entregar soluciones de medición y monitoreo del territorio.';
        else if (proyecto === 'colcafe')
            desc = 'Proyecto integral de control de ruido, holografía acústica y medición de vibraciones para Colcafé: mediciones in situ, identificación de fuentes con holografía acústica, análisis de vibraciones y planes de mitigación para cumplimiento normativo y mejora del entorno laboral. Combinamos técnicas de diagnóstico acústico y de vibraciones para entregar soluciones que reducen la exposición y optimizan la operación industrial.';
        else if (proyecto === 'cerrejon')
            desc = 'Proyecto de holografía acústica para Cerrejón: identificación y localización de fuentes de ruido mediante técnicas de holografía acústica, mediciones in situ y análisis de mapas de intensidad sonora para cumplimiento normativo y mejora del entorno laboral en operaciones mineras. Combinamos medición avanzada y visualización espacial del ruido para entregar diagnósticos y planes de mitigación.';
        else if (proyecto === 'mineros-bic')
            desc = 'Proyecto de holografía acústica para Mineros BIC: identificación y localización de fuentes de ruido mediante técnicas de holografía acústica, mediciones in situ y análisis de mapas de intensidad sonora para cumplimiento normativo y mejora del entorno laboral. Combinamos medición avanzada y visualización espacial del ruido para entregar diagnósticos y planes de mitigación.';
        else if (proyecto === 'p-and-g')
            desc = 'Proyecto de holografía acústica para Procter and Gamble: identificación y localización de fuentes de ruido mediante técnicas de holografía acústica, mediciones in situ y análisis de mapas de intensidad sonora para cumplimiento normativo y mejora del entorno laboral en operaciones industriales. Combinamos medición avanzada y visualización espacial del ruido para entregar diagnósticos y planes de mitigación.';
        else if (proyecto === 'pepsico')
            desc = 'Proyecto integral de control de ruido, clasificación de fuentes, modelación acústica y fotogrametría para PepsiCo: mediciones in situ, identificación de fuentes de ruido, mapas de ruido, modelación predictiva y levantamientos geoespaciales para cumplimiento normativo y mejora del entorno laboral. Combinamos control de ruido, clasificación de fuentes, modelación numérica y fotogrametría para entregar soluciones que reducen la exposición al ruido y optimizan la operación industrial.';
        else if (proyecto === 'spia')
            desc = 'Proyecto de medición y modelación de ruido subacuático para SPIA: mediciones in situ en entornos acuáticos, caracterización de fuentes de ruido subacuático, modelación predictiva y análisis de impacto para cumplimiento normativo y gestión ambiental. Combinamos medición de ruido subacuático y modelación numérica para entregar diagnósticos y planes de mitigación en ambientes marinos y fluviales.';
        else
            desc = 'Descripción detallada del proyecto. Aquí puede incluir objetivos, metodología, resultados y cualquier información relevante para el cliente.';
    }
    if (proyecto === 'refineria-cartagena') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Refinería de Cartagena';
    }
    if (proyecto === 'alma-magdalena') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Alma Magdalena';
    }
    if (proyecto === 'amva-usb') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'AMVA';
    }
    if (proyecto === 'arclad') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'ARCLAD';
    }
    if (proyecto === 'segovia') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Segovia';
    }
    if (proyecto === 'ccr-palagua') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'CCR Palagua';
    }
    if (proyecto === 'colcafe') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Colcafé';
    }
    if (proyecto === 'cerrejon') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Cerrejón';
    }
    if (proyecto === 'mineros-bic') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Mineros BIC';
    }
    if (proyecto === 'p-and-g') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'Procter and Gamble';
    }
    if (proyecto === 'pepsico') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'PepsiCo';
    }
    if (proyecto === 'spia') {
        ano = params.get('ano') || '2024';
        cliente = params.get('cliente') || 'SPIA';
    }

    document.getElementById('proyecto-titulo').textContent = decodeURIComponent(titulo.replace(/\+/g, ' '));
    document.getElementById('proyecto-categoria').textContent = categoria;
    document.getElementById('proyecto-ano').textContent = ano;
    document.getElementById('proyecto-cliente').textContent = decodeURIComponent((cliente || '').replace(/\+/g, ' '));
    document.getElementById('proyecto-descripcion').textContent = decodeURIComponent((desc || '').replace(/\+/g, ' '));

    var images = [];
    var base = '';
    if (proyecto === 'refineria-cartagena' && typeof REFINERIA_CARTAGENA_IMAGES !== 'undefined' && REFINERIA_CARTAGENA_IMAGES.length) {
        images = REFINERIA_CARTAGENA_IMAGES;
        base = '../../img_video/proyectos/refineria/';
    } else if (proyecto === 'alma-magdalena' && typeof ALMA_MAGDALENA_IMAGES !== 'undefined' && ALMA_MAGDALENA_IMAGES.length) {
        images = ALMA_MAGDALENA_IMAGES;
        base = '../../img_video/proyectos/industria/almaMagdalena/';
    } else if (proyecto === 'amva-usb' && typeof AMVA_USB_IMAGES !== 'undefined' && AMVA_USB_IMAGES.length) {
        images = AMVA_USB_IMAGES;
        base = '../../img_video/ciudades/iot/amva/';
    } else if (proyecto === 'arclad' && typeof ARCLAD_IMAGES !== 'undefined' && ARCLAD_IMAGES.length) {
        images = ARCLAD_IMAGES;
        base = '../../img_video/proyectos/arclad/';
    } else if (proyecto === 'segovia' && typeof SEGOVIA_IMAGES !== 'undefined' && SEGOVIA_IMAGES.length) {
        images = SEGOVIA_IMAGES;
        base = '../../img_video/proyectos/segovia/';
    } else if (proyecto === 'ccr-palagua' && typeof CCR_PALAGUA_IMAGES !== 'undefined' && CCR_PALAGUA_IMAGES.length) {
        images = CCR_PALAGUA_IMAGES;
        base = '../../img_video/proyectos/promigas/';
    } else if (proyecto === 'colcafe' && typeof COLCAFE_IMAGES !== 'undefined' && COLCAFE_IMAGES.length) {
        images = COLCAFE_IMAGES;
        base = '../../img_video/proyectos/colcafe/';
    } else if (proyecto === 'cerrejon' && typeof CERREJON_IMAGES !== 'undefined' && CERREJON_IMAGES.length) {
        images = CERREJON_IMAGES;
        base = '../../img_video/proyectos/industria/cerrejon/';
    } else if (proyecto === 'mineros-bic' && typeof MINEROS_BIC_IMAGES !== 'undefined' && MINEROS_BIC_IMAGES.length) {
        images = MINEROS_BIC_IMAGES;
        base = '../../img_video/proyectos/minerosbic/';
    } else if (proyecto === 'p-and-g' && typeof P_AND_G_IMAGES !== 'undefined' && P_AND_G_IMAGES.length) {
        images = P_AND_G_IMAGES;
        base = '../../img_video/proyectos/p&g/';
    } else if (proyecto === 'pepsico' && typeof PEPSICO_IMAGES !== 'undefined' && PEPSICO_IMAGES.length) {
        images = PEPSICO_IMAGES;
        base = '../../img_video/proyectos/pepsico/';
    } else if (proyecto === 'spia' && typeof SPIA_IMAGES !== 'undefined' && SPIA_IMAGES.length) {
        images = SPIA_IMAGES;
        base = '../../img_video/proyectos/spia/';
    }
    if (images.length && base) {
        var single = document.getElementById('proyecto-media-single');
        var carouselWrap = document.getElementById('proyecto-media-carousel');
        var track = document.getElementById('proyecto-carousel-track');
        single.style.display = 'none';
        carouselWrap.style.display = 'flex';
        images.forEach(function(name) {
            var slide = document.createElement('div');
            slide.className = 'proyecto-detalle-carousel-slide';
            slide.style.backgroundImage = "url('" + base + encodeURIComponent(name) + "')";
            track.appendChild(slide);
        });
        var slides = track.querySelectorAll('.proyecto-detalle-carousel-slide');
        var n = slides.length;
        track.style.width = (n * 100) + '%';
        slides.forEach(function(s) { s.style.flex = '0 0 ' + (100 / n) + '%'; });
        var idx = 0;
        function updateCarousel() {
            track.style.transform = 'translateX(-' + (idx * (100 / n)) + '%)';
        }
        document.querySelector('.proyecto-detalle-carousel-prev').addEventListener('click', function() {
            idx = idx <= 0 ? n - 1 : idx - 1;
            updateCarousel();
        });
        document.querySelector('.proyecto-detalle-carousel-next').addEventListener('click', function() {
            idx = idx >= n - 1 ? 0 : idx + 1;
            updateCarousel();
        });
    }
})();
