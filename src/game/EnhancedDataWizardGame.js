/**
 * 🎮 ENHANCED DATA WIZARD GAME v2.1
 * Game engine completamente rediseñado con efectos visuales modernos
 * 
 * Filosofía Mejora Continua v2.1:
 * - Canvas rendering optimizado
 * - Efectos visuales avanzados
 * - Interactividad fluida
 * - Responsive gaming
 */

class EnhancedDataWizardGame {
    constructor() {
        this.canvas = document.getElementById('dataWizardCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.gameOverlay = document.getElementById('gameOverlay');
        this.startBtn = document.getElementById('startGameBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.contactUsBtn = document.getElementById('contactUsBtn');
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.dataPoints = 0;
        this.gameTimer = null;
        this.animationFrame = null;
        
        // Visual state
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.theme = 'dark';
        this.particles = [];
        this.effects = [];
        this.backgroundGrid = null;
        
        // Game objects
        this.pixels = [];
        this.connections = [];
        this.selectedPixels = [];
        this.hoveredPixel = null;
        this.combo = 0;
        
        // Enhanced settings
        this.settings = {
            pixelSize: 28,
            gridWidth: 20,
            gridHeight: 15,
            maxConnections: 50,
            particleCount: 100,
            enableEffects: true,
            enableSound: false,
            enableHaptics: true
        };
        
        // Colors and themes
        this.themes = {
            dark: {
                background: '#0a0a0a',
                grid: 'rgba(59, 130, 246, 0.1)',
                pixel: '#3b82f6',
                selected: '#f59e0b',
                connection: '#10b981',
                particle: '#8b5cf6',
                text: '#ffffff'
            },
            light: {
                background: '#f8fafc',
                grid: 'rgba(59, 130, 246, 0.2)',
                pixel: '#2563eb',
                selected: '#d97706',
                connection: '#059669',
                particle: '#7c3aed',
                text: '#1f2937'
            }
        };
        
        this.init();
    }

    /**
     * 🚀 INICIALIZACIÓN DEL JUEGO
     */
    init() {
        
        
        try {
            if (!this.canvas || !this.ctx) {
                throw new Error('Canvas no disponible');
            }
            
            // 1. Configurar canvas
            this.setupCanvas();
            
            // 2. Configurar eventos
            this.setupEventListeners();
            
            // 3. Configurar integración con temas
            this.setupThemeIntegration();
            
            // 4. Configurar efectos de fondo
            this.setupBackgroundEffects();
            
            // 5. Inicializar estado del juego
            this.resetGameState();
            
            // 6. Mostrar pantalla de inicio
            this.showStartScreen();
            
            
            
            // Cargar estadísticas iniciales del backend
            this.loadGameStats();
            
            // Cargar leaderboard inicial
            this.loadLeaderboard();
            
            // Notificar al chatbot
            if (window.dataCryptChatbot) {
                window.dataCryptChatbot.addMessage(
                    '🎮 Game engine mejorado activado - ¡Backend integrado y listo!',
                    'assistant'
                );
            }
            
        } catch (error) {
            
            this.handleGameError(error);
        }
    }

    /**
     * 🎨 CONFIGURAR CANVAS
     */
    setupCanvas() {
        // Configurar tamaño responsive
        this.resizeCanvas();
        
        // Configurar rendering de alta calidad
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Configurar DPI scaling
        this.setupHighDPI();
        
        // Listener para resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * 📐 REDIMENSIONAR CANVAS
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Mantener aspect ratio 4:3
        const targetWidth = Math.min(rect.width - 40, 800);
        const targetHeight = (targetWidth * 3) / 4;
        
        // Configurar tamaño del canvas
        this.canvas.style.width = targetWidth + 'px';
        this.canvas.style.height = targetHeight + 'px';
        
        // Configurar resolución interna
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = targetWidth * dpr;
        this.canvas.height = targetHeight * dpr;
        
        // Escalar contexto
        this.ctx.scale(dpr, dpr);
        
        // Recalcular grid
        this.calculateGridDimensions();
    }

    /**
     * 🔍 CONFIGURAR HIGH DPI
     */
    setupHighDPI() {
        const dpr = window.devicePixelRatio || 1;
        if (dpr > 1) {
            this.ctx.scale(dpr, dpr);
        }
    }

    /**
     * 📊 CALCULAR DIMENSIONES DE GRID
     */
    calculateGridDimensions() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.settings.gridWidth = Math.floor(canvasWidth / this.settings.pixelSize);
        this.settings.gridHeight = Math.floor(canvasHeight / this.settings.pixelSize);
        
        // Centrar grid
        this.gridOffsetX = (canvasWidth - (this.settings.gridWidth * this.settings.pixelSize)) / 2;
        this.gridOffsetY = (canvasHeight - (this.settings.gridHeight * this.settings.pixelSize)) / 2;
    }

    /**
     * 🎭 CONFIGURAR EVENTOS
     */
    setupEventListeners() {
        // Eventos de botones
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', () => this.resetGame());
        }
        
        if (this.contactUsBtn) {
            this.contactUsBtn.addEventListener('click', () => {
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Eventos de canvas
        if (this.canvas) {
            this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
            
            // Touch events para móviles
            this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        }
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Eventos de visibilidad de página
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * 🎨 CONFIGURAR INTEGRACIÓN CON TEMAS
     */
    setupThemeIntegration() {
        // Detectar tema actual
        if (window.configManager) {
            this.theme = window.configManager.get('theme.current') || 'dark';
            
            // Suscribirse a cambios de tema
            window.configManager.subscribe('theme', (newTheme) => {
                this.updateTheme(newTheme);
            });
        }
        
        // Detectar preferencia del sistema
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                if (!window.configManager?.get('theme.current')) {
                    this.theme = e.matches ? 'dark' : 'light';
                }
            });
        }
    }

    /**
     * 🌟 CONFIGURAR EFECTOS DE FONDO
     */
    setupBackgroundEffects() {
        // Crear grid animado de fondo
        this.createBackgroundGrid();
        
        // Inicializar partículas ambientales
        this.initBackgroundParticles();
    }

    /**
     * 🎯 CREAR GRID DE FONDO
     */
    createBackgroundGrid() {
        this.backgroundGrid = {
            lines: [],
            animated: true,
            pulseSpeed: 0.02,
            pulsePhase: 0
        };
        
        // Crear líneas del grid
        const spacing = 40;
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        for (let x = 0; x <= canvasWidth; x += spacing) {
            this.backgroundGrid.lines.push({
                type: 'vertical',
                x: x,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
        
        for (let y = 0; y <= canvasHeight; y += spacing) {
            this.backgroundGrid.lines.push({
                type: 'horizontal',
                y: y,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    /**
     * ✨ INICIALIZAR PARTÍCULAS DE FONDO
     */
    initBackgroundParticles() {
        this.backgroundParticles = [];
        const count = 30;
        
        for (let i = 0; i < count; i++) {
            this.backgroundParticles.push({
                x: Math.random() * (this.canvas.width / (window.devicePixelRatio || 1)),
                y: Math.random() * (this.canvas.height / (window.devicePixelRatio || 1)),
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                direction: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    /**
     * 🎮 INICIAR JUEGO
     */
    startGame() {
        
        
        this.isPlaying = true;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.dataPoints = 0;
        this.combo = 0;
        this.selectedPixels = [];
        this.connections = [];
        
        // Ocultar overlay
        this.hideOverlay();
        
        // Generar campo de píxeles
        this.generatePixelField();
        
        // Iniciar timer
        this.startGameTimer();
        
        // Iniciar loop del juego
        this.startGameLoop();
        
        // Actualizar UI
        this.updateUI();
        
        // Efecto de inicio
        this.createStartEffect();
    }

    /**
     * ⏰ INICIAR TIMER DEL JUEGO
     */
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateUI();
                
                if (this.timeLeft <= 0) {
                    this.endGame();
                } else if (this.timeLeft <= 10) {
                    this.createUrgencyEffect();
                }
            }
        }, 1000);
    }

    /**
     * 🔄 INICIAR LOOP DEL JUEGO
     */
    startGameLoop() {
        const gameLoop = () => {
            if (this.isPlaying) {
                this.update();
                this.render();
                this.animationFrame = requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop();
    }

    /**
     * 🎯 GENERAR CAMPO DE PÍXELES
     */
    generatePixelField() {
        this.pixels = [];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        
        for (let i = 0; i < this.settings.gridWidth * this.settings.gridHeight * 0.6; i++) {
            const x = this.gridOffsetX + (Math.floor(Math.random() * this.settings.gridWidth) * this.settings.pixelSize);
            const y = this.gridOffsetY + (Math.floor(Math.random() * this.settings.gridHeight) * this.settings.pixelSize);
            
            // Verificar que no haya otro pixel en esta posición
            const exists = this.pixels.some(pixel => 
                Math.abs(pixel.x - x) < this.settings.pixelSize && 
                Math.abs(pixel.y - y) < this.settings.pixelSize
            );
            
            if (!exists) {
                this.pixels.push({
                    x: x,
                    y: y,
                    size: this.settings.pixelSize - 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: Math.floor(Math.random() * 3) + 1,
                    isSelected: false,
                    glowIntensity: 0,
                    pulsePhase: Math.random() * Math.PI * 2,
                    birthTime: Date.now()
                });
            }
        }
    }

    /**
     * 🎭 ACTUALIZAR LÓGICA DEL JUEGO
     */
    update() {
        // Actualizar partículas
        this.updateParticles();
        
        // Actualizar efectos
        this.updateEffects();
        
        // Actualizar background
        this.updateBackground();
        
        // Actualizar píxeles
        this.updatePixels();
        
        // Verificar conexiones automáticas (para tutorial)
        if (this.level === 1 && this.selectedPixels.length === 0) {
            this.checkForHints();
        }
    }

    /**
     * ✨ ACTUALIZAR PARTÍCULAS
     */
    updateParticles() {
        // Actualizar partículas de fondo
        this.backgroundParticles.forEach(particle => {
            particle.x += Math.cos(particle.direction) * particle.speed;
            particle.y += Math.sin(particle.direction) * particle.speed;
            particle.pulse += 0.05;
            
            // Wrap around screen
            const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
            const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
            
            if (particle.x < 0) particle.x = canvasWidth;
            if (particle.x > canvasWidth) particle.x = 0;
            if (particle.y < 0) particle.y = canvasHeight;
            if (particle.y > canvasHeight) particle.y = 0;
        });
        
        // Actualizar partículas de efectos
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vy += 0.1; // Gravedad
            
            return particle.life > 0;
        });
    }

    /**
     * 🌟 ACTUALIZAR EFECTOS
     */
    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.age += effect.speed;
            return effect.age < effect.maxAge;
        });
    }

    /**
     * 🌌 ACTUALIZAR FONDO
     */
    updateBackground() {
        if (this.backgroundGrid) {
            this.backgroundGrid.pulsePhase += this.backgroundGrid.pulseSpeed;
        }
    }

    /**
     * 🎯 ACTUALIZAR PÍXELES
     */
    updatePixels() {
        const currentTime = Date.now();
        
        this.pixels.forEach(pixel => {
            // Actualizar animación de pulse
            pixel.pulsePhase += 0.02;
            
            // Actualizar glow de píxeles seleccionados
            if (pixel.isSelected) {
                pixel.glowIntensity = Math.min(pixel.glowIntensity + 0.1, 1);
            } else {
                pixel.glowIntensity = Math.max(pixel.glowIntensity - 0.05, 0);
            }
            
            // Efecto de aparición gradual
            const age = currentTime - pixel.birthTime;
            if (age < 500) {
                pixel.scale = Math.min(age / 500, 1);
            } else {
                pixel.scale = 1;
            }
        });
    }

    /**
     * 🎨 RENDERIZAR JUEGO
     */
    render() {
        // Limpiar canvas
        this.clearCanvas();
        
        // Renderizar fondo
        this.renderBackground();
        
        // Renderizar grid animado
        this.renderBackgroundGrid();
        
        // Renderizar partículas de fondo
        this.renderBackgroundParticles();
        
        // Renderizar píxeles
        this.renderPixels();
        
        // Renderizar conexiones
        this.renderConnections();
        
        // Renderizar efectos
        this.renderEffects();
        
        // Renderizar partículas
        this.renderParticles();
        
        // Renderizar hover effect
        this.renderHoverEffect();
        
        // Renderizar UI overlay
        this.renderUIOverlay();
    }

    /**
     * 🧹 LIMPIAR CANVAS
     */
    clearCanvas() {
        const currentTheme = this.themes[this.theme];
        
        // Fondo con gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height / (window.devicePixelRatio || 1));
        gradient.addColorStop(0, currentTheme.background);
        gradient.addColorStop(1, this.adjustColor(currentTheme.background, 20));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));
    }

    /**
     * 🌌 RENDERIZAR FONDO
     */
    renderBackground() {
        // Efecto de neblina sutil
        if (this.settings.enableEffects) {
            this.ctx.globalAlpha = 0.05;
            this.ctx.fillStyle = this.themes[this.theme].pixel;
            
            for (let i = 0; i < 5; i++) {
                const x = Math.sin(Date.now() * 0.001 + i) * 50 + this.canvas.width / (window.devicePixelRatio || 1) / 2;
                const y = Math.cos(Date.now() * 0.0007 + i) * 30 + this.canvas.height / (window.devicePixelRatio || 1) / 2;
                const radius = 100 + Math.sin(Date.now() * 0.002 + i) * 20;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.globalAlpha = 1;
        }
    }

    /**
     * 📐 RENDERIZAR GRID DE FONDO
     */
    renderBackgroundGrid() {
        if (!this.backgroundGrid) return;
        
        this.ctx.strokeStyle = this.themes[this.theme].grid;
        this.ctx.lineWidth = 1;
        
        this.backgroundGrid.lines.forEach((line, index) => {
            const pulse = Math.sin(this.backgroundGrid.pulsePhase + index * 0.1);
            const opacity = line.opacity + pulse * 0.1;
            
            this.ctx.globalAlpha = Math.max(0, opacity);
            this.ctx.beginPath();
            
            if (line.type === 'vertical') {
                this.ctx.moveTo(line.x, 0);
                this.ctx.lineTo(line.x, this.canvas.height / (window.devicePixelRatio || 1));
            } else {
                this.ctx.moveTo(0, line.y);
                this.ctx.lineTo(this.canvas.width / (window.devicePixelRatio || 1), line.y);
            }
            
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }

    /**
     * ✨ RENDERIZAR PARTÍCULAS DE FONDO
     */
    renderBackgroundParticles() {
        this.backgroundParticles.forEach(particle => {
            const alpha = particle.opacity + Math.sin(particle.pulse) * 0.2;
            this.ctx.globalAlpha = Math.max(0, alpha);
            this.ctx.fillStyle = this.themes[this.theme].particle;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }

    /**
     * 🎯 RENDERIZAR PÍXELES
     */
    renderPixels() {
        this.pixels.forEach(pixel => {
            const scale = pixel.scale || 1;
            const size = pixel.size * scale;
            
            // Efecto de glow para píxeles seleccionados
            if (pixel.glowIntensity > 0) {
                this.ctx.shadowColor = pixel.color;
                this.ctx.shadowBlur = pixel.glowIntensity * 15;
            }
            
            // Color base con pulse
            const pulseIntensity = Math.sin(pixel.pulsePhase) * 0.3 + 0.7;
            this.ctx.fillStyle = this.adjustColor(pixel.color, pulseIntensity * 50);
            
            // Renderizar pixel principal
            this.ctx.fillRect(
                pixel.x + (pixel.size - size) / 2,
                pixel.y + (pixel.size - size) / 2,
                size,
                size
            );
            
            // Efecto adicional para píxeles especiales
            if (pixel.type > 1) {
                this.ctx.fillStyle = this.adjustColor(pixel.color, 100);
                this.ctx.fillRect(
                    pixel.x + size * 0.25,
                    pixel.y + size * 0.25,
                    size * 0.5,
                    size * 0.5
                );
            }
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * 🔗 RENDERIZAR CONEXIONES
     */
    renderConnections() {
        this.connections.forEach(connection => {
            this.ctx.strokeStyle = this.themes[this.theme].connection;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            
            // Efecto de glow en las conexiones
            this.ctx.shadowColor = this.themes[this.theme].connection;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                connection.from.x + connection.from.size / 2,
                connection.from.y + connection.from.size / 2
            );
            this.ctx.lineTo(
                connection.to.x + connection.to.size / 2,
                connection.to.y + connection.to.size / 2
            );
            this.ctx.stroke();
            
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * 🌟 RENDERIZAR EFECTOS
     */
    renderEffects() {
        this.effects.forEach(effect => {
            switch (effect.type) {
                case 'explosion':
                    this.renderExplosionEffect(effect);
                    break;
                case 'score':
                    this.renderScoreEffect(effect);
                    break;
                case 'levelup':
                    this.renderLevelUpEffect(effect);
                    break;
            }
        });
    }

    /**
     * ✨ RENDERIZAR PARTÍCULAS
     */
    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }

    /**
     * 👆 RENDERIZAR EFECTO HOVER
     */
    renderHoverEffect() {
        if (this.hoveredPixel && !this.hoveredPixel.isSelected) {
            this.ctx.strokeStyle = this.themes[this.theme].text;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.strokeRect(
                this.hoveredPixel.x - 2,
                this.hoveredPixel.y - 2,
                this.hoveredPixel.size + 4,
                this.hoveredPixel.size + 4
            );
            
            this.ctx.setLineDash([]);
        }
    }

    /**
     * 📊 RENDERIZAR UI OVERLAY
     */
    renderUIOverlay() {
        // Combo indicator
        if (this.combo > 1) {
            this.ctx.fillStyle = this.themes[this.theme].text;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(
                `COMBO x${this.combo}!`,
                this.canvas.width / (window.devicePixelRatio || 1) / 2,
                50
            );
        }
        
        // Performance indicator
        if (this.settings.enableEffects) {
            const fps = this.calculateFPS();
            if (fps < 30) {
                this.ctx.fillStyle = '#ff4444';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(
                    `FPS: ${fps}`,
                    this.canvas.width / (window.devicePixelRatio || 1) - 50,
                    20
                );
            }
        }
    }

    /**
     * 🎯 MANEJAR CLICK EN CANVAS
     */
    handleCanvasClick(e) {
        if (!this.isPlaying || this.isPaused) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width) / (window.devicePixelRatio || 1);
        const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height) / (window.devicePixelRatio || 1);
        
        const clickedPixel = this.getPixelAt(clickX, clickY);
        
        if (clickedPixel) {
            this.selectPixel(clickedPixel);
            this.createClickEffect(clickX, clickY);
            
            // Haptic feedback
            if (this.settings.enableHaptics && navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    }

    /**
     * 🖱️ MANEJAR MOVIMIENTO DEL MOUSE
     */
    handleMouseMove(e) {
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width) / (window.devicePixelRatio || 1);
        const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height) / (window.devicePixelRatio || 1);
        
        this.hoveredPixel = this.getPixelAt(mouseX, mouseY);
        
        // Cambiar cursor
        this.canvas.style.cursor = this.hoveredPixel ? 'pointer' : 'default';
    }

    /**
     * 🔍 OBTENER PIXEL EN POSICIÓN
     */
    getPixelAt(x, y) {
        return this.pixels.find(pixel =>
            x >= pixel.x && x < pixel.x + pixel.size &&
            y >= pixel.y && y < pixel.y + pixel.size
        );
    }

    /**
     * 🎯 SELECCIONAR PIXEL
     */
    selectPixel(pixel) {
        if (pixel.isSelected) {
            // Deseleccionar
            pixel.isSelected = false;
            this.selectedPixels = this.selectedPixels.filter(p => p !== pixel);
        } else {
            // Seleccionar
            pixel.isSelected = true;
            this.selectedPixels.push(pixel);
            
            // Verificar conexiones
            this.checkConnections();
        }
    }

    /**
     * 🔗 VERIFICAR CONEXIONES
     */
    checkConnections() {
        if (this.selectedPixels.length >= 3) {
            // Verificar si forman una cadena válida
            if (this.isValidChain(this.selectedPixels)) {
                this.scoreConnection();
            } else {
                // Reset selección si no es válida
                this.resetSelection();
            }
        }
    }

    /**
     * ✅ VERIFICAR CADENA VÁLIDA
     */
    isValidChain(pixels) {
        // Implementar lógica de validación de cadena
        // Por simplicidad, aceptamos cualquier conjunto de 3+ píxeles del mismo color
        const firstColor = pixels[0].color;
        return pixels.every(pixel => pixel.color === firstColor);
    }

    /**
     * 🏆 PUNTUAR CONEXIÓN
     */
    scoreConnection() {
        const baseScore = this.selectedPixels.length * 10;
        const comboBonus = this.combo * 5;
        const levelBonus = this.level * 2;
        
        const totalScore = baseScore + comboBonus + levelBonus;
        
        this.score += totalScore;
        this.dataPoints += this.selectedPixels.length;
        this.combo++;
        
        // Crear efectos visuales
        this.createScoreEffect(totalScore);
        this.createConnectionParticles();
        
        // Registrar conexión
        this.connections.push({
            from: this.selectedPixels[0],
            to: this.selectedPixels[this.selectedPixels.length - 1],
            timestamp: Date.now()
        });
        
        // Remover píxeles usados
        this.removeSelectedPixels();
        
        // Añadir nuevos píxeles
        this.addNewPixels();
        
        // Verificar level up
        if (this.dataPoints >= this.level * 50) {
            this.levelUp();
        }
        
        this.updateUI();
    }

    /**
     * ⚡ CREAR EFECTOS VISUALES
     */
    createClickEffect(x, y) {
        // Partículas de click
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: this.themes[this.theme].selected,
                life: 1,
                decay: 0.02
            });
        }
    }

    createScoreEffect(score) {
        this.effects.push({
            type: 'score',
            x: this.canvas.width / (window.devicePixelRatio || 1) / 2,
            y: this.canvas.height / (window.devicePixelRatio || 1) / 3,
            text: `+${score}`,
            age: 0,
            maxAge: 60,
            speed: 1
        });
    }

    createConnectionParticles() {
        this.selectedPixels.forEach(pixel => {
            for (let i = 0; i < 8; i++) {
                this.particles.push({
                    x: pixel.x + pixel.size / 2,
                    y: pixel.y + pixel.size / 2,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    size: Math.random() * 4 + 2,
                    color: pixel.color,
                    life: 1,
                    decay: 0.015
                });
            }
        });
    }

    createStartEffect() {
        // Efecto de onda expansiva al iniciar
        this.effects.push({
            type: 'start',
            x: this.canvas.width / (window.devicePixelRatio || 1) / 2,
            y: this.canvas.height / (window.devicePixelRatio || 1) / 2,
            radius: 0,
            maxRadius: 200,
            age: 0,
            maxAge: 30,
            speed: 1
        });
    }

    createUrgencyEffect() {
        // Efecto de urgencia cuando queda poco tiempo
        if (Math.random() < 0.3) {
            this.effects.push({
                type: 'urgency',
                age: 0,
                maxAge: 10,
                speed: 1
            });
        }
    }

    /**
     * 🧹 UTILIDADES
     */
    adjustColor(color, adjustment) {
        // Convertir hex a RGB y ajustar brillo
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + adjustment);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + adjustment);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + adjustment);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    calculateFPS() {
        // Implementación simple de cálculo de FPS
        const now = performance.now();
        if (!this.lastFrameTime) {
            this.lastFrameTime = now;
            return 60;
        }
        
        const fps = 1000 / (now - this.lastFrameTime);
        this.lastFrameTime = now;
        
        return Math.round(fps);
    }

    updateUI() {
        // Actualizar elementos de UI
        const scoreEl = document.getElementById('gameScore');
        const levelEl = document.getElementById('gameLevel');
        const timeEl = document.getElementById('gameTime');
        const dataPointsEl = document.getElementById('dataPoints');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (timeEl) timeEl.textContent = this.timeLeft;
        if (dataPointsEl) dataPointsEl.textContent = this.dataPoints;
    }

    updateTheme(newTheme) {
        this.theme = newTheme;
        
    }

    // Implementar métodos restantes...
    resetSelection() {
        this.selectedPixels.forEach(pixel => pixel.isSelected = false);
        this.selectedPixels = [];
        this.combo = 0;
    }

    removeSelectedPixels() {
        this.pixels = this.pixels.filter(pixel => !pixel.isSelected);
        this.selectedPixels = [];
    }

    addNewPixels() {
        // Añadir algunos píxeles nuevos
        const count = Math.min(5, this.selectedPixels.length);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        
        for (let i = 0; i < count; i++) {
            const x = this.gridOffsetX + (Math.floor(Math.random() * this.settings.gridWidth) * this.settings.pixelSize);
            const y = this.gridOffsetY + (Math.floor(Math.random() * this.settings.gridHeight) * this.settings.pixelSize);
            
            const exists = this.pixels.some(pixel => 
                Math.abs(pixel.x - x) < this.settings.pixelSize && 
                Math.abs(pixel.y - y) < this.settings.pixelSize
            );
            
            if (!exists) {
                this.pixels.push({
                    x: x,
                    y: y,
                    size: this.settings.pixelSize - 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: Math.floor(Math.random() * 3) + 1,
                    isSelected: false,
                    glowIntensity: 0,
                    pulsePhase: Math.random() * Math.PI * 2,
                    birthTime: Date.now()
                });
            }
        }
    }

    levelUp() {
        this.level++;
        this.timeLeft += 30; // Bonus time
        this.createLevelUpEffect();
        
        
    }

    createLevelUpEffect() {
        this.effects.push({
            type: 'levelup',
            age: 0,
            maxAge: 120,
            speed: 1
        });
    }

    endGame() {
        this.isPlaying = false;
        this.stopGame();
        
        // Calcular tiempo total jugado
        this.timePlayed = 60 - this.timeLeft;
        
        // Guardar score en backend
        this.saveScoreToBackend();
        
        this.showGameOver();
        
        
    }

    /**
     * 💾 GUARDAR SCORE EN BACKEND
     */
    async saveScoreToBackend() {
        try {
            // Obtener nombre del jugador (por ahora usar 'Anonymous' o generar uno)
            const playerName = this.getPlayerName();
            
            const scoreData = {
                player_name: playerName,
                score: this.score,
                level_reached: this.level,
                data_points: this.dataPoints,
                time_played: this.timePlayed || 60
            };

            

            const response = await fetch('http://localhost:8000/api/game/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData)
            });

            if (response.ok) {
                const result = await response.json();
                
                
                // Mostrar ranking si está disponible
                if (result.rank) {
                    this.showRankingInfo(result.rank);
                }
                
                // Actualizar leaderboard
                await this.loadLeaderboard();
                
            } else {
                
            }
            
        } catch (error) {
            
            // El juego sigue funcionando sin backend
        }
    }

    /**
     * 👤 OBTENER NOMBRE DEL JUGADOR
     */
    getPlayerName() {
        // Intentar obtener nombre guardado en localStorage
        let playerName = localStorage.getItem('dataWizardPlayerName');
        
        if (!playerName) {
            // Generar nombre único basado en timestamp
            const adjectives = ['Cyber', 'Data', 'Neural', 'Quantum', 'Digital', 'Binary'];
            const nouns = ['Wizard', 'Analyst', 'Hacker', 'Miner', 'Explorer', 'Guru'];
            
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const num = Math.floor(Math.random() * 999) + 1;
            
            playerName = `${adj}${noun}${num}`;
            localStorage.setItem('dataWizardPlayerName', playerName);
        }
        
        return playerName;
    }

    /**
     * 🏆 MOSTRAR INFO DE RANKING
     */
    showRankingInfo(rank) {
        const rankingInfo = document.createElement('div');
        rankingInfo.className = 'ranking-info';
        rankingInfo.innerHTML = `
            <div class="rank-badge">
                <span class="rank-number">#${rank}</span>
                <span class="rank-text">Tu posición en el ranking</span>
            </div>
        `;
        
        // Añadir al overlay del juego
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            gameOverScreen.appendChild(rankingInfo);
        }
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (rankingInfo.parentElement) {
                rankingInfo.remove();
            }
        }, 5000);
    }

    /**
     * 📊 CARGAR LEADERBOARD
     */
    async loadLeaderboard() {
        try {
            const response = await fetch('http://localhost:8000/api/game/leaderboard?limit=5');
            
            if (response.ok) {
                const data = await response.json();
                this.displayLeaderboard(data.leaderboard);
            }
            
        } catch (error) {
            
        }
    }

    /**
     * 🏅 MOSTRAR LEADERBOARD
     */
    displayLeaderboard(leaderboard) {
        let leaderboardHtml = '<div class="leaderboard-section"><h4>🏆 Top Players</h4><ol>';
        
        leaderboard.slice(0, 5).forEach(player => {
            leaderboardHtml += `
                <li class="leaderboard-item">
                    <span class="player-name">${player.player_name}</span>
                    <span class="player-score">${player.score.toLocaleString()}</span>
                </li>
            `;
        });
        
        leaderboardHtml += '</ol></div>';
        
        // Añadir al overlay del juego
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) {
            // Remover leaderboard anterior si existe
            const existingLeaderboard = gameOverScreen.querySelector('.leaderboard-section');
            if (existingLeaderboard) {
                existingLeaderboard.remove();
            }
            
            gameOverScreen.insertAdjacentHTML('beforeend', leaderboardHtml);
        }
    }

    /**
     * 📈 CARGAR ESTADÍSTICAS INICIALES
     */
    async loadGameStats() {
        try {
            const response = await fetch('http://localhost:8000/api/game/stats');
            
            if (response.ok) {
                const data = await response.json();
                
                
                // Mostrar estadísticas en la pantalla de inicio si se desea
                this.displayGameStats(data.stats);
            }
            
        } catch (error) {
            
        }
    }

    /**
     * 📊 MOSTRAR ESTADÍSTICAS GENERALES
     */
    displayGameStats(stats) {
        // Mostrar estadísticas en consola por ahora
        console.log('🎮 Estadísticas globales del juego:', {
            'Total de partidas': stats.total_games,
            'Jugadores únicos': stats.unique_players,
            'Score promedio': stats.average_score,
            'Record mundial': stats.high_score,
            'Nivel máximo': stats.max_level_reached,
            'Horas jugadas': stats.total_hours_played
        });
        
        // Opcional: mostrar en UI si queremos
        // this.updateStatsUI(stats);
    }

    stopGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    resetGame() {
        this.stopGame();
        this.resetGameState();
        this.showStartScreen();
    }

    resetGameState() {
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.dataPoints = 0;
        this.combo = 0;
        this.selectedPixels = [];
        this.connections = [];
        this.particles = [];
        this.effects = [];
        this.hoveredPixel = null;
    }

    showStartScreen() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.remove('hidden');
            document.getElementById('gameStartScreen')?.classList.remove('hidden');
            document.getElementById('gameOverScreen')?.classList.add('hidden');
        }
    }

    showGameOver() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.remove('hidden');
            document.getElementById('gameStartScreen')?.classList.add('hidden');
            document.getElementById('gameOverScreen')?.classList.remove('hidden');
            
            // Actualizar scores finales
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('finalLevel').textContent = this.level;
            
            // Calcular rating
            let rating = 'Beginner';
            if (this.score > 1000) rating = 'Analyst';
            if (this.score > 3000) rating = 'Expert';
            if (this.score > 5000) rating = 'Data Wizard';
            
            document.getElementById('gameRating').textContent = rating;
        }
    }

    hideOverlay() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.add('hidden');
        }
    }

    handleKeyDown(e) {
        if (!this.isPlaying) return;
        
        switch (e.key) {
            case ' ':
            case 'Escape':
                e.preventDefault();
                this.togglePause();
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.resetGame();
                }
                break;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
    }

    handleVisibilityChange() {
        if (document.hidden && this.isPlaying) {
            this.isPaused = true;
        }
    }

    handleMouseEnter() {
        this.canvas.style.cursor = 'default';
    }

    handleMouseLeave() {
        this.hoveredPixel = null;
        this.canvas.style.cursor = 'default';
    }

    // Touch events para móviles
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('click', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleCanvasClick(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseMove(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
    }

    checkForHints() {
        // Sistema de hints para nuevos jugadores
        // Implementar lógica de tutorial
    }

    renderExplosionEffect(effect) {
        // Renderizar efecto de explosión
        this.ctx.strokeStyle = this.themes[this.theme].selected;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 1 - (effect.age / effect.maxAge);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = (effect.age / effect.maxAge) * 50;
            
            this.ctx.beginPath();
            this.ctx.moveTo(effect.x, effect.y);
            this.ctx.lineTo(
                effect.x + Math.cos(angle) * radius,
                effect.y + Math.sin(angle) * radius
            );
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    renderScoreEffect(effect) {
        this.ctx.fillStyle = this.themes[this.theme].selected;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.globalAlpha = 1 - (effect.age / effect.maxAge);
        
        this.ctx.fillText(
            effect.text,
            effect.x,
            effect.y - effect.age * 2
        );
        
        this.ctx.globalAlpha = 1;
    }

    renderLevelUpEffect(effect) {
        this.ctx.fillStyle = this.themes[this.theme].connection;
        this.ctx.font = 'bold 32px Arial';
        this.ctx.globalAlpha = Math.sin((effect.age / effect.maxAge) * Math.PI);
        
        this.ctx.fillText(
            'LEVEL UP!',
            this.canvas.width / (window.devicePixelRatio || 1) / 2,
            this.canvas.height / (window.devicePixelRatio || 1) / 2
        );
        
        this.ctx.globalAlpha = 1;
    }

    handleGameError(error) {
        
        
        // Mostrar mensaje de error amigable
        if (this.gameOverlay) {
            this.gameOverlay.innerHTML = `
                <div class="game-error">
                    <h3>😅 Oops! Pequeño problema técnico</h3>
                    <p>El juego necesita un momentito para calibrar los algoritmos.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        🔄 Reiniciar
                    </button>
                </div>
            `;
            this.gameOverlay.classList.remove('hidden');
        }
        
        // Reportar al sistema de monitoreo
        if (window.continuousMonitoring) {
            window.continuousMonitoring.reportError({
                type: 'GAME_ERROR',
                error: error.message,
                stack: error.stack
            });
        }
    }
}

// 🎮 EXPORTAR PARA USO GLOBAL
window.EnhancedDataWizardGame = EnhancedDataWizardGame;

// 🔄 AUTO-INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    
    window.enhancedDataWizardGame = new EnhancedDataWizardGame();
});
