/**
 * Lógica del formulario de contacto
 * Envía los datos del formulario al correo info@geotrends.co
 */

(function() {
    'use strict';

    // Configuración - Reemplaza estos valores con tus credenciales de EmailJS
    const EMAILJS_SERVICE_ID = 'tu_service_id'; // Reemplazar con tu Service ID de EmailJS
    const EMAILJS_TEMPLATE_ID = 'tu_template_id'; // Reemplazar con tu Template ID de EmailJS
    const EMAILJS_PUBLIC_KEY = 'tu_public_key'; // Reemplazar con tu Public Key de EmailJS
    const EMAIL_DESTINO = 'info@geotrends.co';

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        const formulario = document.querySelector('.contacto-form');
        
        if (!formulario) {
            console.warn('Formulario de contacto no encontrado');
            return;
        }

        formulario.addEventListener('submit', manejarEnvioFormulario);
    });

    /**
     * Maneja el envío del formulario
     */
    async function manejarEnvioFormulario(e) {
        e.preventDefault();

        const formulario = e.target;
        const botonEnviar = formulario.querySelector('.contacto-submit');
        const estadoOriginal = botonEnviar.innerHTML;

        // Obtener valores del formulario
        const datosFormulario = {
            nombre: document.getElementById('contacto-nombre').value.trim(),
            email: document.getElementById('contacto-email').value.trim(),
            telefono: document.getElementById('contacto-telefono').value.trim(),
            mensaje: document.getElementById('contacto-mensaje').value.trim()
        };

        // Validar campos requeridos
        if (!datosFormulario.nombre || !datosFormulario.email || !datosFormulario.mensaje) {
            mostrarMensaje('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        // Validar formato de email
        if (!validarEmail(datosFormulario.email)) {
            mostrarMensaje('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        // Deshabilitar botón y mostrar estado de carga
        botonEnviar.disabled = true;
        botonEnviar.innerHTML = 'Enviando...';

        try {
            // Enviar correo usando EmailJS
            await enviarCorreo(datosFormulario);
            
            // Mostrar mensaje de éxito
            mostrarMensaje('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            
            // Limpiar formulario
            formulario.reset();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            mostrarMensaje('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente.', 'error');
        } finally {
            // Restaurar botón
            botonEnviar.disabled = false;
            botonEnviar.innerHTML = estadoOriginal;
        }
    }

    /**
     * Envía el correo usando EmailJS
     */
    async function enviarCorreo(datos) {
        // Verificar si EmailJS está cargado
        if (typeof emailjs === 'undefined') {
            // Cargar EmailJS dinámicamente si no está disponible
            await cargarEmailJS();
        }

        // Preparar parámetros del template
        const parametrosTemplate = {
            to_email: EMAIL_DESTINO,
            from_name: datos.nombre,
            from_email: datos.email,
            phone: datos.telefono || 'No proporcionado',
            message: datos.mensaje,
            reply_to: datos.email
        };

        // Enviar correo
        return emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            parametrosTemplate,
            EMAILJS_PUBLIC_KEY
        );
    }

    /**
     * Carga EmailJS dinámicamente
     */
    function cargarEmailJS() {
        return new Promise((resolve, reject) => {
            if (typeof emailjs !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => {
                emailjs.init(EMAILJS_PUBLIC_KEY);
                resolve();
            };
            script.onerror = () => reject(new Error('Error al cargar EmailJS'));
            document.head.appendChild(script);
        });
    }

    /**
     * Valida el formato de email
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Muestra un mensaje al usuario
     */
    function mostrarMensaje(mensaje, tipo) {
        // Remover mensaje anterior si existe
        const mensajeAnterior = document.querySelector('.contacto-form-mensaje');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        // Crear nuevo mensaje
        const mensajeElemento = document.createElement('div');
        mensajeElemento.className = `contacto-form-mensaje contacto-form-mensaje-${tipo}`;
        mensajeElemento.textContent = mensaje;
        mensajeElemento.setAttribute('role', 'alert');
        mensajeElemento.setAttribute('aria-live', 'polite');

        // Insertar mensaje antes del botón de envío
        const formulario = document.querySelector('.contacto-form');
        const botonEnviar = formulario.querySelector('.contacto-submit');
        formulario.insertBefore(mensajeElemento, botonEnviar);

        // Auto-remover después de 5 segundos para mensajes de éxito
        if (tipo === 'success') {
            setTimeout(() => {
                mensajeElemento.remove();
            }, 5000);
        }
    }

})();
