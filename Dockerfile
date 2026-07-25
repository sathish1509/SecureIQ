# Multi-stage Dockerfile for SecureIQ (React + Python Flask)

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

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python application code
COPY app.py ./

# Copy built React static assets from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Expose container port
EXPOSE 5000

# Environment variables
ENV PORT=5000
ENV PYTHONUNBUFFERED=1

# Run with Gunicorn multi-worker server for high availability across devices
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
