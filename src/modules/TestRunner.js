/**
 * 🧪 DataCrypt Labs - Testing Framework
 * Filosofía Mejora Continua v2.1 - Testing desde Día 1
 * 
 * Sistema de testing ligero y modular para validación continua
 * Inspirado en la metodología exitosa del Pescador Bot 2.0
 */

class TestRunner {
    constructor() {
        this.tests = new Map();
        this.results = new Map();
        this.config = {
            autoRun: true,
            verboseOutput: true,
            breakOnFailure: false,
            timeout: 5000
        };
        this.stats = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0
        };
    }

    // Registro de tests
    describe(suiteName, testFunction) {
        if (!this.tests.has(suiteName)) {
            this.tests.set(suiteName, []);
        }
        
        const suite = {
            name: suiteName,
            tests: [],
            beforeEach: null,
            afterEach: null,
            beforeAll: null,
            afterAll: null
        };

        // Context object para el suite
        const context = {
            it: (testName, testFn) => {
                suite.tests.push({ name: testName, fn: testFn, skip: false });
            },
            skip: (testName, testFn) => {
                suite.tests.push({ name: testName, fn: testFn, skip: true });
            },
            beforeEach: (fn) => { suite.beforeEach = fn; },
            afterEach: (fn) => { suite.afterEach = fn; },
            beforeAll: (fn) => { suite.beforeAll = fn; },
            afterAll: (fn) => { suite.afterAll = fn; }
        };

        // Ejecutar la función del suite para registrar tests
        testFunction.call(context, context);
        this.tests.set(suiteName, suite);
    }

    // Assertions básicas pero potentes
    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${actual} to be ${expected}`);
                }
                return true;
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
                }
                return true;
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
                return true;
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
                return true;
            },
            toThrow: () => {
                if (typeof actual !== 'function') {
                    throw new Error('Expected a function that throws');
                }
                try {
                    actual();
                    throw new Error('Expected function to throw an error');
                } catch (error) {
                    return true;
                }
            },
            toContain: (expected) => {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
                return true;
            },
            toHaveProperty: (property) => {
                if (!(property in actual)) {
                    throw new Error(`Expected object to have property ${property}`);
                }
                return true;
            },
            toBeInstanceOf: (constructor) => {
                if (!(actual instanceof constructor)) {
                    throw new Error(`Expected ${actual} to be instance of ${constructor.name}`);
                }
                return true;
            }
        };
    }

    // Ejecución de un suite específico
    async runSuite(suiteName) {
        const suite = this.tests.get(suiteName);
        if (!suite) {
            throw new Error(`Suite "${suiteName}" not found`);
        }

        const suiteResults = {
            name: suiteName,
            tests: [],
            passed: 0,
            failed: 0,
            skipped: 0,
            duration: 0
        };

        const startTime = performance.now();

        try {
            // beforeAll hook
            if (suite.beforeAll) {
                await suite.beforeAll();
            }

            // Ejecutar cada test
            for (const test of suite.tests) {
                if (test.skip) {
                    suiteResults.tests.push({
                        name: test.name,
                        status: 'skipped',
                        duration: 0,
                        error: null
                    });
                    suiteResults.skipped++;
                    this.stats.skipped++;
                    continue;
                }

                const testStartTime = performance.now();
                let testResult = {
                    name: test.name,
                    status: 'pending',
                    duration: 0,
                    error: null
                };

                try {
                    // beforeEach hook
                    if (suite.beforeEach) {
                        await suite.beforeEach();
                    }

                    // Ejecutar el test con timeout
                    await this.runWithTimeout(test.fn, this.config.timeout);
                    
                    testResult.status = 'passed';
                    suiteResults.passed++;
                    this.stats.passed++;

                    // afterEach hook
                    if (suite.afterEach) {
                        await suite.afterEach();
                    }

                } catch (error) {
                    testResult.status = 'failed';
                    testResult.error = error.message;
                    suiteResults.failed++;
                    this.stats.failed++;

                    if (this.config.breakOnFailure) {
                        break;
                    }
                }

                testResult.duration = performance.now() - testStartTime;
                suiteResults.tests.push(testResult);
                this.stats.total++;
            }

            // afterAll hook
            if (suite.afterAll) {
                await suite.afterAll();
            }

        } catch (error) {
            console.error(`Suite setup/teardown error: ${error.message}`);
        }

        suiteResults.duration = performance.now() - startTime;
        this.results.set(suiteName, suiteResults);
        
        if (this.config.verboseOutput) {
            this.logSuiteResults(suiteResults);
        }

        return suiteResults;
    }

    // Ejecutar todos los tests
    async runAll() {
        console.log('🧪 Starting test execution...\n');
        
        this.resetStats();
        const allResults = [];

        for (const suiteName of this.tests.keys()) {
            const results = await this.runSuite(suiteName);
            allResults.push(results);
        }

        this.logFinalResults();
        return allResults;
    }

    // Utilidades
    async runWithTimeout(fn, timeout) {
        return Promise.race([
            fn(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)
            )
        ]);
    }

    resetStats() {
        this.stats = { total: 0, passed: 0, failed: 0, skipped: 0 };
        this.results.clear();
    }

    logSuiteResults(suite) {
        const status = suite.failed > 0 ? '❌' : '✅';
        console.log(`${status} ${suite.name} (${suite.duration.toFixed(2)}ms)`);
        
        suite.tests.forEach(test => {
            const testStatus = test.status === 'passed' ? '  ✅' : 
                              test.status === 'failed' ? '  ❌' : '  ⏸️';
            const duration = `(${test.duration.toFixed(2)}ms)`;
            console.log(`${testStatus} ${test.name} ${duration}`);
            
            if (test.error) {
                console.log(`     Error: ${test.error}`);
            }
        });
        console.log('');
    }

    logFinalResults() {
        const totalTime = Array.from(this.results.values())
            .reduce((sum, suite) => sum + suite.duration, 0);

        console.log('📊 Test Results Summary:');
        console.log(`   Total: ${this.stats.total}`);
        console.log(`   ✅ Passed: ${this.stats.passed}`);
        console.log(`   ❌ Failed: ${this.stats.failed}`);
        console.log(`   ⏸️ Skipped: ${this.stats.skipped}`);
        console.log(`   ⏱️ Duration: ${totalTime.toFixed(2)}ms\n`);

        const successRate = this.stats.total > 0 ? 
            ((this.stats.passed / this.stats.total) * 100).toFixed(1) : 0;
        
        console.log(`🎯 Success Rate: ${successRate}%`);
        
        if (this.stats.failed > 0) {
            console.warn('⚠️ Some tests failed. Check the output above for details.');
        } else {
            console.log('🎉 All tests passed!');
        }
    }

    // API para integración con CI/CD
    getResults() {
        return {
            stats: { ...this.stats },
            suites: Array.from(this.results.values()),
            timestamp: new Date().toISOString(),
            success: this.stats.failed === 0
        };
    }

    // Configuración del runner
    configure(options) {
        this.config = { ...this.config, ...options };
    }
}

// Mock helpers para testing
class MockHelpers {
    static createMockFunction() {
        const calls = [];
        const fn = (...args) => {
            calls.push(args);
            return fn.returnValue;
        };
        
        fn.calls = calls;
        fn.callCount = () => calls.length;
        fn.calledWith = (...args) => calls.some(call => 
            JSON.stringify(call) === JSON.stringify(args)
        );
        fn.mockReturnValue = (value) => { fn.returnValue = value; return fn; };
        fn.reset = () => { calls.length = 0; fn.returnValue = undefined; };
        
        return fn;
    }

    static async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static mockDOM(html) {
        if (typeof document !== 'undefined') {
            const container = document.createElement('div');
            container.innerHTML = html;
            return container;
        }
        return null;
    }
}

// Instancia global
const testRunner = new TestRunner();

// Exports
if (typeof window !== 'undefined') {
    window.TestRunner = testRunner;
    window.describe = testRunner.describe.bind(testRunner);
    window.expect = testRunner.expect.bind(testRunner);
    window.MockHelpers = MockHelpers;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestRunner, MockHelpers };
}

export { TestRunner, MockHelpers };
export default testRunner;