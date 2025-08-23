import { useMemo } from 'react'
import useAppStore from '../../store/useAppStore'
import { generateObjectContent } from '../../utils/contentGenerator'
import { formatNumber } from '../../utils/physics'

const EnhancedFactPanel = () => {
  const { selectedObject, explanationLevel } = useAppStore()

  const content = useMemo(() => {
    return generateObjectContent(selectedObject, explanationLevel)
  }, [selectedObject, explanationLevel])

  const getObjectIcon = () => {
    if (selectedObject.name.includes('Earth')) return '🌍'
    if (selectedObject.name.includes('Moon')) return '🌙'
    if (selectedObject.name.includes('Mars')) return '🔴'
    if (selectedObject.name.includes('Jupiter')) return '🪐'
    if (selectedObject.name.includes('Venus')) return '♀️'
    if (selectedObject.name.includes('Saturn')) return '🪐'
    if (selectedObject.name.includes('Sun')) return '☀️'
    if (selectedObject.name.includes('Betelgeuse')) return '🔴'
    if (selectedObject.name.includes('Sirius A')) return '⭐'
    if (selectedObject.name.includes('Sirius B')) return '⚪'
    if (selectedObject.name.includes('Proxima')) return '🌟'
    if (selectedObject.name.includes('Neutron') || selectedObject.name.includes('Pulsar') || selectedObject.name.includes('PSR')) return '⚪'
    if (selectedObject.name.includes('Black Hole') || selectedObject.name.includes('Sagittarius') || selectedObject.name.includes('M87') || selectedObject.name.includes('TON')) return '⚫'
    if (selectedObject.type === 'white_dwarf') return '⚪'
    if (selectedObject.type === 'moon') return '🌙'
    return '🌌'
  }

  const getLevelIcon = () => {
    switch (explanationLevel) {
      case 'eli12': return '🧒'
      case 'student': return '🎓'
      case 'pro': return '🔬'
      default: return '🎓'
    }
  }

  const getLevelLabel = () => {
    switch (explanationLevel) {
      case 'eli12': return 'Simple Explanation'
      case 'student': return 'Student Level'
      case 'pro': return 'Professional'
      default: return 'Student Level'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-space-gold flex items-center">
          <span className="mr-2">{getObjectIcon()}</span>
          {selectedObject.name}
        </h3>
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-1">{getLevelIcon()}</span>
          {getLevelLabel()}
        </div>
      </div>

      {/* Main Description */}
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">📖</span>
          Overview
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Gravity Section */}
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">⬇️</span>
          Gravity
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Surface Gravity:</span>
            <span className="text-space-gold font-mono text-sm">
              {selectedObject.surfaceGravity.toFixed(2)} m/s²
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.gravity}
          </p>
        </div>
      </div>

      {/* Escape Velocity Section */}
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">🚀</span>
          Escape Velocity
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Escape Speed:</span>
            <span className="text-space-gold font-mono text-sm">
              {selectedObject.escapeVelocity.toFixed(2)} km/s
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.escape}
          </p>
        </div>
      </div>

      {/* Distance Section */}
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">📏</span>
          Distance
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">From Earth:</span>
            <span className="text-space-gold font-mono text-sm">
              {selectedObject.distanceFromEarth === 0 
                ? "0 km" 
                : `${formatNumber(selectedObject.distanceFromEarth)} km`
              }
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.distance}
          </p>
        </div>
      </div>

      {/* Fun Fact */}
      <div className="bg-gradient-to-r from-space-purple/20 to-space-blue/20 rounded-lg border border-space-purple/30 p-4">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">💡</span>
          {explanationLevel === 'eli12' ? 'Cool Fact!' : explanationLevel === 'pro' ? 'Technical Note' : 'Did You Know?'}
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {content.funFact}
        </p>
      </div>

      {/* Additional Content for Student/Pro levels */}
      {explanationLevel !== 'eli12' && content.formation && (
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <span className="mr-2">🌟</span>
            Formation & Evolution
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.formation}
          </p>
        </div>
      )}

      {explanationLevel === 'pro' && content.orbital && (
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <span className="mr-2">🔬</span>
            Technical Details
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed font-mono">
            {content.orbital}
          </p>
        </div>
      )}

      {/* Missions */}
      {selectedObject.missions && selectedObject.missions.length > 0 && (
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <span className="mr-2">🛰️</span>
            Space Missions
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedObject.missions.map((mission, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-space-blue/30 text-white text-xs rounded-full border border-space-blue/50"
              >
                {mission}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedFactPanel