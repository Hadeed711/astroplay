/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'heading': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        space: {
          dark: '#0a0a0f',
          blue: '#1e3a8a',
          purple: '#581c87',
          gold: '#fbbf24',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'star-fade-in': 'starFadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%': {
            opacity: '0.3',
            transform: 'translate(-50%, -50%) scale(0.8)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1.2)'
          }
        },
        starFadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          }
        }
      }
    },
  },
  plugins: [],
}

