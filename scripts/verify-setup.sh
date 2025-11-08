#!/bin/bash

# MRC Setup Verification Script
# Checks environment and configuration before deployment

echo "[mrc] Starting setup verification..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[mrc] ✗ Node.js not found"
    exit 1
fi
echo "[mrc] ✓ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[mrc] ✗ npm not found"
    exit 1
fi
echo "[mrc] ✓ npm: $(npm --version)"

# Check environment variables
echo ""
echo "[mrc] Checking environment variables..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "[mrc] ⚠️  NEXT_PUBLIC_SUPABASE_URL not set"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "[mrc] ⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
fi

# Check dependencies
echo ""
echo "[mrc] Checking dependencies..."
npm list --depth=0 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "[mrc] ✓ Dependencies installed"
else
    echo "[mrc] Installing dependencies..."
    npm install
fi

# Check build
echo ""
echo "[mrc] Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "[mrc] ✓ Build successful"
else
    echo "[mrc] ✗ Build failed"
    exit 1
fi

echo ""
echo "[mrc] ✓ Setup verification complete!"
echo "[mrc] Ready to deploy"
