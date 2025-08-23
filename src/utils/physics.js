// Physics calculations for space exploration

export const SPEED_OF_LIGHT = 299792458 // m/s
export const GRAVITATIONAL_CONSTANT = 6.67430e-11 // m³/kg⋅s²

/**
 * Calculate escape velocity for a celestial body
 * v_e = √(2GM/r)
 */
export const calculateEscapeVelocity = (mass, radius) => {
  return Math.sqrt((2 * GRAVITATIONAL_CONSTANT * mass) / (radius * 1000)) / 1000 // km/s
}

/**
 * Calculate surface gravity
 * g = GM/r²
 */
export const calculateSurfaceGravity = (mass, radius) => {
  return (GRAVITATIONAL_CONSTANT * mass) / Math.pow(radius * 1000, 2) // m/s²
}

/**
 * Calculate travel time between two points
 * @param {number} distance - Distance in km
 * @param {number} speed - Speed as fraction of light speed (0-1)
 * @returns {object} Time in various units
 */
export const calculateTravelTime = (distance, speedFraction) => {
  const speedKmS = SPEED_OF_LIGHT * speedFraction / 1000 // km/s
  const timeSeconds = distance / speedKmS
  
  return {
    seconds: timeSeconds,
    minutes: timeSeconds / 60,
    hours: timeSeconds / 3600,
    days: timeSeconds / 86400,
    years: timeSeconds / (365.25 * 86400)
  }
}

/**
 * Calculate orbital velocity at given altitude
 * v = √(GM/(r+h))
 */
export const calculateOrbitalVelocity = (mass, radius, altitude) => {
  const orbitalRadius = (radius + altitude) * 1000 // convert to meters
  return Math.sqrt((GRAVITATIONAL_CONSTANT * mass) / orbitalRadius) / 1000 // km/s
}

/**
 * Calculate Schwarzschild radius (event horizon) for black holes
 * r_s = 2GM/c²
 */
export const calculateSchwarzschildRadius = (mass) => {
  return (2 * GRAVITATIONAL_CONSTANT * mass) / Math.pow(SPEED_OF_LIGHT, 2) / 1000 // km
}

/**
 * Format large numbers for display
 */
export const formatNumber = (num, precision = 2) => {
  if (num >= 1e12) return (num / 1e12).toFixed(precision) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(precision) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(precision) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(precision) + 'K'
  return num.toFixed(precision)
}

/**
 * Calculate gravitational time dilation factor
 * Using the formula: √(1 - 2GM/rc²)
 * Returns the time dilation factor (0-1, where 1 is no dilation)
 */
export const calculateTimeDilation = (mass, radius, distance = 0) => {
  const c = SPEED_OF_LIGHT
  const G = GRAVITATIONAL_CONSTANT
  
  // Distance from center (radius + distance from surface)
  const r = (radius + distance) * 1000 // convert to meters
  
  // Schwarzschild factor
  const schwarzschildFactor = (2 * G * mass) / (r * c * c)
  
  // Avoid negative values under square root (inside event horizon)
  if (schwarzschildFactor >= 1) {
    return 0 // Extreme time dilation at event horizon
  }
  
  // Time dilation factor
  const dilationFactor = Math.sqrt(1 - schwarzschildFactor)
  
  return Math.max(0, Math.min(1, dilationFactor))
}

/**
 * Calculate proper time vs coordinate time difference
 * Returns percentage of time slowdown
 */
export const calculateTimeSlowdown = (mass, radius, distance = 0) => {
  const dilationFactor = calculateTimeDilation(mass, radius, distance)
  return (1 - dilationFactor) * 100
}

/**
 * Convert units for display
 */
export const convertUnits = {
  kmToLightYears: (km) => km / 9.461e12,
  lightYearsToKm: (ly) => ly * 9.461e12,
  kgToSolarMasses: (kg) => kg / 1.989e30,
  solarMassesToKg: (sm) => sm * 1.989e30
}