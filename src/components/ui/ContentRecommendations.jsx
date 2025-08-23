import { useMemo } from 'react'
import useAppStore from '../../store/useAppStore'

const ContentRecommendations = () => {
  const { selectedObject, explanationLevel, spacecraftSpeed, showGravityField } = useAppStore()

  const recommendations = useMemo(() => {
    const recs = []

    // Level-based recommendations
    if (explanationLevel === 'eli12') {
      recs.push({
        type: 'level_up',
        title: 'Ready for More?',
        description: 'Try switching to Student level for more detailed explanations!',
        icon: '📚',
        action: 'Switch to Student Level',
        priority: 1
      })
    } else if (explanationLevel === 'student') {
      recs.push({
        type: 'level_up',
        title: 'Go Professional',
        description: 'Switch to Professional level for technical details and equations!',
        icon: '🔬',
        action: 'Switch to Professional',
        priority: 2
      })
    }

    // Object-specific recommendations
    if (selectedObject.name === 'Earth') {
      recs.push({
        type: 'explore',
        title: 'Explore Extreme Objects',
        description: 'Try a black hole or neutron star to see extreme physics in action!',
        icon: '⚫',
        action: 'Select Black Hole',
        priority: 3
      })
    } else if (selectedObject.type === 'compact') {
      recs.push({
        type: 'feature',
        title: 'Time Dilation Effects',
        description: 'Enable time dilation visualization to see relativistic effects!',
        icon: '⏰',
        action: 'Show Time Dilation',
        priority: 1
      })
    }

    // Speed-based recommendations
    if (spacecraftSpeed < 0.1) {
      recs.push({
        type: 'experiment',
        title: 'Speed Up!',
        description: 'Try increasing spacecraft speed to see dramatic changes in travel time!',
        icon: '🚀',
        action: 'Set Speed to 50%c',
        priority: 2
      })
    } else if (spacecraftSpeed > 0.8) {
      recs.push({
        type: 'physics',
        title: 'Relativistic Effects',
        description: 'At these speeds, relativistic effects become significant!',
        icon: '⚡',
        action: 'Learn About Relativity',
        priority: 1
      })
    }

    // Feature recommendations
    if (!showGravityField && selectedObject.type !== 'compact') {
      recs.push({
        type: 'visualization',
        title: 'Visualize Gravity',
        description: 'Turn on gravity field lines to see how objects bend spacetime!',
        icon: '🌌',
        action: 'Show Gravity Field',
        priority: 2
      })
    }

    // Distance-based recommendations
    if (selectedObject.distanceFromEarth > 9.461e12) { // More than 1 light year
      recs.push({
        type: 'scale',
        title: 'Cosmic Distances',
        description: 'This object is incredibly far! Try the travel time calculator.',
        icon: '📏',
        action: 'Calculate Travel Time',
        priority: 2
      })
    }

    // Sort by priority and return top 3
    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3)
  }, [selectedObject, explanationLevel, spacecraftSpeed, showGravityField])

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'level_up': return 'from-space-gold/20 to-space-gold/10 border-space-gold/30'
      case 'explore': return 'from-space-purple/20 to-space-purple/10 border-space-purple/30'
      case 'feature': return 'from-space-blue/20 to-space-blue/10 border-space-blue/30'
      case 'experiment': return 'from-green-500/20 to-green-500/10 border-green-500/30'
      case 'physics': return 'from-red-500/20 to-red-500/10 border-red-500/30'
      case 'visualization': return 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/30'
      case 'scale': return 'from-orange-500/20 to-orange-500/10 border-orange-500/30'
      default: return 'from-space-blue/20 to-space-blue/10 border-space-blue/30'
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Recommendations
        </h4>
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-gray-300 text-sm">
            You're exploring everything perfectly!
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Try switching to a different object for new recommendations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-white font-medium mb-4 flex items-center">
        <span className="mr-2">💡</span>
        Recommended for You
      </h4>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${getRecommendationColor(rec.type)} rounded-lg border p-3 hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="flex items-start">
              <span className="text-xl mr-3 mt-0.5">{rec.icon}</span>
              <div className="flex-1">
                <h5 className="text-white font-medium text-sm">{rec.title}</h5>
                <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                  {rec.description}
                </p>
                <button className="text-xs text-blue-300 hover:text-blue-200 mt-2 underline">
                  {rec.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path Suggestion */}
      <div className="mt-4 p-3 bg-space-dark/30 rounded border border-space-blue/20">
        <h6 className="text-gray-300 text-sm font-medium mb-2 flex items-center">
          <span className="mr-2">🎯</span>
          Suggested Learning Path
        </h6>
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-space-gold rounded-full mr-2 flex items-center justify-center text-xs">1</span>
            Start with familiar objects (Earth, Sun)
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-space-blue rounded-full mr-2 flex items-center justify-center text-xs">2</span>
            Enable visualizations one by one
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-space-purple rounded-full mr-2 flex items-center justify-center text-xs">3</span>
            Explore extreme objects (black holes, neutron stars)
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center text-xs">4</span>
            Experiment with different speeds and distances
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentRecommendations