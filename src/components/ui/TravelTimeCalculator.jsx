import { useMemo } from 'react'
import useAppStore from '../../store/useAppStore'
import { calculateTravelTime, formatNumber } from '../../utils/physics'

const TravelTimeCalculator = () => {
  const { selectedObject, spacecraftSpeed } = useAppStore()

  const travelData = useMemo(() => {
    if (selectedObject.distanceFromEarth === 0) {
      return { isEarth: true }
    }

    const time = calculateTravelTime(selectedObject.distanceFromEarth, spacecraftSpeed)
    const speedKmH = spacecraftSpeed * 299792458 * 3.6 / 1000 // km/h
    const speedPercent = spacecraftSpeed * 100

    return {
      isEarth: false,
      time,
      speedKmH,
      speedPercent,
      distance: selectedObject.distanceFromEarth
    }
  }, [selectedObject, spacecraftSpeed])

  const formatTime = (time) => {
    if (time.years >= 1) {
      return `${formatNumber(time.years)} years`
    } else if (time.days >= 1) {
      return `${formatNumber(time.days)} days`
    } else if (time.hours >= 1) {
      return `${formatNumber(time.hours)} hours`
    } else {
      return `${formatNumber(time.minutes)} minutes`
    }
  }

  const formatDistance = (distance) => {
    if (distance > 9.461e12) {
      return `${(distance / 9.461e12).toFixed(2)} light years`
    } else if (distance > 1e9) {
      return `${formatNumber(distance / 1e6)} million km`
    }
    return `${formatNumber(distance)} km`
  }

  const getSpeedComparison = (speedPercent) => {
    if (speedPercent < 1) return "Slower than current spacecraft"
    if (speedPercent < 10) return "Advanced propulsion needed"
    if (speedPercent < 50) return "Relativistic speeds required"
    return "Near light speed - theoretical only"
  }

  if (travelData.isEarth) {
    return (
      <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <span className="mr-2">🚀</span>
          Travel Time Calculator
        </h4>
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🌍</div>
          <p className="text-space-gold font-medium">You are here!</p>
          <p className="text-gray-400 text-sm">No travel required to Earth</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-space-dark/50 rounded-lg border border-space-blue/20 p-4">
      <h4 className="text-white font-medium mb-3 flex items-center">
        <span className="mr-2">🚀</span>
        Travel Time Calculator
      </h4>
      
      <div className="space-y-3 text-sm">
        {/* Distance */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Distance:</span>
          <span className="text-white font-mono">{formatDistance(travelData.distance)}</span>
        </div>

        {/* Speed */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Speed:</span>
          <span className="text-space-gold font-mono">{travelData.speedPercent.toFixed(1)}% of c</span>
        </div>

        {/* Travel Time */}
        <div className="bg-space-blue/20 rounded p-3 border border-space-blue/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Travel Time:</span>
            <span className="text-space-gold font-bold text-lg">{formatTime(travelData.time)}</span>
          </div>
          
          {/* Detailed breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>Years: {formatNumber(travelData.time.years)}</div>
            <div>Days: {formatNumber(travelData.time.days)}</div>
            <div>Hours: {formatNumber(travelData.time.hours)}</div>
            <div>Minutes: {formatNumber(travelData.time.minutes)}</div>
          </div>
        </div>

        {/* Speed in km/h */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Speed (km/h):</span>
          <span className="text-white font-mono">{formatNumber(travelData.speedKmH)}</span>
        </div>

        {/* Feasibility indicator */}
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-xs text-gray-300">{getSpeedComparison(travelData.speedPercent)}</p>
        </div>

        {/* Fun facts */}
        <div className="border-t border-space-blue/20 pt-3">
          <p className="text-xs text-gray-400 mb-1">For comparison:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Voyager 1: ~17 km/s (0.006% of c)</div>
            <div>• Parker Solar Probe: ~200 km/s (0.07% of c)</div>
            <div>• Theoretical fusion rocket: ~10% of c</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelTimeCalculator