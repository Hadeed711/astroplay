import { useState, useEffect } from 'react'
import useAppStore from '../../store/useAppStore'

const LearningProgress = () => {
  const { selectedObject, explanationLevel } = useAppStore()
  const [progress, setProgress] = useState({
    objectsExplored: new Set(['earth']), // Start with Earth
    featuresUsed: new Set(),
    timeSpent: 0,
    conceptsLearned: new Set(),
    currentStreak: 0,
    totalInteractions: 0
  })

  const [sessionStart] = useState(Date.now())

  // Track object exploration
  useEffect(() => {
    const objectKey = selectedObject.name.toLowerCase().replace(/\s+/g, '')
    setProgress(prev => ({
      ...prev,
      objectsExplored: new Set([...prev.objectsExplored, objectKey]),
      totalInteractions: prev.totalInteractions + 1
    }))
  }, [selectedObject])

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - sessionStart) / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStart])

  // Track concepts learned based on explanation level
  useEffect(() => {
    const concepts = new Set()
    
    if (explanationLevel === 'eli12') {
      concepts.add('basic_gravity')
      concepts.add('space_objects')
    } else if (explanationLevel === 'student') {
      concepts.add('escape_velocity')
      concepts.add('orbital_mechanics')
      concepts.add('gravitational_fields')
    } else if (explanationLevel === 'pro') {
      concepts.add('general_relativity')
      concepts.add('schwarzschild_radius')
      concepts.add('time_dilation')
    }

    setProgress(prev => ({
      ...prev,
      conceptsLearned: new Set([...prev.conceptsLearned, ...concepts])
    }))
  }, [explanationLevel, selectedObject])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressLevel = () => {
    const score = progress.objectsExplored.size * 10 + 
                 progress.conceptsLearned.size * 5 + 
                 Math.floor(progress.timeSpent / 60) * 2

    if (score < 20) return { level: 'Beginner', icon: '🌱', color: 'text-green-400' }
    if (score < 50) return { level: 'Explorer', icon: '🚀', color: 'text-blue-400' }
    if (score < 100) return { level: 'Scientist', icon: '🔬', color: 'text-purple-400' }
    return { level: 'Expert', icon: '🏆', color: 'text-gold-400' }
  }

  const level = getProgressLevel()
  const completionPercentage = Math.min((progress.objectsExplored.size / 7) * 100, 100)

  return (
    <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
      <h4 className="text-white font-medium mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Learning Progress
      </h4>

      {/* Current Level */}
      <div className="mb-4 text-center">
        <div className="text-3xl mb-1">{level.icon}</div>
        <div className={`font-bold ${level.color}`}>{level.level}</div>
        <div className="text-gray-400 text-xs">Keep exploring to level up!</div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-space-blue/20 rounded p-3 text-center">
          <div className="text-space-gold font-bold text-lg">{progress.objectsExplored.size}</div>
          <div className="text-gray-300 text-xs">Objects Explored</div>
        </div>
        
        <div className="bg-space-purple/20 rounded p-3 text-center">
          <div className="text-space-gold font-bold text-lg">{progress.conceptsLearned.size}</div>
          <div className="text-gray-300 text-xs">Concepts Learned</div>
        </div>
        
        <div className="bg-space-gold/20 rounded p-3 text-center">
          <div className="text-space-gold font-bold text-lg">{formatTime(progress.timeSpent)}</div>
          <div className="text-gray-300 text-xs">Time Exploring</div>
        </div>
        
        <div className="bg-green-500/20 rounded p-3 text-center">
          <div className="text-space-gold font-bold text-lg">{progress.totalInteractions}</div>
          <div className="text-gray-300 text-xs">Interactions</div>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Object Collection</span>
          <span className="text-gray-400">{progress.objectsExplored.size}/7</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-space-gold to-space-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Objects Explored */}
      <div className="mb-4">
        <h6 className="text-gray-300 text-sm font-medium mb-2">Objects Discovered:</h6>
        <div className="flex flex-wrap gap-1">
          {Array.from(progress.objectsExplored).map(obj => {
            const icons = {
              earth: '🌍', mars: '🔴', jupiter: '🪐', sun: '☀️',
              neutronstar: '⚪', stellarblackhole: '⚫', proximacentauri: '⭐'
            }
            return (
              <span key={obj} className="text-lg" title={obj}>
                {icons[obj] || '🌌'}
              </span>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h6 className="text-gray-300 text-sm font-medium mb-2">Recent Achievements:</h6>
        <div className="space-y-1 text-xs">
          {progress.objectsExplored.size >= 3 && (
            <div className="text-green-300">🏅 Cosmic Explorer - Visited 3+ objects</div>
          )}
          {progress.timeSpent >= 300 && (
            <div className="text-blue-300">⏰ Time Traveler - 5+ minutes exploring</div>
          )}
          {progress.conceptsLearned.size >= 5 && (
            <div className="text-purple-300">🧠 Knowledge Seeker - Learned 5+ concepts</div>
          )}
          {explanationLevel === 'pro' && (
            <div className="text-gold-300">🔬 Science Pro - Using professional level</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningProgress