import React, { useState } from 'react'
import Scene3D from '../components/3d/Scene3D'
import ObjectSelector from '../components/ui/ObjectSelector'
import ControlPanel from '../components/ui/ControlPanel'
import EnhancedFactPanel from '../components/ui/EnhancedFactPanel'
import ExplanationLevel from '../components/ui/ExplanationLevel'
import TravelTimeCalculator from '../components/ui/TravelTimeCalculator'
import MiniTasks from '../components/ui/MiniTasks'
import LearningProgress from '../components/ui/LearningProgress'
import BlogSidebar from '../components/ui/BlogSidebar'
import SceneQuiz from '../components/quiz/SceneQuiz'
import { useAppStore } from '../store/useAppStore'

const ExplorePage = () => {
  const [showSceneQuiz, setShowSceneQuiz] = useState(false)
  const { updateUserProgress } = useAppStore()

  const handleQuizComplete = (result) => {
    updateUserProgress('quiz', {
      ...result,
      completedAt: new Date().toISOString()
    })
    setShowSceneQuiz(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 relative">
            <span 
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-yellow-400 bg-clip-text text-transparent"
              style={{
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
                textShadow: '0 0 20px rgba(100, 149, 237, 0.5), 0 0 40px rgba(138, 43, 226, 0.3)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
              }}
            >
              🌌 AstroPlay Explorer
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4">
            Explore gravity, escape velocity, black holes, and cosmic phenomena in an interactive 3D environment.
            Experience authentic physics calculations and time dilation effects.
          </p>
        </div>

        {/* 3D Scene */}
        <div className="mb-8">
          <Scene3D />
        </div>

        {/* Control Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 px-4">
          {/* Object Selector */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-4 md:p-6">
            <ObjectSelector />
          </div>
          
          {/* Controls */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-4 md:p-6">
            <ControlPanel />
            
            {/* Scene Quiz Button */}
            <div className="mt-4 pt-4 border-t border-space-blue/30">
              <button
                onClick={() => setShowSceneQuiz(true)}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Test Scene Knowledge
              </button>
            </div>
          </div>
          
          {/* Enhanced Facts */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-4 md:p-6 md:col-span-2 lg:col-span-1">
            <ExplanationLevel />
            <EnhancedFactPanel />
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Travel Time Calculator */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-6">
            <TravelTimeCalculator />
          </div>
          
          {/* Learning Progress */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-6">
            <LearningProgress />
          </div>
        </div>

        {/* Interactive Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Mini Tasks */}
          <div className="bg-space-dark/80 rounded-lg border border-space-blue/30 p-6">
            <MiniTasks />
          </div>

          {/* Blog Sidebar */}
          <BlogSidebar />
        </div>

        {/* Scene Quiz Modal */}
        {showSceneQuiz && (
          <SceneQuiz
            onComplete={handleQuizComplete}
            onClose={() => setShowSceneQuiz(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ExplorePage