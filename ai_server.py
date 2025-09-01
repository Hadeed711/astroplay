#!/usr/bin/env python3
"""
Simple AI Chat Server for AstroPlay
Uses free AI APIs to provide real AI responses
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Free AI API endpoints (you can use any of these)
AI_PROVIDERS = {
    "ollama": {
        "url": "http://localhost:11434/api/generate",
        "model": "llama2"  # or any model you have installed
    },
    "groq": {
        "url": "https://api.groq.com/openai/v1/chat/completions",
        "model": "llama3-8b-8192",
        "key_env": "GROQ_API_KEY"
    },
    "openai_compatible": {
        "url": "https://api.openai.com/v1/chat/completions",
        "model": "gpt-3.5-turbo",
        "key_env": "OPENAI_API_KEY"
    }
}

def get_space_prompt(user_input):
    """Create a space-focused prompt"""
    return f"""You are AstroBot, an expert space exploration assistant. You specialize in astronomy, astrophysics, space missions, planets, stars, galaxies, and all things related to space exploration.

User Question: {user_input}

Please provide an informative, engaging response about space topics. Keep responses conversational and educational, around 100-150 words."""

def call_ollama_api(user_input):
    """Call local Ollama API"""
    try:
        payload = {
            "model": AI_PROVIDERS["ollama"]["model"],
            "prompt": get_space_prompt(user_input),
            "stream": False
        }
        
        response = requests.post(
            AI_PROVIDERS["ollama"]["url"],
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            logger.warning(f"Ollama API error: {response.status_code}")
            return None
            
    except Exception as e:
        logger.warning(f"Ollama API failed: {e}")
        return None

def call_groq_api(user_input):
    """Call Groq API (free tier available)"""
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are AstroBot, an expert space exploration assistant specializing in astronomy, astrophysics, and space science."
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ],
            "model": AI_PROVIDERS["groq"]["model"],
            "max_tokens": 200,
            "temperature": 0.7
        }
        
        response = requests.post(
            AI_PROVIDERS["groq"]["url"],
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"].strip()
        else:
            logger.warning(f"Groq API error: {response.status_code}")
            return None
            
    except Exception as e:
        logger.warning(f"Groq API failed: {e}")
        return None

def get_offline_fallback(user_input):
    """Offline fallback responses"""
    input_lower = user_input.lower()
    
    if "black hole" in input_lower:
        return "Black holes are fascinating cosmic objects where gravity is so strong that nothing can escape once it crosses the event horizon. They form when massive stars collapse at the end of their lives."
    elif "mars" in input_lower:
        return "Mars is our neighboring red planet, currently being explored by rovers like Perseverance. It has evidence of ancient water flows and is a prime target for future human missions."
    elif "space" in input_lower or "universe" in input_lower:
        return "The universe is an incredible place filled with billions of galaxies, each containing billions of stars. We're constantly discovering new exoplanets and learning more about our cosmic neighborhood!"
    else:
        return "That's an interesting space question! I'd love to help you explore the cosmos. Ask me about planets, stars, galaxies, space missions, or any other astronomical phenomena."

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'providers': list(AI_PROVIDERS.keys())
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data.get('message', '').strip()
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        logger.info(f"Received message: {user_message}")
        
        # Try AI providers in order
        ai_response = None
        
        # 1. Try Ollama (local)
        ai_response = call_ollama_api(user_message)
        if ai_response:
            logger.info("✅ Using Ollama")
            return jsonify({
                'response': ai_response,
                'provider': 'ollama',
                'status': 'success'
            })
        
        # 2. Try Groq (free tier)
        ai_response = call_groq_api(user_message)
        if ai_response:
            logger.info("✅ Using Groq")
            return jsonify({
                'response': ai_response,
                'provider': 'groq',
                'status': 'success'
            })
        
        # 3. Fallback to offline responses
        logger.info("⚠️ Using offline fallback")
        fallback_response = get_offline_fallback(user_message)
        
        return jsonify({
            'response': fallback_response,
            'provider': 'offline',
            'status': 'fallback'
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/providers', methods=['GET'])
def get_providers():
    """Get available AI providers"""
    status = {}
    
    # Check Ollama
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        status['ollama'] = response.status_code == 200
    except:
        status['ollama'] = False
    
    # Check Groq
    status['groq'] = bool(os.getenv("GROQ_API_KEY"))
    
    return jsonify({
        'providers': status,
        'recommended': 'ollama' if status['ollama'] else 'groq' if status['groq'] else 'offline'
    })

if __name__ == '__main__':
    print("🌌 Starting AstroPlay AI Chat Server...")
    print("=" * 50)
    print("Available AI Providers:")
    print("1. Ollama (local) - Install from https://ollama.ai")
    print("2. Groq (free) - Get API key from https://console.groq.com")
    print("3. Offline fallback - Always available")
    print("=" * 50)
    
    # Start Flask server
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=False,
        threaded=True
    )
