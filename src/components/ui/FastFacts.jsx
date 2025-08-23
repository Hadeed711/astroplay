import useAppStore from '../../store/useAppStore'
import { formatNumber, calculateTravelTime } from '../../utils/physics'

const FastFacts = () => {
  const { selectedObject, spacecraftSpeed, explanationLevel } = useAppStore()

  const formatMass = (mass) => {
    if (mass > 1e30) {
      return `${(mass / 1.989e30).toFixed(2)} solar masses`
    }
    return `${formatNumber(mass)} kg`
  }

  const formatDistance = (distance) => {
    if (distance > 9.461e12) {
      return `${(distance / 9.461e12).toFixed(2)} light years`
    } else if (distance > 1e9) {
      return `${formatNumber(distance / 1e6)} million km`
    }
    return `${formatNumber(distance)} km`
  }

  const getTravelTime = () => {
    if (selectedObject.distanceFromEarth === 0) return 'You are here!'
    const time = calculateTravelTime(selectedObject.distanceFromEarth, spacecraftSpeed)
    
    if (time.years > 1) {
      return `${time.years.toFixed(1)} years`
    } else if (time.days > 1) {
      return `${time.days.toFixed(1)} days`
    } else if (time.hours > 1) {
      return `${time.hours.toFixed(1)} hours`
    }
    return `${time.minutes.toFixed(1)} minutes`
  }

  const getExplanation = () => {
    const explanations = {
      eli12: {
        gravity: "How strong the pull is - like how hard it would be to jump!",
        escape: "How fast you need to go to escape forever, like a rocket!",
        distance: "How far away this is from Earth - imagine traveling there!"
      },
      student: {
        gravity: "Surface gravitational acceleration - affects weight and orbital mechanics",
        escape: "Minimum velocity needed to overcome gravitational binding energy",
        distance: "Current distance from Earth, varies with orbital positions"
      },
      pro: {
        gravity: "Gravitational field strength at surface: g = GM/r²",
        escape: "Escape velocity derived from energy conservation: v = √(2GM/r)",
        distance: "Heliocentric distance accounting for elliptical orbital mechanics"
      }
    }
    return explanations[explanationLevel] || explanations.student
  }

  const explanation = getExplanation()

  return (
    <div>
      <h3 className="text-lg font-semibold text-space-gold mb-4">Fast Facts</h3>
      
      <div className="space-y-4">
        {/* Basic Properties */}
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-3">{selectedObject.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{selectedObject.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mass:</span>
              <span className="text-white">{formatMass(selectedObject.mass)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Radius:</span>
              <span className="text-white">{formatNumber(selectedObject.radius)} km</span>
            </div>
          </div>
        </div>

        {/* Physics Properties */}
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-3">Physics</h4>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Surface Gravity:</span>
                <span className="text-space-gold">{selectedObject.surfaceGravity.toFixed(2)} m/s²</span>
              </div>
              <p className="text-gray-500 text-xs">{explanation.gravity}</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Escape Velocity:</span>
                <span className="text-space-gold">{selectedObject.escapeVelocity.toFixed(2)} km/s</span>
              </div>
              <p className="text-gray-500 text-xs">{explanation.escape}</p>
            </div>
          </div>
        </div>

        {/* Distance & Travel */}
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <h4 className="text-white font-medium mb-3">Distance & Travel</h4>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Distance from Earth:</span>
                <span className="text-white">{formatDistance(selectedObject.distanceFromEarth)}</span>
              </div>
              <p className="text-gray-500 text-xs">{explanation.distance}</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Travel Time:</span>
                <span className="text-space-gold">{getTravelTime()}</span>
              </div>
              <p className="text-gray-500 text-xs">At {(spacecraftSpeed * 100).toFixed(1)}% speed of light</p>
            </div>
          </div>
        </div>

        {/* Missions */}
        {selectedObject.missions && selectedObject.missions.length > 0 && (
          <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
            <h4 className="text-white font-medium mb-3">Notable Missions</h4>
            <div className="flex flex-wrap gap-2">
              {selectedObject.missions.map((mission, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-space-blue/30 text-white text-xs rounded-full"
                >
                  {mission}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
          <p className="text-gray-300 text-sm italic">"{selectedObject.description}"</p>
        </div>
      </div>
    </div>
  )
}

export default FastFacts