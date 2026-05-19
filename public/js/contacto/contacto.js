/**
 * Formulario de contacto — Envío vía Web3Forms (https://web3forms.com)
 *
 * Web3Forms recibe el POST, valida con la access_key y reenvía el mensaje
 * al correo configurado al crear esa key (info@geotrends.co).
 *
 * Importante para producción:
 * - La access_key se pega abajo en WEB3FORMS_ACCESS_KEY.
 * - Es seguro exponerla en frontend: Web3Forms solo entrega correos al destino
 *   asociado a la key, no a destinos arbitrarios.
 * - Cómo obtenerla: https://web3forms.com → "Create your Access Key" → usar
 *   info@geotrends.co → copiar la key y reemplazar el placeholder de abajo.
 */

(function () {
    'use strict';

    // Access key de Web3Forms asociada a info@geotrends.co.
    // Para rotarla: https://web3forms.com → genera una nueva y reemplaza aquí.
    const WEB3FORMS_ACCESS_KEY = '50a593c2-5c32-4aa0-aa9f-6a0a7a8ad126';

    const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

    const form = document.querySelector('.contacto-form');
    if (!form) return;

    const submitBtn = form.querySelector('.contacto-submit');
    const mensajeBox = form.querySelector('.contacto-form-mensaje');

    /** Idioma detectado por el atributo lang del <html>; ES por defecto. */
    const lang = (document.documentElement.getAttribute('lang') || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

    const i18n = {
        es: {
            sending: 'Enviando…',
            send: 'Enviar mensaje',
            success: '¡Mensaje enviado! Te responderemos lo antes posible.',
            errorGeneric: 'No pudimos enviar el mensaje. Por favor intenta de nuevo o escríbenos a info@geotrends.co.',
            errorNetwork: 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.',
            errorMissingKey: 'El formulario aún no está configurado. Contacta al administrador.',
            invalidEmail: 'Por favor ingresa un correo electrónico válido.',
            requiredFields: 'Por favor completa los campos obligatorios.',
        },
        en: {
            sending: 'Sending…',
            send: 'Send message',
            success: 'Message sent! We will get back to you as soon as possible.',
            errorGeneric: 'We could not send your message. Please try again or email us at info@geotrends.co.',
            errorNetwork: 'No connection to the server. Check your internet and try again.',
            errorMissingKey: 'The form is not configured yet. Please contact the administrator.',
            invalidEmail: 'Please enter a valid email address.',
            requiredFields: 'Please fill in the required fields.',
        },
    };

    const t = i18n[lang];

    function showMessage(type, text) {
        if (!mensajeBox) {
            alert(text);
            return;
        }
        mensajeBox.textContent = text;
        mensajeBox.classList.remove('contacto-form-mensaje-success', 'contacto-form-mensaje-error');
        mensajeBox.classList.add(type === 'success' ? 'contacto-form-mensaje-success' : 'contacto-form-mensaje-error');
        mensajeBox.hidden = false;
        mensajeBox.setAttribute('role', type === 'success' ? 'status' : 'alert');
        mensajeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideMessage() {
        if (!mensajeBox) return;
        mensajeBox.hidden = true;
        mensajeBox.textContent = '';
        mensajeBox.classList.remove('contacto-form-mensaje-success', 'contacto-form-mensaje-error');
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? t.sending : t.send;
        submitBtn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    }

    /** RFC 5322 simplificado: suficiente para evitar typos comunes sin falsos negativos. */
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideMessage();

        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'TU_ACCESS_KEY_DE_WEB3FORMS') {
            console.error('[contacto] Falta configurar WEB3FORMS_ACCESS_KEY en contacto.js');
            showMessage('error', t.errorMissingKey);
            return;
        }

        const nombre = (form.elements['nombre']?.value || '').trim();
        const email = (form.elements['email']?.value || '').trim();
        const mensaje = (form.elements['mensaje']?.value || '').trim();

        if (!nombre || !email) {
            showMessage('error', t.requiredFields);
            return;
        }
        if (!isValidEmail(email)) {
            showMessage('error', t.invalidEmail);
            return;
        }

        // Honeypot (botcheck): si trae valor → es un bot, abortamos sin avisar.
        if ((form.elements['botcheck']?.value || '').trim() !== '') {
            return;
        }

        const formData = new FormData(form);
        formData.set('access_key', WEB3FORMS_ACCESS_KEY);
        formData.set('subject', lang === 'en'
            ? `New contact form message — ${nombre}`
            : `Nuevo mensaje del formulario de contacto — ${nombre}`);
        formData.set('from_name', 'GeoPlataforma · Web');
        formData.set('replyto', email);
        // Mensaje vacío opcional → ponemos placeholder para que no quede en blanco
        if (!mensaje) {
            formData.set('mensaje', lang === 'en'
                ? '(No message provided)'
                : '(El usuario no escribió mensaje)');
        }

        setLoading(true);
        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json().catch(() => ({}));

            if (response.ok && data && data.success) {
                showMessage('success', t.success);
                form.reset();
            } else {
                console.error('[contacto] Web3Forms error:', data);
                showMessage('error', (data && data.message) ? data.message : t.errorGeneric);
            }
        } catch (err) {
            console.error('[contacto] Network error:', err);
            showMessage('error', t.errorNetwork);
        } finally {
            setLoading(false);
        }
    });
})();
