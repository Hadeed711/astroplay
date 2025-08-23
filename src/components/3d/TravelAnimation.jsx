import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import Model3D from './Model3D'
import { celestialBodies } from '../../data/celestialBodies'
import { useAudio } from '../audio/AudioSystem'

const TravelAnimation = ({ selectedObject, visible, spacecraftSpeed }) => {
  const rocketRef = useRef()
  const lineRef = useRef()
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  
  // Audio system integration
  const { playSound, isEnabled } = useAudio()

  // Earth is always at origin, selected object positioned based on relative distance
  const earthPosition = [0, 0, 0]
  const targetPosition = [8, 0, 0] // Fixed distance for visualization

  // Calculate actual distance and travel time using light years
  const distance = selectedObject.distanceFromEarth || 0
  const distanceInLightYears = distance > 0 ? distance / 9.461e12 : 0 // Convert km to light years
  const travelTimeInYears = distanceInLightYears > 0 ? distanceInLightYears / spacecraftSpeed : 0 // Time in years
  const displayDistance = distanceInLightYears > 1000 ? 
    `${(distanceInLightYears / 1000).toFixed(1)} thousand light years` : 
    distanceInLightYears > 0 ? `${distanceInLightYears.toFixed(2)} light years` : "0 km (Same location)"

  // Play sound effect when animation starts
  useEffect(() => {
    if (visible && !hasPlayedSound) {
      // Use the AudioSystem to play the travel start sound
      if (isEnabled) {
        playSound('travel_start')
      }
      
      setHasPlayedSound(true)
      setIsAnimating(true)
      setAnimationProgress(0)
    }
    
    if (!visible) {
      setHasPlayedSound(false)
      setIsAnimating(false)
      setAnimationProgress(0)
    }
  }, [visible, hasPlayedSound, isEnabled, playSound])

  // Animation loop
  useFrame((state, delta) => {
    if (!visible || !isAnimating) return

    // Update animation progress
    setAnimationProgress(prev => {
      const newProgress = prev + delta * 0.2 // Animation speed
      if (newProgress >= 1) {
        setIsAnimating(false)
        // Play completion sound using AudioSystem
        if (isEnabled) {
          playSound('ui_click') // Using existing ui_click sound for completion
        }
        return 1
      }
      return newProgress
    })

    // Update rocket position
    if (rocketRef.current) {
      const progress = Math.min(animationProgress, 1)
      const x = earthPosition[0] + (targetPosition[0] - earthPosition[0]) * progress
      const y = earthPosition[1] + (targetPosition[1] - earthPosition[1]) * progress
      const z = earthPosition[2] + (targetPosition[2] - earthPosition[2]) * progress
      
      rocketRef.current.position.set(x, y, z)
      
      // Rotate rocket to face direction of travel
      const direction = new THREE.Vector3(
        targetPosition[0] - earthPosition[0],
        targetPosition[1] - earthPosition[1],
        targetPosition[2] - earthPosition[2]
      ).normalize()
      rocketRef.current.lookAt(
        rocketRef.current.position.x + direction.x,
        rocketRef.current.position.y + direction.y,
        rocketRef.current.position.z + direction.z
      )
    }
  })

  if (!visible) return null

  // Create line points for travel path
  const linePoints = [
    new THREE.Vector3(...earthPosition),
    new THREE.Vector3(...targetPosition)
  ]

  return (
    <group>
      {/* Earth */}
      <group position={earthPosition}>
        <Model3D key="earth-travel" object={celestialBodies.earth} showAtmosphere={true} />
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color="#4FC3F7"
          anchorX="center"
          anchorY="middle"
          depthTest={false}
          renderOrder={1000}
        >
          Earth
        </Text>
      </group>

      {/* Selected Object */}
      <group position={targetPosition}>
        <Model3D key={`${selectedObject.name}-travel`} object={selectedObject} showAtmosphere={true} />
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color="#4FC3F7"
          anchorX="center"
          anchorY="middle"
          depthTest={false}
          renderOrder={1000}
        >
          {selectedObject.name}
        </Text>
      </group>

      {/* Travel Line */}
      <Line
        ref={lineRef}
        points={linePoints}
        color="#00BCD4"
        lineWidth={2}
        dashed={false}
      />

      {/* Animated Travel Line (progress indicator) */}
      {animationProgress > 0 && (
        <Line
          points={[
            new THREE.Vector3(...earthPosition),
            new THREE.Vector3(
              earthPosition[0] + (targetPosition[0] - earthPosition[0]) * animationProgress,
              earthPosition[1] + (targetPosition[1] - earthPosition[1]) * animationProgress,
              earthPosition[2] + (targetPosition[2] - earthPosition[2]) * animationProgress
            )
          ]}
          color="#FFD700"
          lineWidth={4}
        />
      )}

      {/* Rocket */}
      <mesh ref={rocketRef} position={earthPosition}>
        {/* Simple rocket geometry */}
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshBasicMaterial color="#FF6B35" />
        
        {/* Rocket exhaust effect */}
        {isAnimating && (
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.05, 0.2, 6]} />
            <meshBasicMaterial color="#FF4500" transparent opacity={0.7} />
          </mesh>
        )}
      </mesh>

      {/* Distance and Time Information */}
      <Text
        position={[4, 3, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
        renderOrder={1000}
      >
        {`Distance: ${displayDistance}`}
      </Text>
      
      <Text
        position={[4, 2.5, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
        renderOrder={1000}
      >
        {`Speed: ${spacecraftSpeed.toFixed(2)}c`}
      </Text>
      
      <Text
        position={[4, 2, 0]}
        fontSize={0.3}
        color="#4FC3F7"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
        renderOrder={1000}
      >
        {travelTimeInYears > 1000000 ? 
          `Travel Time: ${(travelTimeInYears / 1000000).toFixed(1)} million years` :
          travelTimeInYears > 1000 ?
          `Travel Time: ${(travelTimeInYears / 1000).toFixed(1)} thousand years` :
          travelTimeInYears > 1 ?
          `Travel Time: ${travelTimeInYears.toFixed(1)} years` :
          `Travel Time: ${(travelTimeInYears * 365.25).toFixed(1)} days`
        }
      </Text>

      {/* Animation Status */}
      <Text
        position={[4, 1.5, 0]}
        fontSize={0.25}
        color={isAnimating ? "#00FF00" : "#FFD700"}
        anchorX="center"
        anchorY="middle"
        depthTest={false}
        renderOrder={1000}
      >
        {isAnimating ? "🚀 Traveling..." : animationProgress >= 1 ? "✅ Journey Complete!" : "🎯 Ready to Launch"}
      </Text>

      {/* Progress Bar */}
      <group position={[4, 1, 0]}>
        {/* Background bar */}
        <mesh>
          <boxGeometry args={[2, 0.1, 0.01]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        {/* Progress bar */}
        <mesh position={[-1 + animationProgress, 0, 0.01]}>
          <boxGeometry args={[2 * animationProgress, 0.1, 0.01]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      </group>
    </group>
  )
}

export default TravelAnimation