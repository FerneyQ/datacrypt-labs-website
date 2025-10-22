/**
 * 🎨 DataCrypt Labs - Enhanced Theme System v2.1
 * Filosofía Mejora Continua - Sistema migrado con ConfigManager
 * 
 * Sistema de temas mejorado con:
 * - Integración con ConfigManager
 * - Backward compatibility total
 * - Tests integrados
 * - Performance optimizada
 */

class EnhancedThemeSystem {
    constructor() {
        this.currentTheme = 'dark-matrix';
        this.isInitialized = false;
        this.configManager = null;
        this.originalAPI = null; // Para mantener compatibilidad
        
        // Esperar a ConfigManager y migrar
        this.init();
    }

    async init() {
        try {
            // Esperar a que ConfigManager esté disponible
            await this.waitForConfigManager();
            
            // Configurar referencias
            this.configManager = window.ConfigManager;
            
            // Migrar temas existentes si existen
            await this.migrateExistingThemes();
            
            // Mantener compatibilidad con API anterior
            this.setupBackwardCompatibility();
            
            // Configurar el tema inicial
            this.setupInitialTheme();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            
            
            // Notificar que el sistema está listo
            this.dispatchThemeSystemReady();
            
        } catch (error) {
            
            // Fallback al sistema original si falla
            this.fallbackToOriginal();
        }
    }

    async waitForConfigManager() {
        const maxAttempts = 100;
        let attempts = 0;
        
        while (!window.ConfigManager && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        
        if (!window.ConfigManager) {
            throw new Error('ConfigManager not available after timeout');
        }
    }

    async migrateExistingThemes() {
        // Verificar si ya existen temas en el sistema anterior
        if (window.themeSystem && window.themeSystem.themes) {
            
            
            // Mantener referencia al sistema original
            this.originalAPI = window.themeSystem;
            
            // Los temas ya están en ConfigManager, verificar consistencia
            const configThemes = this.configManager.getConfig('themes');
            const originalThemes = window.themeSystem.themes;
            
            // Sincronizar si hay diferencias
            this.synchronizeThemes(configThemes, originalThemes);
        }
    }

    synchronizeThemes(configThemes, originalThemes) {
        // Verificar que todos los temas originales estén en ConfigManager
        for (const [key, theme] of Object.entries(originalThemes)) {
            const configKey = this.convertThemeKey(key);
            if (!configThemes.themes[configKey]) {
                
                // Agregar tema faltante (esto sería raro, pero por seguridad)
                configThemes.themes[configKey] = this.convertThemeFormat(theme);
            }
        }
    }

    convertThemeKey(originalKey) {
        // Convertir claves del formato original al nuevo
        const keyMap = {
            'dark': 'dark-matrix',
            'light': 'light-code',
            'cyberpunk': 'cyberpunk-2077',
            'forest': 'forest-code',
            'sunset': 'sunset-vibes',
            'ocean': 'deep-ocean'
        };
        return keyMap[originalKey] || originalKey;
    }

    convertThemeFormat(originalTheme) {
        // Convertir formato de tema del sistema original al ConfigManager
        return {
            id: this.convertThemeKey(originalTheme.name?.toLowerCase().replace(/\s+/g, '-')),
            name: originalTheme.name,
            icon: originalTheme.icon,
            colors: {
                primary: originalTheme.primary,
                secondary: originalTheme.secondary,
                accent: originalTheme.accent,
                accentGlow: originalTheme.accentGlow,
                text: originalTheme.text,
                textSecondary: originalTheme.textSecondary,
                background: originalTheme.primary,
                surface: originalTheme.secondary,
                border: originalTheme.border,
                shadow: originalTheme.shadow
            },
            gradients: {
                primary: originalTheme.gradient,
                card: originalTheme.cardBackground
            },
            effects: {
                glow: originalTheme.glowEffect,
                particle: originalTheme.particleColor
            }
        };
    }

    setupBackwardCompatibility() {
        // Mantener la API original para evitar breaking changes
        if (!window.themeSystem) {
            window.themeSystem = {};
        }

        // Mapear métodos antiguos a la nueva implementación
        window.themeSystem.getCurrentTheme = () => this.getCurrentTheme();
        window.themeSystem.setTheme = (themeId) => this.setTheme(themeId);
        window.themeSystem.getThemes = () => this.getThemes();
        window.themeSystem.applyTheme = (themeData) => this.applyTheme(themeData);
        
        // Mantener la propiedad themes para compatibilidad
        Object.defineProperty(window.themeSystem, 'themes', {
            get: () => this.getLegacyThemes()
        });

        
    }

    getLegacyThemes() {
        // Convertir temas de ConfigManager al formato original
        const configThemes = this.configManager.getConfig('themes');
        const legacyThemes = {};

        for (const [key, theme] of Object.entries(configThemes.themes)) {
            legacyThemes[key.replace('-', '')] = {
                name: theme.name,
                icon: theme.icon,
                primary: theme.colors.primary,
                secondary: theme.colors.secondary,
                accent: theme.colors.accent,
                accentGlow: theme.colors.accentGlow,
                text: theme.colors.text,
                textSecondary: theme.colors.textSecondary,
                gradient: theme.gradients.primary,
                cardBackground: theme.gradients.card,
                border: theme.colors.border,
                shadow: theme.colors.shadow,
                particleColor: theme.effects.particle,
                glowEffect: theme.effects.glow
            };
        }

        return legacyThemes;
    }

    setupInitialTheme() {
        // Obtener tema guardado o usar por defecto
        const savedTheme = this.configManager.getConfig('themes').currentTheme;
        const initialTheme = savedTheme || 'dark-matrix';
        
        this.setTheme(initialTheme);
    }

    setupEventListeners() {
        // Escuchar cambios en ConfigManager
        this.configManager.onChange('themes', (newConfig) => {
            this.handleThemeConfigChange(newConfig);
        });

        // Detectar cambios de tema del sistema
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.handleSystemThemeChange(e);
            });
        }
    }

    // API Principal - Métodos mejorados
    getCurrentTheme() {
        const config = this.configManager.getConfig('themes');
        const currentThemeId = config.currentTheme;
        return config.themes[currentThemeId] || config.themes['dark-matrix'];
    }

    setTheme(themeId) {
        const config = this.configManager.getConfig('themes');
        
        if (!config.themes[themeId]) {
            
            themeId = 'dark-matrix';
        }

        // Actualizar configuración
        this.configManager.updateConfig('themes', {
            currentTheme: themeId
        });

        // Aplicar tema
        const themeData = config.themes[themeId];
        this.applyTheme(themeData);
        
        // Guardar preferencia
        this.saveThemePreference(themeId);
        
        // Notificar cambio
        this.dispatchThemeChange(themeData);

        
        return themeData;
    }

    getThemes() {
        const config = this.configManager.getConfig('themes');
        return Object.values(config.themes);
    }

    applyTheme(themeData) {
        if (!themeData || !themeData.colors) {
            
            return;
        }

        const root = document.documentElement;
        
        // Aplicar variables CSS principales
        root.style.setProperty('--primary-color', themeData.colors.primary);
        root.style.setProperty('--secondary-color', themeData.colors.secondary);
        root.style.setProperty('--accent-color', themeData.colors.accent);
        root.style.setProperty('--text-color', themeData.colors.text);
        root.style.setProperty('--text-secondary-color', themeData.colors.textSecondary);
        root.style.setProperty('--background-color', themeData.colors.background);
        root.style.setProperty('--surface-color', themeData.colors.surface);
        root.style.setProperty('--border-color', themeData.colors.border);
        
        // Aplicar gradientes
        if (themeData.gradients) {
            root.style.setProperty('--gradient-primary', themeData.gradients.primary);
            root.style.setProperty('--gradient-card', themeData.gradients.card);
        }
        
        // Aplicar efectos
        if (themeData.effects) {
            root.style.setProperty('--glow-effect', themeData.effects.glow);
            root.style.setProperty('--particle-color', themeData.effects.particle);
        }

        // Actualizar tema actual
        this.currentTheme = themeData.id;
        
        // Aplicar clase al body para CSS específico
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeData.id}`);

        // Actualizar selector de temas si existe
        this.updateThemeSelector(themeData);
    }

    updateThemeSelector(themeData) {
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            const buttons = themeSelector.querySelectorAll('.theme-option');
            buttons.forEach(button => {
                button.classList.toggle('active', button.dataset.theme === themeData.id);
            });
        }
    }

    // Métodos de evento
    dispatchThemeChange(themeData) {
        const event = new CustomEvent('themeChanged', {
            detail: { themeData, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    dispatchThemeSystemReady() {
        const event = new CustomEvent('themeSystemReady', {
            detail: { system: this, version: '2.1' }
        });
        window.dispatchEvent(event);
    }

    handleThemeConfigChange(newConfig) {
        if (newConfig.currentTheme !== this.currentTheme) {
            const themeData = newConfig.themes[newConfig.currentTheme];
            this.applyTheme(themeData);
        }
    }

    handleSystemThemeChange(e) {
        const config = this.configManager.getConfig('themes');
        if (config.autoDetect) {
            const preferredTheme = e.matches ? 'dark-matrix' : 'light-code';
            this.setTheme(preferredTheme);
        }
    }

    // Persistencia
    saveThemePreference(themeId) {
        try {
            localStorage.setItem('datacrypt-theme-preference', themeId);
        } catch (error) {
            
        }
    }

    getThemePreference() {
        try {
            return localStorage.getItem('datacrypt-theme-preference');
        } catch (error) {
            return null;
        }
    }

    // Métodos utilitarios
    isReady() {
        return this.isInitialized && this.configManager;
    }

    fallbackToOriginal() {
        
        // Si hay un sistema original, mantenerlo
        if (this.originalAPI) {
            window.themeSystem = this.originalAPI;
        }
    }

    // Testing integration
    runTests() {
        if (!window.TestRunner) {
            
            return;
        }

        const tests = window.TestRunner.createSuite('EnhancedThemeSystem');
        
        tests.describe('Enhanced Theme System v2.1', () => {
            tests.it('should initialize with ConfigManager', () => {
                tests.expect(this.isInitialized).toBe(true);
                tests.expect(this.configManager).toBeTruthy();
            });
            
            tests.it('should maintain backward compatibility', () => {
                tests.expect(window.themeSystem.getCurrentTheme).toBeTruthy();
                tests.expect(window.themeSystem.setTheme).toBeTruthy();
                tests.expect(window.themeSystem.themes).toBeTruthy();
            });
            
            tests.it('should change themes correctly', () => {
                const initialTheme = this.getCurrentTheme().id;
                const testTheme = initialTheme === 'dark-matrix' ? 'light-code' : 'dark-matrix';
                
                this.setTheme(testTheme);
                tests.expect(this.getCurrentTheme().id).toBe(testTheme);
                
                // Restore original
                this.setTheme(initialTheme);
            });
            
            tests.it('should apply theme variables to CSS', () => {
                const root = document.documentElement;
                const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
                tests.expect(primaryColor).toBeTruthy();
            });
        });
        
        return tests.run();
    }
}

// Inicialización inteligente
if (typeof window !== 'undefined') {
    window.EnhancedThemeSystem = EnhancedThemeSystem;
    
    // Solo inicializar si no hay un sistema existente funcionando
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.enhancedThemeSystem) {
            window.enhancedThemeSystem = new EnhancedThemeSystem();
        }
    });
}

export default EnhancedThemeSystem;
