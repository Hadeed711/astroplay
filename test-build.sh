#!/bin/bash

# Build test script for deployment readiness
echo "🚀 Testing AstroPlay build for deployment..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build directory exists
if [ -d "dist" ]; then
    echo "✅ Build successful! dist/ directory created"
    echo "📊 Build size:"
    du -sh dist/
    echo "📁 Build contents:"
    ls -la dist/
else
    echo "❌ Build failed! dist/ directory not found"
    exit 1
fi

# Test preview (optional - will start server)
echo "🔍 Testing preview..."
echo "Run 'npm run preview' to test the production build locally"

echo "🎉 Deployment readiness check complete!"
echo "📝 Next steps:"
echo "   1. Commit your changes: git add . && git commit -m 'Prepare for deployment'"
echo "   2. Push to GitHub: git push"
echo "   3. Connect repository to Vercel"
echo "   4. Deploy automatically!"
