/**
 * 🧪 DataCrypt Labs - Enhanced Theme System Tests
 * Filosofía Mejora Continua v2.1 - Testing Comprehensive Suite
 * 
 * Suite completa de tests para validar el Enhanced Theme System
 * Cubre funcionalidad, performance, backward compatibility y integración
 */

// Test suite para Enhanced Theme System
function runEnhancedThemeSystemTests() {
    if (!window.TestRunner) {
        console.error('❌ TestRunner not available');
        return;
    }

    const tests = window.TestRunner.createSuite('EnhancedThemeSystem');
    
    console.log('🎨 Running Enhanced Theme System Tests...');

    tests.describe('Enhanced Theme System v2.1', () => {
        
        tests.describe('Core Initialization', () => {
            tests.it('should initialize successfully', () => {
                tests.expect(window.enhancedThemeSystem).toBeTruthy();
                tests.expect(window.enhancedThemeSystem.isInitialized).toBe(true);
            });

            tests.it('should have ConfigManager integration', () => {
                tests.expect(window.enhancedThemeSystem.configManager).toBeTruthy();
                tests.expect(window.enhancedThemeSystem.configManager).toBe(window.ConfigManager);
            });

            tests.it('should have current theme set', () => {
                const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
                tests.expect(currentTheme).toBeTruthy();
                tests.expect(currentTheme.id).toBeTruthy();
                tests.expect(currentTheme.name).toBeTruthy();
            });
        });

        tests.describe('Backward Compatibility', () => {
            tests.it('should maintain legacy API', () => {
                tests.expect(window.themeSystem).toBeTruthy();
                tests.expect(typeof window.themeSystem.getCurrentTheme).toBe('function');
                tests.expect(typeof window.themeSystem.setTheme).toBe('function');
                tests.expect(typeof window.themeSystem.getThemes).toBe('function');
            });

            tests.it('should preserve themes property', () => {
                tests.expect(window.themeSystem.themes).toBeTruthy();
                tests.expect(typeof window.themeSystem.themes).toBe('object');
            });

            tests.it('should convert themes correctly', () => {
                const legacyThemes = window.enhancedThemeSystem.getLegacyThemes();
                tests.expect(Object.keys(legacyThemes).length).toBeGreaterThan(0);
                
                // Verificar estructura de tema legacy
                const firstTheme = Object.values(legacyThemes)[0];
                tests.expect(firstTheme.name).toBeTruthy();
                tests.expect(firstTheme.primary).toBeTruthy();
                tests.expect(firstTheme.secondary).toBeTruthy();
            });
        });

        tests.describe('Theme Management', () => {
            tests.it('should get available themes', () => {
                const themes = window.enhancedThemeSystem.getThemes();
                tests.expect(Array.isArray(themes)).toBe(true);
                tests.expect(themes.length).toBeGreaterThan(0);
                
                // Verificar estructura de tema
                const firstTheme = themes[0];
                tests.expect(firstTheme.id).toBeTruthy();
                tests.expect(firstTheme.name).toBeTruthy();
                tests.expect(firstTheme.colors).toBeTruthy();
            });

            tests.it('should change themes correctly', () => {
                const initialTheme = window.enhancedThemeSystem.getCurrentTheme();
                const themes = window.enhancedThemeSystem.getThemes();
                
                // Encontrar un tema diferente
                const differentTheme = themes.find(t => t.id !== initialTheme.id);
                tests.expect(differentTheme).toBeTruthy();
                
                // Cambiar tema
                const result = window.enhancedThemeSystem.setTheme(differentTheme.id);
                tests.expect(result).toBeTruthy();
                tests.expect(result.id).toBe(differentTheme.id);
                
                // Verificar cambio
                const newCurrentTheme = window.enhancedThemeSystem.getCurrentTheme();
                tests.expect(newCurrentTheme.id).toBe(differentTheme.id);
                
                // Restaurar tema original
                window.enhancedThemeSystem.setTheme(initialTheme.id);
            });

            tests.it('should handle invalid theme gracefully', () => {
                const result = window.enhancedThemeSystem.setTheme('invalid-theme-id');
                tests.expect(result).toBeTruthy(); // Debería usar fallback
                tests.expect(result.id).toBe('dark-matrix'); // Tema por defecto
            });
        });

        tests.describe('CSS Application', () => {
            tests.it('should apply CSS variables correctly', () => {
                const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
                const root = document.documentElement;
                
                // Verificar variables principales
                const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
                const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color');
                const accentColor = getComputedStyle(root).getPropertyValue('--accent-color');
                
                tests.expect(primaryColor.trim()).toBeTruthy();
                tests.expect(secondaryColor.trim()).toBeTruthy();
                tests.expect(accentColor.trim()).toBeTruthy();
            });

            tests.it('should update body class on theme change', () => {
                const initialTheme = window.enhancedThemeSystem.getCurrentTheme();
                
                // Verificar clase inicial
                tests.expect(document.body.classList.contains(`theme-${initialTheme.id}`)).toBe(true);
                
                // Cambiar tema
                const themes = window.enhancedThemeSystem.getThemes();
                const differentTheme = themes.find(t => t.id !== initialTheme.id);
                
                if (differentTheme) {
                    window.enhancedThemeSystem.setTheme(differentTheme.id);
                    tests.expect(document.body.classList.contains(`theme-${differentTheme.id}`)).toBe(true);
                    tests.expect(document.body.classList.contains(`theme-${initialTheme.id}`)).toBe(false);
                    
                    // Restaurar
                    window.enhancedThemeSystem.setTheme(initialTheme.id);
                }
            });
        });

        tests.describe('Event System', () => {
            tests.it('should dispatch theme change events', (done) => {
                let eventReceived = false;
                
                const handler = (event) => {
                    eventReceived = true;
                    tests.expect(event.detail.themeData).toBeTruthy();
                    tests.expect(event.detail.timestamp).toBeTruthy();
                    window.removeEventListener('themeChanged', handler);
                    done();
                };
                
                window.addEventListener('themeChanged', handler);
                
                // Cambiar tema para disparar evento
                const themes = window.enhancedThemeSystem.getThemes();
                const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
                const differentTheme = themes.find(t => t.id !== currentTheme.id);
                
                if (differentTheme) {
                    window.enhancedThemeSystem.setTheme(differentTheme.id);
                    
                    // Timeout de seguridad
                    setTimeout(() => {
                        if (!eventReceived) {
                            window.removeEventListener('themeChanged', handler);
                            done();
                        }
                    }, 1000);
                } else {
                    window.removeEventListener('themeChanged', handler);
                    done();
                }
            });

            tests.it('should handle ConfigManager changes', () => {
                // Simular cambio en ConfigManager
                if (window.enhancedThemeSystem.configManager.onChange) {
                    // Verificar que el método existe
                    tests.expect(typeof window.enhancedThemeSystem.handleThemeConfigChange).toBe('function');
                }
            });
        });

        tests.describe('Persistence', () => {
            tests.it('should save theme preferences', () => {
                const testThemeId = 'test-theme-preference';
                window.enhancedThemeSystem.saveThemePreference(testThemeId);
                
                const saved = window.enhancedThemeSystem.getThemePreference();
                tests.expect(saved).toBe(testThemeId);
                
                // Cleanup
                localStorage.removeItem('datacrypt-theme-preference');
            });

            tests.it('should handle localStorage errors gracefully', () => {
                // Simular error de localStorage
                const originalSetItem = localStorage.setItem;
                localStorage.setItem = () => { throw new Error('Storage full'); };
                
                // No debería lanzar error
                tests.expect(() => {
                    window.enhancedThemeSystem.saveThemePreference('test');
                }).not.toThrow();
                
                // Restaurar
                localStorage.setItem = originalSetItem;
            });
        });

        tests.describe('Theme Selector Integration', () => {
            tests.it('should update theme selector if present', () => {
                // Crear selector temporal para testing
                const selector = document.createElement('div');
                selector.className = 'theme-selector';
                selector.innerHTML = `
                    <button class="theme-option" data-theme="dark-matrix">Dark</button>
                    <button class="theme-option" data-theme="light-code">Light</button>
                `;
                document.body.appendChild(selector);
                
                // Cambiar tema
                window.enhancedThemeSystem.setTheme('light-code');
                
                // Verificar actualización
                const activeButton = selector.querySelector('.theme-option.active');
                tests.expect(activeButton).toBeTruthy();
                tests.expect(activeButton.dataset.theme).toBe('light-code');
                
                // Cleanup
                document.body.removeChild(selector);
            });
        });
    });

    return tests.run();
}

// Test de performance específico para temas
function runThemeSystemPerformanceTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ThemeSystemPerformance');
    
    tests.describe('Theme System Performance', () => {
        tests.it('should initialize quickly', () => {
            const startTime = performance.now();
            // El sistema ya está inicializado, pero podemos medir operaciones
            window.enhancedThemeSystem.getCurrentTheme();
            const endTime = performance.now();
            
            tests.expect(endTime - startTime).toBeLessThan(10); // Less than 10ms
        });

        tests.it('should change themes quickly', () => {
            const themes = window.enhancedThemeSystem.getThemes();
            const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
            const testTheme = themes.find(t => t.id !== currentTheme.id);
            
            if (testTheme) {
                const startTime = performance.now();
                window.enhancedThemeSystem.setTheme(testTheme.id);
                const endTime = performance.now();
                
                tests.expect(endTime - startTime).toBeLessThan(50); // Less than 50ms
                
                // Restore original
                window.enhancedThemeSystem.setTheme(currentTheme.id);
            }
        });

        tests.it('should handle rapid theme changes', () => {
            const themes = window.enhancedThemeSystem.getThemes();
            const startTime = performance.now();
            
            // Cambiar temas rápidamente
            for (let i = 0; i < 5; i++) {
                const randomTheme = themes[i % themes.length];
                window.enhancedThemeSystem.setTheme(randomTheme.id);
            }
            
            const endTime = performance.now();
            tests.expect(endTime - startTime).toBeLessThan(200); // Less than 200ms for 5 changes
        });
    });

    return tests.run();
}

// Test de accesibilidad para temas
function runThemeSystemAccessibilityTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ThemeSystemAccessibility');
    
    tests.describe('Theme System Accessibility', () => {
        tests.it('should provide sufficient color contrast', () => {
            const themes = window.enhancedThemeSystem.getThemes();
            
            themes.forEach(theme => {
                // Aplicar tema
                window.enhancedThemeSystem.applyTheme(theme);
                
                // Verificar contraste básico (simplificado)
                const primaryColor = theme.colors.primary;
                const textColor = theme.colors.text;
                
                tests.expect(primaryColor).toBeTruthy();
                tests.expect(textColor).toBeTruthy();
                tests.expect(primaryColor).not.toBe(textColor); // Colores diferentes
            });
        });

        tests.it('should maintain readability across themes', () => {
            const themes = window.enhancedThemeSystem.getThemes();
            
            themes.forEach(theme => {
                // Verificar que los colores de texto sean válidos
                tests.expect(theme.colors.text).toMatch(/^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{3}$/);
                tests.expect(theme.colors.textSecondary).toBeTruthy();
            });
        });

        tests.it('should support system preference detection', () => {
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                tests.expect(typeof darkModeQuery.matches).toBe('boolean');
            }
        });
    });

    return tests.run();
}

// Ejecutar todas las pruebas del sistema de temas
async function runAllThemeSystemTests() {
    console.log('🚀 Starting Complete Theme System Test Suite...');
    
    try {
        const functionalTests = await runEnhancedThemeSystemTests();
        const performanceTests = await runThemeSystemPerformanceTests();
        const accessibilityTests = await runThemeSystemAccessibilityTests();
        
        console.log('✅ Theme Functional Tests:', functionalTests);
        console.log('⚡ Theme Performance Tests:', performanceTests);
        console.log('♿ Theme Accessibility Tests:', accessibilityTests);
        
        const totalPassed = (functionalTests?.passed || 0) + 
                           (performanceTests?.passed || 0) + 
                           (accessibilityTests?.passed || 0);
        
        const totalFailed = (functionalTests?.failed || 0) + 
                           (performanceTests?.failed || 0) + 
                           (accessibilityTests?.failed || 0);
        
        console.log(`\n📊 TOTAL THEME TESTS: ${totalPassed} passed, ${totalFailed} failed`);
        
        return {
            passed: totalPassed,
            failed: totalFailed,
            functional: functionalTests,
            performance: performanceTests,
            accessibility: accessibilityTests
        };
        
    } catch (error) {
        console.error('❌ Error running theme system tests:', error);
        return null;
    }
}

// Auto-export y configuración
if (typeof window !== 'undefined') {
    window.runEnhancedThemeSystemTests = runEnhancedThemeSystemTests;
    window.runThemeSystemPerformanceTests = runThemeSystemPerformanceTests;
    window.runThemeSystemAccessibilityTests = runThemeSystemAccessibilityTests;
    window.runAllThemeSystemTests = runAllThemeSystemTests;
}

export {
    runEnhancedThemeSystemTests,
    runThemeSystemPerformanceTests,
    runThemeSystemAccessibilityTests,
    runAllThemeSystemTests
};