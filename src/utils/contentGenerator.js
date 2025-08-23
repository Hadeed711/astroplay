import { calculateTravelTime, formatNumber, calculateEscapeVelocity, calculateSurfaceGravity } from './physics'

// Content templates for different explanation levels
export const generateObjectContent = (object, level = 'student') => {
  const content = {
    eli12: generateELI12Content(object),
    student: generateStudentContent(object),
    pro: generateProContent(object)
  }
  
  return content[level] || content.student
}

// ELI12 - Simple explanations for young learners
const generateELI12Content = (object) => {
  const templates = {
    planet: {
      description: `${object.name} is a big round ball in space! It's like a giant playground, but ${getELI12Comparison(object)}.`,
      gravity: `If you jumped on ${object.name}, you would ${getGravityELI12(object)}!`,
      escape: `To fly away from ${object.name} forever, a rocket needs to go super duper fast - ${object.escapeVelocity.toFixed(0)} kilometers every second!`,
      distance: object.distanceFromEarth === 0 ? "This is our home planet!" : `${object.name} is really, really far away - like ${getDistanceELI12(object)}!`,
      funFact: getELI12FunFact(object)
    },
    star: {
      description: `${object.name} is a giant ball of fire in space! It's like the biggest campfire ever, but ${getELI12Comparison(object)}.`,
      gravity: `${object.name} pulls things toward it really, really hard - ${object.surfaceGravity.toFixed(0)} times harder than Earth!`,
      escape: `To escape from ${object.name}, you'd need to go ${object.escapeVelocity.toFixed(0)} km/s - that's super fast!`,
      distance: object.distanceFromEarth === 0 ? "This keeps us warm!" : `${object.name} is so far that light takes ${(object.distanceFromEarth / 9.461e12).toFixed(1)} years to reach us!`,
      funFact: getELI12FunFact(object)
    },
    compact: {
      description: `${object.name} is the weirdest thing in space! It's ${getELI12Comparison(object)}.`,
      gravity: `${object.name} pulls so hard that ${getCompactGravityELI12(object)}!`,
      escape: `Nothing can escape from ${object.name} - not even light! That's why it's so special.`,
      distance: `${object.name} is incredibly far away - ${(object.distanceFromEarth / 9.461e12).toFixed(0)} thousand years of travel with light!`,
      funFact: getELI12FunFact(object)
    }
  }
  
  return templates[object.type] || templates.planet
}

// Student - Educational content for students
const generateStudentContent = (object) => {
  const templates = {
    planet: {
      description: `${object.name} is a ${object.type} with a radius of ${formatNumber(object.radius)} km and mass of ${formatNumber(object.mass)} kg.`,
      gravity: `Surface gravity is ${object.surfaceGravity.toFixed(2)} m/s², which means objects fall ${getGravityComparison(object)} compared to Earth.`,
      escape: `Escape velocity is ${object.escapeVelocity.toFixed(2)} km/s. This is the minimum speed needed to overcome gravitational binding energy.`,
      distance: object.distanceFromEarth === 0 ? "Earth is our reference point for all distance measurements." : `Located ${formatNumber(object.distanceFromEarth)} km from Earth (${(object.distanceFromEarth / 9.461e12).toFixed(2)} light years).`,
      funFact: getStudentFunFact(object),
      formation: getFormationInfo(object),
      exploration: getExplorationHistory(object)
    },
    star: {
      description: `${object.name} is a ${object.type} powered by nuclear fusion, converting hydrogen to helium in its core.`,
      gravity: `Surface gravity of ${object.surfaceGravity.toFixed(2)} m/s² creates extreme conditions at the stellar surface.`,
      escape: `Escape velocity of ${object.escapeVelocity.toFixed(2)} km/s demonstrates the immense gravitational well of stellar objects.`,
      distance: object.distanceFromEarth === 0 ? "Our Sun is the closest star and source of Earth's energy." : `Distance of ${(object.distanceFromEarth / 9.461e12).toFixed(2)} light years makes it one of our nearest stellar neighbors.`,
      funFact: getStudentFunFact(object),
      lifecycle: getStarLifecycle(object),
      energy: getEnergyOutput(object)
    },
    compact: {
      description: `${object.name} represents the extreme endpoint of stellar evolution, where matter exists in exotic states.`,
      gravity: `Gravitational field strength of ${formatNumber(object.surfaceGravity)} m/s² creates relativistic effects.`,
      escape: `Escape velocity approaches the speed of light (${formatNumber(object.escapeVelocity)} km/s), demonstrating extreme spacetime curvature.`,
      distance: `Located ${(object.distanceFromEarth / 9.461e12).toFixed(0)} light years away, representing the most extreme objects in our galaxy.`,
      funFact: getStudentFunFact(object),
      physics: getCompactPhysics(object),
      detection: getDetectionMethods(object)
    }
  }
  
  return templates[object.type] || templates.planet
}

// Professional - Technical details for experts
const generateProContent = (object) => {
  const schwarzschildRadius = object.type === 'compact' ? 
    (2 * 6.67430e-11 * object.mass / (299792458 * 299792458) / 1000).toFixed(3) : null
    
  const templates = {
    planet: {
      description: `${object.name}: Terrestrial body with mean radius R = ${object.radius} km, mass M = ${object.mass.toExponential(3)} kg, bulk density ρ ≈ ${(object.mass / ((4/3) * Math.PI * Math.pow(object.radius * 1000, 3))).toFixed(0)} kg/m³.`,
      gravity: `Surface gravitational acceleration g = GM/R² = ${object.surfaceGravity.toFixed(3)} m/s². Gravitational parameter μ = ${(6.67430e-11 * object.mass).toExponential(3)} m³/s².`,
      escape: `Escape velocity v_esc = √(2GM/R) = ${object.escapeVelocity.toFixed(3)} km/s. Gravitational binding energy U = -GM²/R = ${(-6.67430e-11 * object.mass * object.mass / (object.radius * 1000)).toExponential(3)} J.`,
      distance: object.distanceFromEarth === 0 ? "Reference frame: Earth-centered inertial coordinate system." : `Heliocentric distance: ${object.distanceFromEarth.toExponential(3)} km. Parallax: ${(1 / (object.distanceFromEarth / 9.461e12)).toExponential(3)} arcseconds.`,
      funFact: getProFunFact(object),
      orbital: getOrbitalMechanics(object),
      composition: getComposition(object)
    },
    star: {
      description: `${object.name}: Main sequence star, spectral class ${getSpectralClass(object)}, effective temperature T_eff ≈ ${getEffectiveTemp(object)} K, luminosity L ≈ ${getLuminosity(object)} L_☉.`,
      gravity: `Surface gravity log g = ${Math.log10(object.surfaceGravity * 100).toFixed(2)} (cgs). Photospheric scale height H = kT/(μg) ≈ ${getScaleHeight(object)} km.`,
      escape: `Escape velocity v_esc = ${object.escapeVelocity.toFixed(2)} km/s. Virial temperature T_vir = GMm_p/(3kR) ≈ ${getVirialTemp(object)} K.`,
      distance: object.distanceFromEarth === 0 ? "Heliocentric reference frame, distance modulus μ = 0." : `Distance modulus μ = 5 log(d/10pc) = ${(5 * Math.log10(object.distanceFromEarth / (9.461e12 * 10))).toFixed(2)} mag.`,
      funFact: getProFunFact(object),
      nucleosynthesis: getNucleosynthesis(object),
      evolution: getStellarEvolution(object)
    },
    compact: {
      description: `${object.name}: Compact object with M = ${(object.mass / 1.989e30).toFixed(2)} M_☉, R = ${object.radius} km. ${schwarzschildRadius ? `Schwarzschild radius r_s = ${schwarzschildRadius} km.` : ''}`,
      gravity: `Surface gravity g = ${object.surfaceGravity.toExponential(3)} m/s². Gravitational redshift z = √(1 - r_s/R) - 1 ≈ ${getGravitationalRedshift(object).toFixed(6)}.`,
      escape: `Escape velocity v_esc = c√(2GM/Rc²) = ${(object.escapeVelocity / 299792.458).toFixed(4)}c. Event horizon at r_s = 2GM/c².`,
      distance: `Luminosity distance d_L = ${(object.distanceFromEarth / 9.461e12).toFixed(1)} kpc. Angular diameter distance d_A = d_L/(1+z)².`,
      funFact: getProFunFact(object),
      relativity: getRelativisticEffects(object),
      thermodynamics: getCompactThermodynamics(object)
    }
  }
  
  return templates[object.type] || templates.planet
}

// Helper functions for content generation
const getELI12Comparison = (object) => {
  const comparisons = {
    earth: "it's our home where we live",
    mars: "it's red like rust and smaller than Earth",
    jupiter: "it's so big that all the other planets could fit inside it",
    sun: "a million times bigger than Earth",
    neutronStar: "smaller than a city but heavier than the Sun",
    blackHole: "so heavy that it bends space like a trampoline",
    proximaCentauri: "much smaller and cooler than our Sun"
  }
  return comparisons[object.name.toLowerCase().replace(/\s+/g, '')] || "very different from Earth"
}

const getGravityELI12 = (object) => {
  const ratio = object.surfaceGravity / 9.81
  if (ratio < 0.5) return "float around like an astronaut"
  if (ratio < 1) return "feel lighter and jump higher"
  if (ratio > 2) return "feel very heavy and have trouble walking"
  return "feel about the same as on Earth"
}

const getDistanceELI12 = (object) => {
  const lightYears = object.distanceFromEarth / 9.461e12
  if (lightYears < 1) return "going around Earth millions of times"
  if (lightYears < 10) return `${lightYears.toFixed(0)} years for light to travel there`
  return `${lightYears.toFixed(0)} thousand years even for light`
}

const getELI12FunFact = (object) => {
  const facts = {
    earth: "Earth is the only planet we know with pizza and ice cream!",
    mars: "Mars has the biggest volcano in our solar system - it's three times taller than Mount Everest!",
    jupiter: "Jupiter is like Earth's big brother - it protects us from space rocks!",
    sun: "The Sun is so hot that it could melt anything instantly!",
    neutronStar: "A teaspoon of neutron star would weigh as much as a mountain!",
    blackHole: "Black holes are like cosmic vacuum cleaners that suck up everything!",
    proximaCentauri: "This star is our closest neighbor, but it would still take 4 years to get there with light!"
  }
  return facts[object.name.toLowerCase().replace(/\s+/g, '')] || "This object is amazing and unique in space!"
}

const getGravityComparison = (object) => {
  const ratio = object.surfaceGravity / 9.81
  if (ratio < 0.5) return `${ratio.toFixed(1)} times weaker`
  if (ratio > 1) return `${ratio.toFixed(1)} times stronger`
  return "about the same strength"
}

const getStudentFunFact = (object) => {
  const facts = {
    earth: "Earth's magnetic field protects us from harmful solar radiation and creates the beautiful aurora displays.",
    mars: "Mars has seasons like Earth because its axis is tilted at 25 degrees, similar to Earth's 23.5 degrees.",
    jupiter: "Jupiter's Great Red Spot is a storm that has been raging for over 400 years and is larger than Earth.",
    sun: "The Sun converts 4 million tons of matter into energy every second through nuclear fusion.",
    neutronStar: "Neutron stars can spin up to 700 times per second and have magnetic fields trillions of times stronger than Earth's.",
    blackHole: "Black holes don't actually 'suck' - they bend spacetime so severely that nothing can escape once past the event horizon.",
    proximaCentauri: "Proxima Centauri is a red dwarf star that will live for trillions of years, much longer than our Sun."
  }
  return facts[object.name.toLowerCase().replace(/\s+/g, '')] || "This celestial object has unique properties that make it fascinating to study."
}

const getProFunFact = (object) => {
  const facts = {
    earth: "Earth's core generates a magnetic dipole field with strength ~25-65 μT at the surface, reversing polarity every 200,000-300,000 years.",
    mars: "Mars lacks a global magnetic field due to core solidification ~4 Ga ago, resulting in atmospheric loss via solar wind stripping.",
    jupiter: "Jupiter's magnetosphere extends 1-3 million km sunward and creates synchrotron radiation detectable at radio wavelengths.",
    sun: "Solar core reaches 15.7 million K, enabling p-p chain fusion with energy transport via radiation zone and convection zone.",
    neutronStar: "Neutron star matter exists at 2-5× nuclear density, potentially containing exotic phases like quark matter or kaon condensates.",
    blackHole: "Schwarzschild metric describes spacetime geometry: ds² = -(1-2GM/rc²)dt² + (1-2GM/rc²)⁻¹dr² + r²dΩ².",
    proximaCentauri: "Proxima Centauri exhibits flare activity with X-ray luminosity variations of 10²-10³, affecting planetary habitability."
  }
  return facts[object.name.toLowerCase().replace(/\s+/g, '')] || "This object represents a unique astrophysical laboratory for testing physical theories."
}

// Additional helper functions (simplified for brevity)
const getFormationInfo = (object) => `Formed ~4.6 billion years ago through accretion in the solar nebula.`
const getExplorationHistory = (object) => `Multiple robotic missions have studied ${object.name}, providing detailed surface and atmospheric data.`
const getStarLifecycle = (object) => `Currently in main sequence phase, fusing hydrogen to helium in core.`
const getEnergyOutput = (object) => `Radiates energy through nuclear fusion at rate of ~3.8×10²⁶ watts.`
const getCompactPhysics = (object) => `Governed by general relativity and quantum mechanics under extreme conditions.`
const getDetectionMethods = (object) => `Detected through gravitational effects, X-ray emissions, or gravitational waves.`
const getSpectralClass = (object) => object.name.includes('Sun') ? 'G2V' : 'M5.5Ve'
const getEffectiveTemp = (object) => object.name.includes('Sun') ? '5778' : '3042'
const getLuminosity = (object) => object.name.includes('Sun') ? '1.0' : '0.0017'
const getScaleHeight = (object) => '500'
const getVirialTemp = (object) => '2×10⁷'
const getNucleosynthesis = (object) => `Primary fusion process: p-p chain (H → He)`
const getStellarEvolution = (object) => `Main sequence lifetime: ~10¹⁰ years`
const getGravitationalRedshift = (object) => 0.0001
const getRelativisticEffects = (object) => `Frame dragging, gravitational lensing, time dilation effects significant.`
const getCompactThermodynamics = (object) => `Hawking temperature T_H = ħc³/(8πGMk_B) for black holes.`
const getOrbitalMechanics = (object) => `Keplerian orbital elements define motion in gravitational field.`
const getComposition = (object) => `Primarily silicate rock and iron core with thin atmosphere.`
const getCompactGravityELI12 = (object) => object.name.includes('Black Hole') ? 
  "not even light can escape" : "it squishes atoms together super tight"

export default {
  generateObjectContent,
  generateELI12Content,
  generateStudentContent,
  generateProContent
}