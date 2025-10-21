#!/bin/bash
# 🚀 DataCrypt Labs - Production Deployment Script
# Filosofía Mejora Continua - Despliegue automatizado

set -e  # Exit on any error

echo "🚀 Iniciando despliegue de DataCrypt Labs en producción..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    print_status "Docker instalado"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose instalado"
fi

# Create necessary directories
print_status "Creando directorios necesarios..."
mkdir -p data logs backups ssl nginx/sites-enabled monitoring

# Set up environment
if [ ! -f .env.production ]; then
    print_warning "Archivo .env.production no encontrado, creando uno básico..."
    cp .env.production.example .env.production 2>/dev/null || echo "# Configurar variables de entorno" > .env.production
fi

# Set production environment
export PRODUCTION=true

# Migrate database
print_status "Ejecutando migración de base de datos..."
python3 scripts/migrate_database.py

# Build and start services
print_status "Construyendo imágenes Docker..."
docker-compose build

print_status "Iniciando servicios..."
docker-compose up -d

# Wait for services to be ready
print_status "Esperando que los servicios estén listos..."
sleep 30

# Health check
print_status "Verificando salud de los servicios..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Aplicación desplegada correctamente!"
    print_status "🌐 Accesible en: http://localhost"
    print_status "📚 Documentación API: http://localhost/docs"
    print_status "📊 Monitoreo: http://localhost:3000 (Grafana)"
else
    print_error "❌ Error en el health check. Revisando logs..."
    docker-compose logs datacrypt-api
    exit 1
fi

# Show running services
print_status "Servicios en ejecución:"
docker-compose ps

# Show useful commands
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs:           docker-compose logs -f"
echo "   Parar servicios:    docker-compose down"
echo "   Reiniciar:          docker-compose restart"
echo "   Backup DB:          python3 scripts/backup_database.py"
echo "   Monitoreo:          docker-compose logs -f nginx"

print_status "🎉 ¡Despliegue completado exitosamente!"