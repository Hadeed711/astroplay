# AstroPlay 🚀

A 3D space classroom where students explore gravity, escape velocity, black holes, neutron stars, travel times at different speeds, and test their knowledge with interactive quizzes.

## Features

### 🌌 Explore Page
- Interactive 3D space environment
- Celestial body selector (Earth, Mars, Jupiter, Sun, Neutron Star, Black Hole, Proxima Centauri)
- Physics visualizations:
  - Gravity field lines
  - Escape velocity trajectories
  - Event horizons for black holes
  - Time dilation effects
- Real-time calculations for travel times and orbital mechanics
- Multi-level explanations (ELI12, Student, Professional)

### 🧠 Quiz Page
- Multiple quiz modes (Quick 10, Topic-based)
- Interactive question types:
  - Facts and figures
  - Travel time estimation
  - Scene interpretation
  - Unit conversions
- Gamification features (streaks, hints, badges)
- Personalized feedback and learning recommendations

## Tech Stack

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
- [x] Create placeholder pages
- [x] Set up Zustand store
- [x] Add celestial bodies data
- [x] Create physics utility functions

### 🚧 Phase 2: 3D Scene Development
- [ ] Set up React Three Fiber canvas
- [ ] Create basic 3D celestial objects
- [ ] Implement camera controls
- [ ] Add object selector functionality
- [ ] Create control panels UI

### 📋 Phase 3: Interactive Features
- [ ] Gravity field visualization
- [ ] Escape velocity animations
- [ ] Travel time calculator
- [ ] Black hole event horizon
- [ ] Neutron star effects

### 📚 Phase 4: Content System
- [ ] Dynamic fact panels
- [ ] Multi-level explanations
- [ ] Interactive mini-tasks
- [ ] Content generation integration

### 🎯 Phase 5: Quiz System
- [ ] Quiz mode selection
- [ ] Question rendering system
- [ ] Scoring and streak mechanics
- [ ] Hint system
- [ ] Personalized feedback

### 🎨 Phase 6: Polish & Optimization
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Audio integration
- [ ] Animation polish
- [ ] Testing and deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
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