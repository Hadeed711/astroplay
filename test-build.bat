@echo off
echo 🚀 Testing AstroPlay build for deployment...

REM Check Node.js version
echo 📋 Checking Node.js version...
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Run linting
echo 🔍 Running ESLint...
npm run lint

REM Build the project
echo 🔨 Building project...
npm run build

REM Check if build directory exists
if exist "dist\" (
    echo ✅ Build successful! dist\ directory created
    echo 📊 Build size:
    dir dist /s /-c
) else (
    echo ❌ Build failed! dist\ directory not found
    exit /b 1
)

echo 🎉 Deployment readiness check complete!
echo 📝 Next steps:
echo    1. Commit your changes: git add . ^&^& git commit -m "Prepare for deployment"
echo    2. Push to GitHub: git push
echo    3. Connect repository to Vercel
echo    4. Deploy automatically!
echo.
echo 🔍 To test locally: npm run preview
pause
