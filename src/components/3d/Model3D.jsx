import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Model3D = ({ object, showAtmosphere = true }) => {
  const meshRef = useRef()
  const atmosphereRef = useRef()
  
  // Safe object properties with defaults
  const safeObject = object || { type: 'planet', color: '#ffffff', name: 'default' }
  const objectType = safeObject.type || 'planet'
  const objectColor = safeObject.color || '#ffffff'
  const objectKey = safeObject.key || 'default'
  
  // Animation
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Rotate the object
    meshRef.current.rotation.y += delta * 0.1
    
    // Add pulsing effect for stars
    if (objectType === 'star') {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse)
    }
    
    // Add subtle wobble for black holes
    if (objectType === 'blackhole') {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    
    // Animate atmosphere
    if (atmosphereRef.current && showAtmosphere) {
      atmosphereRef.current.rotation.y += delta * 0.05
    }
  })

  // Calculate size based on object radius (scaled for visibility)
  const radius = safeObject.radius || 6371
  const size = Math.max(0.5, Math.min(3, radius / 6371 * 2))

  return (
    <group>
      {/* Simple 3D Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        {objectType === 'star' ? (
          <meshStandardMaterial 
            color={objectColor}
            emissive={objectColor}
            emissiveIntensity={0.4}
          />
        ) : objectType === 'blackhole' ? (
          <meshStandardMaterial 
            color="#000000"
            metalness={0.9}
            roughness={0.1}
          />
        ) : (
          <meshStandardMaterial 
            color={objectColor}
            metalness={0.2}
            roughness={0.7}
          />
        )}
      </mesh>
      
      {/* Atmosphere for planets */}
      {showAtmosphere && objectType === 'planet' && objectKey !== 'moon' && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.05, 32, 32]} />
          <meshBasicMaterial
            color={objectKey === 'earth' ? '#87CEEB' : '#FFA500'}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Saturn's rings */}
      {objectKey === 'saturn' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 2, 64]} />
          <meshBasicMaterial
            color="#FAD5A5"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Event horizon for black holes */}
      {objectType === 'blackhole' && (
        <mesh>
          <sphereGeometry args={[size * 1.5, 32, 32]} />
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Glow effect for stars */}
      {objectType === 'star' && (
        <mesh>
          <sphereGeometry args={[size * 1.3, 32, 32]} />
          <meshBasicMaterial
            color={objectColor}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default Model3D