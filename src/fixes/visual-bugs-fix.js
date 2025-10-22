/**
 * 🔧 DATACRYPT LABS - FIX BUGS VISUALES
 * Script para corregir transforms problemáticos en iconos sociales
 * Eliminación inmediata de translateY(100px) no deseados
 */

(function () {
    'use strict';

    /**
     * Limpiar transforms problemáticos
     */
    function fixSocialIconTransforms() {
        // Seleccionar todos los elementos que podrían tener el problema
        const selectors = [
            '.social-icons i.fab',
            '.social-links i.fab',
            '.contact-info-item i.fab',
            'i.fab[style*="translateY(100px)"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.style.transform && element.style.transform.includes('translateY(100px)')) {
                    element.style.transform = '';
                }
            });
        });
    }

    /**
     * Prevenir futuros problemas
     */
    function preventFutureIssues() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;

                    // Si es un icono social y tiene el transform problemático
                    if (target.classList.contains('fab') &&
                        target.style.transform &&
                        target.style.transform.includes('translateY(100px)')) {

                        // Verificar si está en contexto social
                        const socialContext = target.closest('.social-icons, .social-links, .contact-info');

                        if (socialContext) {
                            target.style.transform = '';
                        }
                    }
                }
            });
        });

        // Observar cambios en todo el documento
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            childList: true,
            subtree: true
        });


    }

    /**
     * Ejecutar correcciones
     */
    function runFixes() {
        fixSocialIconTransforms();
        preventFutureIssues();

        // Verificar cada 2 segundos durante los primeros 10 segundos
        let checks = 0;
        const maxChecks = 5;

        const intervalId = setInterval(() => {
            checks++;
            fixSocialIconTransforms();

            if (checks >= maxChecks) {
                clearInterval(intervalId);
            }
        }, 2000);
    }

    // Ejecutar inmediatamente si el DOM ya está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFixes);
    } else {
        runFixes();
    }

    // También ejecutar después de que se cargue completamente la página
    window.addEventListener('load', () => {
        setTimeout(fixSocialIconTransforms, 500);
    });


})();
