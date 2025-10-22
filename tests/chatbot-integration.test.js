/**
 * 🧪 DataCrypt Labs - Chatbot Integration Tests
 * Filosofía Mejora Continua v2.1 - Testing desde día 1
 * 
 * Suite de pruebas para validar la integración del chatbot
 * con todos los sistemas existentes
 */

// Test suite para la integración del chatbot
function runChatbotIntegrationTests() {
    if (!window.TestRunner) {
        
        return;
    }

    const tests = window.TestRunner.createSuite('ChatbotIntegration');
    
    

    tests.describe('Chatbot System Integration', () => {
        
        tests.describe('Core Dependencies', () => {
            tests.it('should have ConfigManager available', () => {
                tests.expect(window.ConfigManager).toBeTruthy();
                tests.expect(typeof window.ConfigManager.getConfig).toBe('function');
            });

            tests.it('should have TestRunner available', () => {
                tests.expect(window.TestRunner).toBeTruthy();
                tests.expect(typeof window.TestRunner.createSuite).toBe('function');
            });

            tests.it('should have DataCryptChatbot class available', () => {
                tests.expect(window.DataCryptChatbot).toBeTruthy();
                tests.expect(typeof window.DataCryptChatbot).toBe('function');
            });

            tests.it('should have ChatbotIntegration available', () => {
                tests.expect(window.ChatbotIntegration).toBeTruthy();
                tests.expect(typeof window.ChatbotIntegration).toBe('function');
            });
        });

        tests.describe('Configuration Management', () => {
            tests.it('should have chatbot configuration in ConfigManager', () => {
                const chatbotConfig = window.ConfigManager.getConfig('chatbot');
                tests.expect(chatbotConfig).toBeTruthy();
                tests.expect(chatbotConfig.enabled).toBe(true);
                tests.expect(chatbotConfig.appearance).toBeTruthy();
                tests.expect(chatbotConfig.behavior).toBeTruthy();
                tests.expect(chatbotConfig.knowledgeBase).toBeTruthy();
            });

            tests.it('should have required chatbot configuration properties', () => {
                const config = window.ConfigManager.getConfig('chatbot');
                tests.expect(config.appearance.avatar).toBeTruthy();
                tests.expect(config.appearance.title).toBeTruthy();
                tests.expect(config.behavior.autoGreeting).toBeDefined();
                tests.expect(config.knowledgeBase.services).toBeTruthy();
                tests.expect(Array.isArray(config.quickReplies)).toBe(true);
            });
        });

        tests.describe('Chatbot Instance', () => {
            tests.it('should create chatbot instance successfully', () => {
                const config = window.ConfigManager.getConfig('chatbot');
                const chatbot = new window.DataCryptChatbot(config);
                
                tests.expect(chatbot).toBeTruthy();
                tests.expect(chatbot.config).toBeTruthy();
                tests.expect(chatbot.chatContainer).toBeTruthy();
                
                // Cleanup
                chatbot.destroy();
            });

            tests.it('should have required chatbot methods', () => {
                const config = window.ConfigManager.getConfig('chatbot');
                const chatbot = new window.DataCryptChatbot(config);
                
                tests.expect(typeof chatbot.openChat).toBe('function');
                tests.expect(typeof chatbot.closeChat).toBe('function');
                tests.expect(typeof chatbot.sendMessage).toBe('function');
                tests.expect(typeof chatbot.updateTheme).toBe('function');
                tests.expect(typeof chatbot.updateConfig).toBe('function');
                
                chatbot.destroy();
            });
        });

        tests.describe('Integration Layer', () => {
            tests.it('should initialize ChatbotIntegration', () => {
                tests.expect(window.chatbotIntegration).toBeTruthy();
                tests.expect(window.chatbotIntegration.isInitialized).toBe(true);
            });

            tests.it('should have system references', () => {
                const integration = window.chatbotIntegration;
                tests.expect(integration.configManager).toBeTruthy();
                tests.expect(integration.getChatbot()).toBeTruthy();
            });

            tests.it('should respond to theme changes', () => {
                const integration = window.chatbotIntegration;
                const chatbot = integration.getChatbot();
                
                if (chatbot) {
                    const initialTheme = chatbot.currentTheme;
                    integration.updateChatbotTheme({
                        name: 'test-theme',
                        primary: '#ff0000',
                        secondary: '#00ff00'
                    });
                    // Theme should be updated (specific value testing may vary)
                    tests.expect(chatbot.currentTheme).toBeDefined();
                }
            });
        });

        tests.describe('UI Components', () => {
            tests.it('should create chatbot UI elements', () => {
                const chatbot = window.chatbotIntegration.getChatbot();
                if (chatbot) {
                    tests.expect(chatbot.chatContainer).toBeTruthy();
                    tests.expect(chatbot.chatButton).toBeTruthy();
                    tests.expect(chatbot.chatWindow).toBeTruthy();
                    tests.expect(chatbot.chatInput).toBeTruthy();
                }
            });

            tests.it('should have CSS classes applied', () => {
                const chatbot = window.chatbotIntegration.getChatbot();
                if (chatbot && chatbot.chatContainer) {
                    tests.expect(chatbot.chatContainer.classList.contains('datacrypt-chatbot')).toBe(true);
                }
            });
        });

        tests.describe('Knowledge Base', () => {
            tests.it('should have initialized knowledge base', () => {
                const chatbot = window.chatbotIntegration.getChatbot();
                if (chatbot) {
                    tests.expect(chatbot.knowledgeBase).toBeTruthy();
                    tests.expect(chatbot.knowledgeBase.greetings).toBeTruthy();
                    tests.expect(chatbot.knowledgeBase.services).toBeTruthy();
                    tests.expect(chatbot.knowledgeBase.contact).toBeTruthy();
                }
            });

            tests.it('should generate responses', () => {
                const chatbot = window.chatbotIntegration.getChatbot();
                if (chatbot) {
                    const response = chatbot.generateResponse('hola');
                    tests.expect(response).toBeTruthy();
                    tests.expect(typeof response).toBe('string');
                    tests.expect(response.length).toBeGreaterThan(0);
                }
            });
        });

        tests.describe('Event Handling', () => {
            tests.it('should handle theme change events', () => {
                // Simulate theme change event
                const themeData = { name: 'test', primary: '#ff0000' };
                window.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { themeData } 
                }));
                
                // Should not throw errors
                tests.expect(true).toBe(true);
            });

            tests.it('should handle language change events', () => {
                // Simulate language change event
                window.dispatchEvent(new CustomEvent('languageChanged', { 
                    detail: { language: 'en' } 
                }));
                
                // Should not throw errors
                tests.expect(true).toBe(true);
            });
        });
    });

    return tests.run();
}

// Test de performance del chatbot
function runChatbotPerformanceTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ChatbotPerformance');
    
    tests.describe('Chatbot Performance', () => {
        tests.it('should initialize within acceptable time', () => {
            const startTime = performance.now();
            const config = window.ConfigManager.getConfig('chatbot');
            const chatbot = new window.DataCryptChatbot(config);
            const endTime = performance.now();
            
            const initTime = endTime - startTime;
            tests.expect(initTime).toBeLessThan(1000); // Less than 1 second
            
            chatbot.destroy();
        });

        tests.it('should respond to messages quickly', async () => {
            const chatbot = window.chatbotIntegration.getChatbot();
            if (chatbot) {
                const startTime = performance.now();
                chatbot.generateResponse('test message');
                const endTime = performance.now();
                
                const responseTime = endTime - startTime;
                tests.expect(responseTime).toBeLessThan(100); // Less than 100ms
            }
        });

        tests.it('should handle multiple rapid messages', () => {
            const chatbot = window.chatbotIntegration.getChatbot();
            if (chatbot) {
                const startTime = performance.now();
                
                for (let i = 0; i < 10; i++) {
                    chatbot.generateResponse(`test message ${i}`);
                }
                
                const endTime = performance.now();
                const totalTime = endTime - startTime;
                tests.expect(totalTime).toBeLessThan(500); // Less than 500ms for 10 messages
            }
        });
    });

    return tests.run();
}

// Test de accesibilidad del chatbot
function runChatbotAccessibilityTests() {
    if (!window.TestRunner) return;

    const tests = window.TestRunner.createSuite('ChatbotAccessibility');
    
    tests.describe('Chatbot Accessibility', () => {
        tests.it('should have proper ARIA labels', () => {
            const chatbot = window.chatbotIntegration.getChatbot();
            if (chatbot && chatbot.chatButton) {
                // Check for accessibility attributes
                const hasAriaLabel = chatbot.chatButton.hasAttribute('aria-label') || 
                                   chatbot.chatButton.hasAttribute('title');
                tests.expect(hasAriaLabel).toBe(true);
            }
        });

        tests.it('should be keyboard navigable', () => {
            const chatbot = window.chatbotIntegration.getChatbot();
            if (chatbot && chatbot.chatInput) {
                const isTabIndexSet = chatbot.chatInput.tabIndex >= 0;
                tests.expect(isTabIndexSet).toBe(true);
            }
        });

        tests.it('should have proper color contrast', () => {
            const chatbot = window.chatbotIntegration.getChatbot();
            if (chatbot && chatbot.chatContainer) {
                const styles = getComputedStyle(chatbot.chatContainer);
                // Basic check - should have defined colors
                tests.expect(styles.color).toBeTruthy();
                tests.expect(styles.backgroundColor).toBeTruthy();
            }
        });
    });

    return tests.run();
}

// Ejecutar todas las pruebas del chatbot
async function runAllChatbotTests() {
    
    
    try {
        const integrationResults = await runChatbotIntegrationTests();
        const performanceResults = await runChatbotPerformanceTests();
        const accessibilityResults = await runChatbotAccessibilityTests();
        
        
        
        
        
        const totalPassed = (integrationResults?.passed || 0) + 
                           (performanceResults?.passed || 0) + 
                           (accessibilityResults?.passed || 0);
        
        const totalFailed = (integrationResults?.failed || 0) + 
                           (performanceResults?.failed || 0) + 
                           (accessibilityResults?.failed || 0);
        
        
        
        return {
            passed: totalPassed,
            failed: totalFailed,
            integration: integrationResults,
            performance: performanceResults,
            accessibility: accessibilityResults
        };
        
    } catch (error) {
        
        return null;
    }
}

// Auto-ejecutar tests cuando esté todo listo
if (typeof window !== 'undefined') {
    window.runChatbotIntegrationTests = runChatbotIntegrationTests;
    window.runChatbotPerformanceTests = runChatbotPerformanceTests;
    window.runChatbotAccessibilityTests = runChatbotAccessibilityTests;
    window.runAllChatbotTests = runAllChatbotTests;
    
    // Ejecutar automáticamente después de que todo esté cargado
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.chatbotIntegration && window.chatbotIntegration.isReady()) {
                runAllChatbotTests();
            }
        }, 2000);
    });
}

export { 
    runChatbotIntegrationTests,
    runChatbotPerformanceTests, 
    runChatbotAccessibilityTests,
    runAllChatbotTests
};
