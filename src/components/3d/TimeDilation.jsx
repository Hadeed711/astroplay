import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { calculateTimeSlowdown } from '../../utils/physics'

const TimeDilation = ({ object, visible, distance = 0 }) => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.001
    }
  })

  if (!visible || !object) return null

  // Calculate authentic time dilation using object's mass and radius
  const timeSlowdown = calculateTimeSlowdown(object.mass, object.radius, distance)
  
  // Determine color based on dilation severity
  const getColorByDilation = (slowdown) => {
    if (slowdown > 50) return "#FF0000" // Red for extreme dilation
    if (slowdown > 10) return "#FF4500" // Orange for high dilation
    if (slowdown > 1) return "#FFD700"  // Gold for moderate dilation
    return "#00FFFF" // Cyan for minimal dilation
  }

  const dilationColor = getColorByDilation(timeSlowdown)

  return (
    <group ref={groupRef}>
      {/* Time dilation visualization rings */}
      {[1, 2, 3, 4].map((ring, index) => (
        <mesh key={index} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring * 1.2, ring * 1.2 + 0.08, 64]} />
          <meshBasicMaterial
            color={dilationColor}
            transparent
            opacity={0.4 - index * 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Pulsing central effect for extreme dilation */}
      {timeSlowdown > 20 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial
            color={dilationColor}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Time dilation info */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.35}
        color={dilationColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        depthTest={false}
        renderOrder={1000}
      >
        {timeSlowdown > 99.9 ? "Time Nearly Frozen" : 
         timeSlowdown > 50 ? `Time ${timeSlowdown.toFixed(1)}% Slower` :
         timeSlowdown > 1 ? `Time ${timeSlowdown.toFixed(2)}% Slower` :
         timeSlowdown > 0.01 ? `Time ${timeSlowdown.toFixed(3)}% Slower` :
         "Minimal Time Dilation"}
      </Text>
      
      {/* Additional physics info for extreme cases */}
      {timeSlowdown > 50 && (
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          depthTest={false}
          renderOrder={1000}
        >
          Approaching Event Horizon
        </Text>
      )}
      
      {object.type === 'blackhole' && (
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.18}
          color="#FF6B6B"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          depthTest={false}
          renderOrder={1000}
        >
          Schwarzschild Radius: {(object.schwarzschildRadius || object.radius).toFixed(2)} km
        </Text>
      )}
    </group>
  )
}

export default TimeDilation