/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1
 * CONFIGURACIÓN CENTRALIZADA - CONSTANTES
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ TODAS las constantes externalizadas (no hardcodeadas)
 */

// 🎯 INFORMACIÓN DEL PROYECTO
export const PROJECT = {
    NAME: "Web Portfolio - DataCrypt Labs",
    VERSION: "1.0.0",
    AUTHOR: "Tu Nombre",
    DESCRIPTION: "Portafolio personal profesional con chat bot integrado",
    BUILD_DATE: new Date().toISOString()
};

// 🌐 CONFIGURACIÓN DE NAVEGACIÓN
export const NAVIGATION = {
    SECTIONS: [
        { id: 'home', label: 'Inicio', href: '#home' },
        { id: 'about', label: 'Sobre Mí', href: '#about' },
        { id: 'portfolio', label: 'Portafolio', href: '#portfolio' },
        { id: 'skills', label: 'Habilidades', href: '#skills' },
        { id: 'contact', label: 'Contacto', href: '#contact' }
    ],
    ANIMATION_DURATION: 800,
    SCROLL_OFFSET: 80
};

// 🎨 CONFIGURACIÓN VISUAL
export const THEME = {
    COLORS: {
        PRIMARY: '#007bff',
        SECONDARY: '#6c757d', 
        SUCCESS: '#28a745',
        WARNING: '#ffc107',
        DANGER: '#dc3545',
        DARK: '#343a40',
        LIGHT: '#f8f9fa'
    },
    BREAKPOINTS: {
        XS: 0,
        SM: 576,
        MD: 768,
        LG: 992,
        XL: 1200,
        XXL: 1400
    },
    ANIMATION: {
        FADE_IN_DURATION: 600,
        SLIDE_DURATION: 400,
        HOVER_TRANSITION: 200
    }
};

// 🤖 CONFIGURACIÓN DEL CHAT BOT
export const CHATBOT = {
    NAME: "DataCrypt Assistant",
    AVATAR: "/assets/images/bot-avatar.png",
    WELCOME_MESSAGE: "¡Hola! Soy el asistente de este portafolio. ¿En qué puedo ayudarte?",
    TYPING_DELAY: 1500,
    MAX_MESSAGE_LENGTH: 500,
    RESPONSES: {
        DEFAULT: "Disculpa, no entendí tu pregunta. ¿Podrías reformularla?",
        GREETING: ["¡Hola!", "¡Hola! ¿Cómo estás?", "¡Saludos! ¿En qué puedo ayudarte?"],
        PORTFOLIO: "En la sección Portafolio puedes ver mis proyectos destacados con tecnologías modernas.",
        SKILLS: "Mis habilidades incluyen desarrollo web, bases de datos, y automatización de procesos.",
        CONTACT: "Puedes contactarme a través del formulario o mis redes sociales en la sección Contacto."
    }
};

// 📱 CONFIGURACIÓN RESPONSIVE
export const RESPONSIVE = {
    MOBILE_MAX: 768,
    TABLET_MAX: 1024,
    DESKTOP_MIN: 1025
};

// ⚡ CONFIGURACIÓN DE RENDIMIENTO
export const PERFORMANCE = {
    IMAGE_LAZY_LOADING: true,
    ANIMATION_REDUCED_MOTION: true,
    PRELOAD_CRITICAL_RESOURCES: true,
    CACHE_DURATION: 3600000, // 1 hora en ms
    API_TIMEOUT: 10000 // 10 segundos
};

// 🔧 CONFIGURACIÓN DE DESARROLLO
export const DEV_CONFIG = {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    CONSOLE_LOGS: process.env.NODE_ENV !== 'production',
    ERROR_REPORTING: true,
    ANALYTICS_ENABLED: process.env.NODE_ENV === 'production'
};

// 📊 MÉTRICAS Y ANALYTICS
export const ANALYTICS = {
    GA_TRACKING_ID: 'UA-XXXXXXXXX-X', // Configurar con tu ID real
    EVENTS: {
        PORTFOLIO_VIEW: 'portfolio_project_view',
        CONTACT_FORM_SUBMIT: 'contact_form_submit',
        CHATBOT_MESSAGE: 'chatbot_message_sent',
        SECTION_NAVIGATION: 'section_navigation'
    }
};

// 🛡️ CONFIGURACIÓN DE SEGURIDAD  
export const SECURITY = {
    CSRF_PROTECTION: true,
    FORM_VALIDATION: true,
    SANITIZE_INPUT: true,
    RATE_LIMITING: {
        CONTACT_FORM: 5, // máximo 5 envíos por hora
        CHATBOT: 30 // máximo 30 mensajes por hora
    }
};