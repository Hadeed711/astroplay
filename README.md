# AstroPlay 🚀

An interactive 3D space education platform where students explore physics concepts, celestial bodies, and test their knowledge through engaging quizzes and immersive experiences.

## 🌟 Features

### 🌌 Explore Page
- **Interactive 3D space environment** with realistic physics
- **Celestial body selector** (Earth, Mars, Jupiter, Sun, Neutron Star, Black Hole, Proxima Centauri)
- **Physics visualizations**:
  - Gravity field lines and effects
  - Escape velocity trajectories  
  - Event horizons for black holes
  - Time dilation effects
- **Real-time calculations** for travel times and orbital mechanics
- **Multi-level explanations** (ELI12, Student, Professional)

### 🧠 Quiz System
- **Multiple quiz modes** (Quick 10, Topic-based)
- **Interactive question types**:
  - Facts and scientific figures
  - Travel time estimation challenges
  - 3D scene interpretation
  - Unit conversions and calculations
- **Gamification features** (streaks, hints, achievements)
- **Personalized feedback** and learning recommendations
- **Progress tracking** and performance analytics

### 📚 Educational Content
- **Space Legends** featuring famous scientists and astronauts
- **Comprehensive blog system** with latest space discoveries
- **Interactive data visualizations** of space phenomena
- **Definitions and explanations** for complex concepts

### 🎮 Interactive Features
- **3D scene manipulation** with intuitive controls
- **Real-time physics simulations** 
- **Responsive design** for desktop and mobile
- **Audio feedback** and ambient space sounds

## 🚀 Live Demo

**Deployed on Vercel**: [Add your deployment URL here]

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hadeed711/astroplay)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM
- **3D Graphics**: React Three Fiber + Drei
- **State Management**: Zustand
- **Physics**: Custom utility functions
- **Development Tools**: Leva (for 3D debugging)

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components (Navigation, Layout)
│   └── 3d/           # 3D scene components
├── pages/            # Route pages (ExplorePage, QuizPage)
├── store/            # Zustand state management
├── utils/            # Utility functions (physics calculations)
├── data/             # Static data (celestial bodies, quiz questions)
└── App.jsx           # Main app component with routing
```

## Development Phases

### ✅ Phase 1: Project Setup & Structure
- [x] Initialize React + Vite project
- [x] Install and configure Tailwind CSS
- [x] Set up React Router
- [x] Create basic component structure
- [x] Implement navigation and layout
## 🚀 Deployment

This app is optimized for **Vercel deployment** with proper SPA routing configuration.

### Quick Deploy
1. **Fork this repository**
2. **Connect to Vercel** and it will auto-deploy
3. **No additional configuration** needed

### Manual Setup
```bash
# Clone the repository
git clone https://github.com/Hadeed711/astroplay.git
cd astroplay

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Features
- ✅ **SPA routing** with no 404 errors on refresh
- ✅ **Code splitting** for optimal performance  
- ✅ **Asset optimization** with Vite
- ✅ **Vercel configuration** included
- ✅ **Production-ready** build settings

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Navigation and layout
│   ├── 3d/           # 3D scene components
│   ├── quiz/         # Quiz system components
│   └── audio/        # Audio system
├── pages/            # Route pages
├── store/            # Zustand state management
├── utils/            # Utility functions
├── data/             # Static data and content
└── App.jsx           # Main app with routing
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup
- **Node.js 18+** required
- **Modern browser** with WebGL support
- **Git** for version control

## 🌐 Browser Support

- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Compatibility

- ✅ Responsive design for tablets
- ✅ Touch controls for 3D scenes
- ✅ Mobile-optimized UI components
- ⚠️ Some 3D features may be limited on older mobile devices

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Three Fiber** community for 3D web development
- **NASA** for space imagery and data
- **ESA** for additional space resources
- **Open source** astronomy data providers

---

**Built with ❤️ for space education and exploration**
npm run build
```

## Physics Concepts Covered

- **Gravity**: Field visualization, surface gravity calculations
- **Escape Velocity**: Launch trajectories and energy requirements
- **Orbital Mechanics**: Circular orbits, orbital velocity
- **Relativistic Effects**: Time dilation near massive objects
- **Compact Objects**: Black holes, neutron stars, event horizons
- **Cosmic Distances**: Light-years, travel times at relativistic speeds

## Educational Goals

- Make abstract physics concepts tangible through 3D visualization
- Provide multiple explanation levels for different learning stages
- Encourage exploration through interactive controls
- Reinforce learning through gamified quizzes
- Build intuition about scales in the universe