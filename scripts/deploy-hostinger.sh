#!/bin/bash

# MRC Club - Hostinger Deployment Script
set -e

echo "[mrc] Starting Hostinger deployment..."

# Load environment variables
if [ ! -f .env.production ]; then
  echo "[mrc] Error: .env.production not found!"
  echo "[mrc] Copy .env.example to .env.production and fill in your values"
  exit 1
fi

# Export environment variables
export $(cat .env.production | xargs)

# Build Docker image
echo "[mrc] Building Docker image..."
docker build -f Dockerfile.hostinger -t mrc-app:latest .

# Stop existing container if running
echo "[mrc] Stopping existing container..."
docker-compose -f docker-compose.hostinger.yml down 2>/dev/null || true

# Start new container
echo "[mrc] Starting new container..."
docker-compose -f docker-compose.hostinger.yml up -d

# Wait for container to be healthy
echo "[mrc] Waiting for container to be healthy..."
sleep 10

# Check container status
if docker ps | grep -q mrc-app-prod; then
  echo "[mrc] ✓ Deployment successful!"
  docker-compose -f docker-compose.hostinger.yml ps
else
  echo "[mrc] ✗ Deployment failed!"
  docker-compose -f docker-compose.hostinger.yml logs
  exit 1
fi

echo "[mrc] Application is running on port 3000"
