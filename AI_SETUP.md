# AstroPlay AI Chat Setup

Your AI chat can now use **real AI models**! Here are your options:

## 🚀 Quick Start (Recommended)

### Option 1: Ollama (Local AI - Best Performance)
1. **Download Ollama**: https://ollama.ai
2. **Install a model**: Open terminal and run:
   ```bash
   ollama pull llama2
   # or for better responses:
   ollama pull llama3
   ```
3. **Start AI server**: Double-click `start_ai.bat`
4. **Start React app**: `npm run dev`

### Option 2: Groq (Free Cloud AI)
1. **Get free API key**: https://console.groq.com
2. **Set environment variable**:
   ```bash
   set GROQ_API_KEY=your_api_key_here
   ```
3. **Start AI server**: Double-click `start_ai.bat`
4. **Start React app**: `npm run dev`

### Option 3: Offline Mode (Always Works)
- Just start React app: `npm run dev`
- Uses comprehensive space knowledge base

## 🔧 How It Works

```
React Frontend → Python AI Server → AI Provider → Response
                      ↓ (if AI fails)
                Offline Fallback
```

## 🎯 Features

- **Real AI Responses**: Dynamic, conversational answers
- **Multiple AI Providers**: Ollama, Groq, OpenAI-compatible APIs
- **Automatic Fallback**: Never breaks, always responds
- **Space-Focused**: Prompts optimized for astronomy topics
- **Fast & Reliable**: Local caching and smart error handling

## 📝 Usage

1. **Start the AI server**: `start_ai.bat`
2. **Start React app**: `npm run dev` 
3. **Chat about space**: Ask anything about astronomy!

The system will automatically use the best available AI provider and fall back gracefully if needed.

## 🔍 Troubleshooting

- **AI server not responding**: Check if `start_ai.bat` is running
- **Slow responses**: Try Ollama for faster local AI
- **API errors**: Verify your API keys are set correctly
- **Python issues**: Install Python 3.8+ from python.org

## 🌟 Recommended Setup

For the best experience:
1. Install **Ollama** with **llama3** model (best quality)
2. Keep **Groq API** as backup (free tier)
3. Offline mode ensures it always works

Your space education app now has real AI conversation capabilities! 🌌🚀
