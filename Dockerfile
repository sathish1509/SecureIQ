# Multi-stage Dockerfile for SecureIQ (React SPA + Python Flask Backend)

# Stage 1: Build React Frontend SPA
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Python API & Web Server
FROM python:3.10-slim
WORKDIR /app

# Environment variables
ENV PORT=5000 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    CORS_ORIGINS="*"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python application code & ML model assets
COPY app.py ./
COPY feature_extractor.py ./
COPY Model/ ./Model/

# Copy built React static assets from Stage 1 into Flask static folder
COPY --from=frontend-builder /app/dist ./dist

# Expose container port
EXPOSE 5000

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Run with Gunicorn multi-worker server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--threads", "2", "--timeout", "60", "app:app"]
