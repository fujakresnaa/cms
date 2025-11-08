#!/bin/bash

# MRC Club Admin - Quick Start Script

echo "🚀 Starting MRC Club Admin Setup..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✓ Node.js $(node -v) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase and Blob credentials"
fi

# Build application
echo "🔨 Building application..."
npm run build

# Success message
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run database migrations (use Supabase SQL Editor)"
echo "3. Start development: npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "For Docker deployment:"
echo "  npm run docker:build"
echo "  npm run docker:up"
