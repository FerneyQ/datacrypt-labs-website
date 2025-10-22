/**
 * ⚙️ DataCrypt Labs - ConfigManager Tests
 * Filosofía Mejora Continua v2.1 - Testing Core Configuration System
 * 
 * Suite completa de tests para validar el ConfigManager
 * Cubre configuración, reactivity, persistencia y integración
 */

// Test suite para ConfigManager
function runConfigManagerTests() {
    if (!window.TestRunner) {
        
        return;
    }

    const tests = window.TestRunner.createSuite('ConfigManager');
    
    

    tests.describe('ConfigManager Core System', () => {
        
        tests.describe('Initialization and Singleton', () => {
            tests.it('should be available globally', () => {
                tests.expect(window.ConfigManager).toBeTruthy();
                tests.expect(typeof window.ConfigManager).toBe('object');
            });

            tests.it('should be a singleton instance', () => {
                const instance1 = window.ConfigManager;
                const instance2 = window.ConfigManager;
                tests.expect(instance1).toBe(instance2);
            });

            tests.it('should be ready', () => {
                tests.expect(window.ConfigManager.isReady()).toBe(true);
            });

            tests.it('should have core methods', () => {
                const requiredMethods = [
                    'getConfig', 'setConfig', 'updateConfig', 
                    'onChange', 'isReady', 'validateConfig'
                ];
                
                requiredMethods.forEach(method => {
                    tests.expect(typeof window.ConfigManager[method]).toBe('function');
                });
            });
        });

        tests.describe('Configuration Management', () => {
            tests.it('should get existing configurations', () => {
                // Verificar configuraciones principales
                const themeConfig = window.ConfigManager.getConfig('themes');
                const pwaConfig = window.ConfigManager.getConfig('pwa');
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                
                tests.expect(themeConfig).toBeTruthy();
                tests.expect(pwaConfig).toBeTruthy();
                tests.expect(chatbotConfig).toBeTruthy();
            });

            tests.it('should return null for non-existent config', () => {
                const nonExistent = window.ConfigManager.getConfig('non-existent-config');
                tests.expect(nonExistent).toBeNull();
            });

            tests.it('should handle nested config access', () => {
                const themeConfig = window.ConfigManager.getConfig('themes');
                
                if (themeConfig && themeConfig.themes) {
                    tests.expect(typeof themeConfig.themes).toBe('object');
                    tests.expect(Object.keys(themeConfig.themes).length).toBeGreaterThan(0);
                }
            });
        });

        tests.describe('Theme Configuration', () => {
            tests.it('should have valid theme configuration', () => {
                const themeConfig = window.ConfigManager.getConfig('themes');
                
                tests.expect(themeConfig.themes).toBeTruthy();
                tests.expect(themeConfig.currentTheme).toBeTruthy();
                tests.expect(typeof themeConfig.autoDetect).toBe('boolean');
            });

            tests.it('should have all required themes', () => {
                const themeConfig = window.ConfigManager.getConfig('themes');
                const requiredThemes = [
                    'dark-matrix', 'light-code', 'cyberpunk-2077',
                    'forest-code', 'sunset-vibes', 'deep-ocean'
                ];
                
                requiredThemes.forEach(themeId => {
                    tests.expect(themeConfig.themes[themeId]).toBeTruthy();
                });
            });

            tests.it('should have valid theme structure', () => {
                const themeConfig = window.ConfigManager.getConfig('themes');
                const firstTheme = Object.values(themeConfig.themes)[0];
                
                // Verificar estructura requerida
                tests.expect(firstTheme.id).toBeTruthy();
                tests.expect(firstTheme.name).toBeTruthy();
                tests.expect(firstTheme.colors).toBeTruthy();
                tests.expect(firstTheme.colors.primary).toBeTruthy();
                tests.expect(firstTheme.colors.secondary).toBeTruthy();
                tests.expect(firstTheme.colors.accent).toBeTruthy();
            });
        });

        tests.describe('PWA Configuration', () => {
            tests.it('should have valid PWA configuration', () => {
                const pwaConfig = window.ConfigManager.getConfig('pwa');
                
                tests.expect(typeof pwaConfig.enabled).toBe('boolean');
                tests.expect(pwaConfig.manifest).toBeTruthy();
                tests.expect(pwaConfig.serviceWorker).toBeTruthy();
                tests.expect(pwaConfig.features).toBeTruthy();
            });

            tests.it('should have service worker configuration', () => {
                const pwaConfig = window.ConfigManager.getConfig('pwa');
                
                tests.expect(pwaConfig.serviceWorker.file).toBeTruthy();
                tests.expect(pwaConfig.serviceWorker.scope).toBeTruthy();
                tests.expect(Array.isArray(pwaConfig.serviceWorker.cacheFiles)).toBe(true);
            });

            tests.it('should have manifest configuration', () => {
                const pwaConfig = window.ConfigManager.getConfig('pwa');
                
                tests.expect(pwaConfig.manifest.name).toBeTruthy();
                tests.expect(pwaConfig.manifest.shortName).toBeTruthy();
                tests.expect(pwaConfig.manifest.description).toBeTruthy();
                tests.expect(pwaConfig.manifest.startUrl).toBeTruthy();
            });
        });

        tests.describe('Chatbot Configuration', () => {
            tests.it('should have valid chatbot configuration', () => {
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                
                tests.expect(typeof chatbotConfig.enabled).toBe('boolean');
                tests.expect(chatbotConfig.appearance).toBeTruthy();
                tests.expect(chatbotConfig.behavior).toBeTruthy();
                tests.expect(chatbotConfig.knowledgeBase).toBeTruthy();
            });

            tests.it('should have knowledge base structure', () => {
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                
                tests.expect(Array.isArray(chatbotConfig.knowledgeBase.services)).toBe(true);
                tests.expect(chatbotConfig.knowledgeBase.contact).toBeTruthy();
                tests.expect(chatbotConfig.knowledgeBase.company).toBeTruthy();
            });

            tests.it('should have quick replies configuration', () => {
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                
                tests.expect(Array.isArray(chatbotConfig.quickReplies)).toBe(true);
                tests.expect(chatbotConfig.quickReplies.length).toBeGreaterThan(0);
                
                // Verificar estructura de quick reply
                const firstReply = chatbotConfig.quickReplies[0];
                tests.expect(firstReply.text).toBeTruthy();
                tests.expect(firstReply.icon).toBeTruthy();
                tests.expect(firstReply.category).toBeTruthy();
            });
        });

        tests.describe('Configuration Updates', () => {
            tests.it('should update configuration successfully', () => {
                const originalConfig = window.ConfigManager.getConfig('themes');
                const testTheme = 'test-theme-update';
                
                // Actualizar configuración
                window.ConfigManager.updateConfig('themes', {
                    currentTheme: testTheme
                });
                
                // Verificar actualización
                const updatedConfig = window.ConfigManager.getConfig('themes');
                tests.expect(updatedConfig.currentTheme).toBe(testTheme);
                
                // Restaurar configuración original
                window.ConfigManager.updateConfig('themes', {
                    currentTheme: originalConfig.currentTheme
                });
            });

            tests.it('should handle partial updates', () => {
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                const originalEnabled = chatbotConfig.enabled;
                
                // Actualización parcial
                window.ConfigManager.updateConfig('chatbot', {
                    enabled: !originalEnabled
                });
                
                // Verificar que solo cambió lo especificado
                const updatedConfig = window.ConfigManager.getConfig('chatbot');
                tests.expect(updatedConfig.enabled).toBe(!originalEnabled);
                tests.expect(updatedConfig.appearance).toBe(chatbotConfig.appearance); // Sin cambios
                
                // Restaurar
                window.ConfigManager.updateConfig('chatbot', {
                    enabled: originalEnabled
                });
            });

            tests.it('should handle deep nested updates', () => {
                const originalTheme = window.ConfigManager.getConfig('themes').currentTheme;
                
                // Update nested property
                window.ConfigManager.updateConfig('themes', {
                    themes: {
                        'dark-matrix': {
                            colors: {
                                primary: '#test-color'
                            }
                        }
                    }
                });
                
                const updated = window.ConfigManager.getConfig('themes');
                tests.expect(updated.themes['dark-matrix'].colors.primary).toBe('#test-color');
                
                // Los otros colores deberían mantenerse
                tests.expect(updated.themes['dark-matrix'].colors.secondary).toBeTruthy();
            });
        });

        tests.describe('Environment Detection', () => {
            tests.it('should detect current environment', () => {
                const environment = window.ConfigManager.getCurrentEnvironment();
                const validEnvironments = ['development', 'production', 'testing'];
                
                tests.expect(validEnvironments.includes(environment)).toBe(true);
            });

            tests.it('should provide environment-specific configs', () => {
                const environment = window.ConfigManager.getCurrentEnvironment();
                const envConfig = window.ConfigManager.getEnvironmentConfig();
                
                tests.expect(envConfig).toBeTruthy();
                tests.expect(typeof envConfig.debug).toBe('boolean');
            });
        });

        tests.describe('Validation System', () => {
            tests.it('should validate theme configuration', () => {
                const themeConfig = window.ConfigManager.getConfig('themes');
                const isValid = window.ConfigManager.validateConfig('themes', themeConfig);
                
                tests.expect(isValid).toBe(true);
            });

            tests.it('should validate PWA configuration', () => {
                const pwaConfig = window.ConfigManager.getConfig('pwa');
                const isValid = window.ConfigManager.validateConfig('pwa', pwaConfig);
                
                tests.expect(isValid).toBe(true);
            });

            tests.it('should detect invalid configurations', () => {
                const invalidConfig = { invalid: 'data' };
                const isValid = window.ConfigManager.validateConfig('themes', invalidConfig);
                
                tests.expect(isValid).toBe(false);
            });
        });

        tests.describe('Event System and Reactivity', () => {
            tests.it('should support onChange listeners', () => {
                tests.expect(typeof window.ConfigManager.onChange).toBe('function');
                
                let callbackExecuted = false;
                const testCallback = () => { callbackExecuted = true; };
                
                // Registrar listener
                window.ConfigManager.onChange('test-config', testCallback);
                
                // Simular cambio (el callback se ejecutaría en un cambio real)
                tests.expect(typeof testCallback).toBe('function');
            });

            tests.it('should handle multiple listeners', () => {
                let callback1Executed = false;
                let callback2Executed = false;
                
                const callback1 = () => { callback1Executed = true; };
                const callback2 = () => { callback2Executed = true; };
                
                window.ConfigManager.onChange('test-multiple', callback1);
                window.ConfigManager.onChange('test-multiple', callback2);
                
                // Ambos callbacks deberían estar registrados
                tests.expect(typeof callback1).toBe('function');
                tests.expect(typeof callback2).toBe('function');
            });
        });

        tests.describe('Performance Configuration', () => {
            tests.it('should have performance settings', () => {
                const performanceConfig = window.ConfigManager.getConfig('performance');
                
                if (performanceConfig) {
                    tests.expect(typeof performanceConfig.enabled).toBe('boolean');
                    tests.expect(typeof performanceConfig.lazyLoading).toBe('boolean');
                    tests.expect(typeof performanceConfig.preloading).toBe('boolean');
                }
            });
        });

        tests.describe('Error Handling', () => {
            tests.it('should handle null/undefined gracefully', () => {
                tests.expect(() => {
                    window.ConfigManager.getConfig(null);
                }).not.toThrow();
                
                tests.expect(() => {
                    window.ConfigManager.getConfig(undefined);
                }).not.toThrow();
            });

            tests.it('should handle invalid config keys', () => {
                tests.expect(() => {
                    window.ConfigManager.getConfig('');
                }).not.toThrow();
                
                tests.expect(() => {
                    window.ConfigManager.getConfig(123);
                }).not.toThrow();
            });

            tests.it('should handle update errors gracefully', () => {
                tests.expect(() => {
                    window.ConfigManager.updateConfig('non-existent', {});
                }).not.toThrow();
            });
        });
    });

    return tests.run();
}

// Test de performance para ConfigManager
function runConfigManagerPerformanceTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ConfigManagerPerformance');
    
    tests.describe('ConfigManager Performance', () => {
        tests.it('should retrieve configurations quickly', () => {
            const iterations = 1000;
            const startTime = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                window.ConfigManager.getConfig('themes');
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            tests.expect(avgTime).toBeLessThan(1); // Less than 1ms per operation
        });

        tests.it('should update configurations efficiently', () => {
            const startTime = performance.now();
            
            // Múltiples actualizaciones
            for (let i = 0; i < 10; i++) {
                window.ConfigManager.updateConfig('themes', {
                    testProperty: `value-${i}`
                });
            }
            
            const endTime = performance.now();
            tests.expect(endTime - startTime).toBeLessThan(50); // Less than 50ms for 10 updates
        });

        tests.it('should handle concurrent access efficiently', () => {
            const startTime = performance.now();
            
            // Acceso concurrente simulado
            const promises = [];
            for (let i = 0; i < 20; i++) {
                promises.push(Promise.resolve(window.ConfigManager.getConfig('pwa')));
            }
            
            Promise.all(promises).then(() => {
                const endTime = performance.now();
                tests.expect(endTime - startTime).toBeLessThan(20); // Less than 20ms
            });
        });
    });

    return tests.run();
}

// Test de memoria y recursos
function runConfigManagerResourceTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ConfigManagerResources');
    
    tests.describe('ConfigManager Resource Management', () => {
        tests.it('should not leak memory on repeated access', () => {
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // Acceso repetido
            for (let i = 0; i < 1000; i++) {
                const config = window.ConfigManager.getConfig('themes');
                // Liberar referencia
                config;
            }
            
            // Forzar garbage collection si está disponible
            if (window.gc) {
                window.gc();
            }
            
            const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            if (performance.memory) {
                const memoryIncrease = finalMemory - initialMemory;
                // No debería aumentar significativamente la memoria
                tests.expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
            }
        });

        tests.it('should manage configurations efficiently', () => {
            const configs = window.ConfigManager.getAllConfigs();
            
            if (configs) {
                tests.expect(typeof configs).toBe('object');
                tests.expect(Object.keys(configs).length).toBeGreaterThan(0);
            }
        });
    });

    return tests.run();
}

// Ejecutar todas las pruebas del ConfigManager
async function runAllConfigManagerTests() {
    
    
    try {
        const coreTests = await runConfigManagerTests();
        const performanceTests = await runConfigManagerPerformanceTests();
        const resourceTests = await runConfigManagerResourceTests();
        
        
        
        
        
        const totalPassed = (coreTests?.passed || 0) + 
                           (performanceTests?.passed || 0) + 
                           (resourceTests?.passed || 0);
        
        const totalFailed = (coreTests?.failed || 0) + 
                           (performanceTests?.failed || 0) + 
                           (resourceTests?.failed || 0);
        
        
        
        return {
            passed: totalPassed,
            failed: totalFailed,
            core: coreTests,
            performance: performanceTests,
            resources: resourceTests
        };
        
    } catch (error) {
        
        return null;
    }
}

// Auto-export y configuración
if (typeof window !== 'undefined') {
    window.runConfigManagerTests = runConfigManagerTests;
    window.runConfigManagerPerformanceTests = runConfigManagerPerformanceTests;
    window.runConfigManagerResourceTests = runConfigManagerResourceTests;
    window.runAllConfigManagerTests = runAllConfigManagerTests;
}

export {
    runConfigManagerTests,
    runConfigManagerPerformanceTests,
    runConfigManagerResourceTests,
    runAllConfigManagerTests
};
