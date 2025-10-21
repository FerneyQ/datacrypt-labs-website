/**
 * 🎨 DataCrypt Labs - Advanced Theme System
 * Sistema de Temas Personalizable con múltiples esquemas de color
 * y persistencia local para experiencia premium del usuario
 */

class ThemeSystem {
    constructor() {
        this.themes = {
            dark: {
                name: 'Dark Matrix',
                icon: '🌙',
                primary: '#0a0f1c',
                secondary: '#1a2332',
                accent: '#00d4ff',
                accentGlow: '#00d4ff',
                text: '#ffffff',
                textSecondary: '#b0b0b0',
                gradient: 'linear-gradient(135deg, #0a0f1c 0%, #1a2332 100%)',
                cardBackground: 'rgba(26, 35, 50, 0.8)',
                border: 'rgba(0, 212, 255, 0.3)',
                shadow: 'rgba(0, 212, 255, 0.2)',
                particleColor: '#00d4ff',
                glowEffect: '0 0 20px rgba(0, 212, 255, 0.3)'
            },
            light: {
                name: 'Light Code',
                icon: '☀️',
                primary: '#ffffff',
                secondary: '#f8f9fa',
                accent: '#007bff',
                accentGlow: '#007bff',
                text: '#212529',
                textSecondary: '#6c757d',
                gradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                cardBackground: 'rgba(255, 255, 255, 0.9)',
                border: 'rgba(0, 123, 255, 0.3)',
                shadow: 'rgba(0, 123, 255, 0.1)',
                particleColor: '#007bff',
                glowEffect: '0 0 20px rgba(0, 123, 255, 0.2)'
            },
            cyberpunk: {
                name: 'Cyberpunk 2077',
                icon: '🔥',
                primary: '#0f0f23',
                secondary: '#1a1a3a',
                accent: '#ff0080',
                accentGlow: '#ff0080',
                text: '#00ffff',
                textSecondary: '#ff6b9d',
                gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2a0a3a 100%)',
                cardBackground: 'rgba(26, 26, 58, 0.8)',
                border: 'rgba(255, 0, 128, 0.4)',
                shadow: 'rgba(255, 0, 128, 0.3)',
                particleColor: '#ff0080',
                glowEffect: '0 0 25px rgba(255, 0, 128, 0.4)'
            },
            forest: {
                name: 'Forest Code',
                icon: '🌲',
                primary: '#0d1b0f',
                secondary: '#1a2f1e',
                accent: '#00ff7f',
                accentGlow: '#00ff7f',
                text: '#e8f5e8',
                textSecondary: '#90ee90',
                gradient: 'linear-gradient(135deg, #0d1b0f 0%, #1a2f1e 100%)',
                cardBackground: 'rgba(26, 47, 30, 0.8)',
                border: 'rgba(0, 255, 127, 0.3)',
                shadow: 'rgba(0, 255, 127, 0.2)',
                particleColor: '#00ff7f',
                glowEffect: '0 0 20px rgba(0, 255, 127, 0.3)'
            },
            sunset: {
                name: 'Sunset Vibes',
                icon: '🌅',
                primary: '#1a0f2e',
                secondary: '#2d1b3d',
                accent: '#ff6b35',
                accentGlow: '#ff6b35',
                text: '#fff5e6',
                textSecondary: '#ffb07a',
                gradient: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b3d 50%, #3d2a1f 100%)',
                cardBackground: 'rgba(45, 27, 61, 0.8)',
                border: 'rgba(255, 107, 53, 0.3)',
                shadow: 'rgba(255, 107, 53, 0.2)',
                particleColor: '#ff6b35',
                glowEffect: '0 0 20px rgba(255, 107, 53, 0.3)'
            },
            ocean: {
                name: 'Deep Ocean',
                icon: '🌊',
                primary: '#001122',
                secondary: '#003344',
                accent: '#40e0d0',
                accentGlow: '#40e0d0',
                text: '#e6ffff',
                textSecondary: '#87ceeb',
                gradient: 'linear-gradient(135deg, #001122 0%, #003344 100%)',
                cardBackground: 'rgba(0, 51, 68, 0.8)',
                border: 'rgba(64, 224, 208, 0.3)',
                shadow: 'rgba(64, 224, 208, 0.2)',
                particleColor: '#40e0d0',
                glowEffect: '0 0 20px rgba(64, 224, 208, 0.3)'
            }
        };

        this.currentTheme = 'dark';
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.loadSavedTheme();
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        
        console.log('🎨 Theme System initialized with theme:', this.currentTheme);
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('datacrypt-theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    createThemeSelector() {
        // Crear el selector de temas en la navegación
        const nav = document.querySelector('.nav-menu');
        if (!nav) return;

        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <div class="theme-toggle" data-translate="themes">
                <span class="theme-icon">🎨</span>
                <span class="theme-text" data-translate="themes">Temas</span>
                <span class="theme-arrow">▼</span>
            </div>
            <div class="theme-dropdown">
                ${Object.entries(this.themes).map(([key, theme]) => `
                    <div class="theme-option" data-theme="${key}" title="${theme.name}">
                        <span class="theme-option-icon">${theme.icon}</span>
                        <span class="theme-option-name">${theme.name}</span>
                        <div class="theme-preview" style="background: ${theme.accent}"></div>
                    </div>
                `).join('')}
            </div>
        `;

        nav.appendChild(themeSelector);
    }

    setupEventListeners() {
        // Toggle del dropdown de temas
        document.addEventListener('click', (e) => {
            const themeToggle = e.target.closest('.theme-toggle');
            const themeSelector = document.querySelector('.theme-selector');
            
            if (themeToggle) {
                themeSelector.classList.toggle('active');
                return;
            }
            
            // Cerrar dropdown si se hace click fuera
            if (!e.target.closest('.theme-selector')) {
                themeSelector?.classList.remove('active');
            }
        });

        // Selección de tema
        document.addEventListener('click', (e) => {
            const themeOption = e.target.closest('.theme-option');
            if (themeOption) {
                const theme = themeOption.dataset.theme;
                this.changeTheme(theme);
                document.querySelector('.theme-selector')?.classList.remove('active');
            }
        });

        // Atajo de teclado para cambiar tema (Ctrl+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.cycleThemes();
            }
        });
    }

    changeTheme(theme) {
        if (!this.themes[theme]) return;
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        
        // Actualizar indicador visual
        this.updateThemeIndicator();
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme, themeData: this.themes[theme] }
        }));
        
        console.log('🎨 Theme changed to:', theme);
    }

    applyTheme(theme) {
        const themeData = this.themes[theme];
        if (!themeData) return;

        const root = document.documentElement;
        
        // Aplicar variables CSS custom
        Object.entries(themeData).forEach(([key, value]) => {
            if (key !== 'name' && key !== 'icon') {
                root.style.setProperty(`--theme-${this.camelToKebab(key)}`, value);
            }
        });

        // Aplicar clase de tema al body para estilos específicos
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);

        // Actualizar meta theme-color para PWA
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = themeData.primary;

        // Actualizar partículas del juego si existe
        if (window.dataWizardGame) {
            window.dataWizardGame.updateTheme(themeData);
        }

        // Actualizar efectos visuales existentes
        this.updateVisualEffects(themeData);
    }

    updateVisualEffects(themeData) {
        // Actualizar efectos de glow en botones
        const buttons = document.querySelectorAll('.btn-primary, .cta-button');
        buttons.forEach(btn => {
            btn.style.boxShadow = themeData.glowEffect;
        });

        // Actualizar bordes de cards
        const cards = document.querySelectorAll('.service-card, .cert-card, .project-card');
        cards.forEach(card => {
            card.style.borderColor = themeData.border.replace('rgba(', '').replace(')', '').split(',').slice(0,3).join(',') + ', 0.3)';
        });
    }

    updateThemeIndicator() {
        const currentThemeData = this.themes[this.currentTheme];
        const themeIcon = document.querySelector('.theme-icon');
        const themeText = document.querySelector('.theme-text');
        
        if (themeIcon) themeIcon.textContent = currentThemeData.icon;
        
        // Marcar opción activa
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    cycleThemes() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.changeTheme(themes[nextIndex]);
    }

    saveTheme(theme) {
        localStorage.setItem('datacrypt-theme', theme);
    }

    getCurrentTheme() {
        return {
            name: this.currentTheme,
            data: this.themes[this.currentTheme]
        };
    }

    // Utilidad para convertir camelCase a kebab-case
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    // API pública para extensiones
    addCustomTheme(name, themeData) {
        this.themes[name] = themeData;
        // Recrear selector si ya existe
        if (this.isInitialized) {
            const existing = document.querySelector('.theme-selector');
            if (existing) {
                existing.remove();
                this.createThemeSelector();
            }
        }
    }

    removeTheme(name) {
        if (name === 'dark') return; // No permitir eliminar tema por defecto
        delete this.themes[name];
        if (this.currentTheme === name) {
            this.changeTheme('dark');
        }
    }
}

// Exportar para uso global
window.ThemeSystem = ThemeSystem;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeSystem = new ThemeSystem();
    });
} else {
    window.themeSystem = new ThemeSystem();
}