# 🐳 DataCrypt Labs - Docker Configuration
# Filosofía Mejora Continua - Containerización para despliegue

FROM python:3.11-slim-bullseye

# Metadata
LABEL maintainer="DataCrypt Labs <info@datacrypt-labs.com>"
LABEL version="1.0.0"
LABEL description="DataCrypt Labs Business Intelligence & Data Science API"

# Set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY src/ ./src/
COPY assets/ ./assets/
COPY *.html ./
COPY *.js ./
COPY *.json ./
COPY *.txt ./
COPY *.xml ./
COPY railway_start.py ./

# Create necessary directories
RUN mkdir -p logs backups ssl data

# Create non-root user
RUN groupadd -r datacrypt && useradd -r -g datacrypt datacrypt
RUN chown -R datacrypt:datacrypt /app
USER datacrypt

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "railway_start.py"]