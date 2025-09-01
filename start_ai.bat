@echo off
echo 🌌 AstroPlay AI Chat Server
echo ==========================

echo.
echo 🔍 Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python found!

echo.
echo 📦 Installing required packages...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Failed to install packages!
    pause
    exit /b 1
)

echo ✅ Packages installed successfully!

echo.
echo 🚀 Starting AI Chat Server...
echo 📝 Available AI options:
echo    1. Ollama (local) - Download from https://ollama.ai
echo    2. Groq (free) - Get API key from https://console.groq.com
echo    3. Offline mode - Always works
echo.
echo 🌐 Server will be available at http://127.0.0.1:5000
echo 🔴 Press Ctrl+C to stop the server
echo.

python ai_server.py
