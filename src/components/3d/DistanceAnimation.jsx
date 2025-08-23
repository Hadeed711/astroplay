import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import useAppStore from '../../store/useAppStore'

// Simple sound effect function
const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  const createBeep = (frequency, duration) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }
  
  if (type === 'scan_start') {
    createBeep(800, 0.2)
  } else if (type === 'scan_progress') {
    createBeep(1000, 0.1)
  } else if (type === 'scan_complete') {
    createBeep(1200, 0.3)
    setTimeout(() => createBeep(1400, 0.2), 100)
  }
}

const DistanceAnimation = ({ fromObject, toObject, show }) => {
  const lineRef = useRef()
  const pulseRef = useRef()
  const [animationProgress, setAnimationProgress] = useState(0)
  const [distance, setDistance] = useState(0)
  
  const { distanceFromSurface } = useAppStore()

  useEffect(() => {
    if (show) {
      setAnimationProgress(0)
      playSound('scan_start')
      
      // Always start from Earth (0,0,0)
      const earthPos = [0, 0, 0]
      const targetPos = toObject.position
      
      // Calculate distance from Earth to target
      const dist = Math.sqrt(
        Math.pow(targetPos[0] - earthPos[0], 2) +
        Math.pow(targetPos[1] - earthPos[1], 2) +
        Math.pow(targetPos[2] - earthPos[2], 2)
      ) * 50000 + distanceFromSurface // Realistic scale in km
      setDistance(dist)
    }
  }, [show, toObject, distanceFromSurface])

  useFrame((state, delta) => {
    if (show && animationProgress < 1) {
      const newProgress = Math.min(animationProgress + delta * 0.8, 1)
      
      // Play progress sound at intervals
      if (Math.floor(newProgress * 10) > Math.floor(animationProgress * 10)) {
        playSound('scan_progress')
      }
      
      // Play completion sound
      if (newProgress >= 1 && animationProgress < 1) {
        playSound('scan_complete')
      }
      
      setAnimationProgress(newProgress)
    }
    
    // Pulse animation for the measurement point
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1
      pulseRef.current.scale.setScalar(pulse)
    }
  })

  if (!show) return null

  // Always start from Earth
  const startPoint = new THREE.Vector3(0, 0, 0)
  const endPoint = new THREE.Vector3(...toObject.position)
  
  // Animate the line drawing
  const currentEndPoint = startPoint.clone().lerp(endPoint, animationProgress)
  const points = [startPoint, currentEndPoint]

  // Calculate midpoint for distance label
  const midPoint = startPoint.clone().lerp(currentEndPoint, 0.5)
  
  // Format distance
  const formatDistance = (dist) => {
    if (dist > 1000000) {
      return `${(dist / 1000000).toFixed(2)} million km`
    } else if (dist > 1000) {
      return `${(dist / 1000).toFixed(1)}k km`
    } else {
      return `${dist.toFixed(0)} km`
    }
  }

  return (
    <group>
      {/* Animated measurement line */}
      <Line
        ref={lineRef}
        points={points}
        color="#00FF00"
        lineWidth={3}
        dashed={true}
        dashSize={0.1}
        gapSize={0.05}
      />
      
      {/* Start point marker */}
      <mesh position={startPoint}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* End point marker with pulse */}
      {animationProgress > 0.8 && (
        <mesh ref={pulseRef} position={currentEndPoint}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.7} />
        </mesh>
      )}
      
      {/* Distance label */}
      {animationProgress > 0.5 && (
        <Text
          position={[midPoint.x, midPoint.y + 0.5, midPoint.z]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          depthTest={false}
          renderOrder={1000}
        >
          {formatDistance(distance * animationProgress)}
        </Text>
      )}
      
      {/* Futuristic scanning effect */}
      {animationProgress < 1 && (
        <group>
          {/* Scanning beam */}
          <mesh position={currentEndPoint}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshBasicMaterial 
              color="#00FFFF" 
              emissive="#00FFFF" 
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
          
          {/* Expanding ring effect */}
          <mesh position={currentEndPoint} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.2, 16]} />
            <meshBasicMaterial 
              color="#00FFFF" 
              emissive="#00FFFF" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}
      
      {/* Completion effect */}
      {animationProgress >= 1 && (
        <group>
          {/* Success particles */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const radius = 0.3
            const x = currentEndPoint.x + Math.cos(angle) * radius
            const z = currentEndPoint.z + Math.sin(angle) * radius
            
            return (
              <mesh key={i} position={[x, currentEndPoint.y, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial 
                  color="#FFD700" 
                  emissive="#FFD700" 
                  emissiveIntensity={0.8}
                />
              </mesh>
            )
          })}
          
          {/* Data panel */}
          <group position={[midPoint.x, midPoint.y - 0.8, midPoint.z]}>
            <mesh>
              <planeGeometry args={[2, 0.8]} />
              <meshBasicMaterial 
                color="#000033" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <Text
              position={[0, 0.2, 0.01]}
              fontSize={0.15}
              color="#00FF00"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
              renderOrder={1000}
            >
              DISTANCE MEASURED
            </Text>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.2}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
              renderOrder={1000}
            >
              {formatDistance(distance)}
            </Text>
            <Text
              position={[0, -0.2, 0.01]}
              fontSize={0.12}
              color="#FFFF00"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
              renderOrder={1000}
            >
              Light travel time: {(distance / 299792.458).toFixed(3)}s
            </Text>
          </group>
        </group>
      )}
    </group>
  )
}

export default DistanceAnimation