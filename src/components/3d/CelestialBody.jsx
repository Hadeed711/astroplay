import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Ring, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const CelestialBody = ({ object, showEventHorizon = true }) => {
  const meshRef = useRef()
  const ringRef = useRef()
  
  // Load 3D model with fallback
  const modelPath = object?.modelFile ? `/src/assets/models/${object.modelFile}` : null
  let gltf = null
  let isLoaded = false
  
  try {
    if (modelPath) {
      gltf = useGLTF(modelPath)
      isLoaded = !!gltf
    }
  } catch (error) {
    console.warn(`Failed to load model for ${object?.name}:`, error)
    gltf = null
    isLoaded = false
  }

  // Calculate relative size for display (not to scale, for visibility)
  const displayRadius = useMemo(() => {
    const baseRadius = 1
    if (object.type === 'planet' || object.type === 'moon') {
      return baseRadius * (1 + Math.log10(object.radius) / 10) // Logarithmic scaling
    } else if (object.type === 'star') {
      return baseRadius * 2.5 // Stars bigger
    } else if (object.type === 'compact' || object.type === 'neutron_star') {
      return baseRadius * 0.8 // Compact objects smaller but visible
    } else if (object.type === 'blackhole') {
      return baseRadius * 1.2 // Black holes medium size
    } else if (object.type === 'white_dwarf') {
      return baseRadius * 0.6 // White dwarfs small
    }
    return baseRadius
  }, [object])

  // Animation based on object type
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation based on object type
      if (object.type === 'planet') {
        meshRef.current.rotation.y += delta * 0.3
      } else if (object.type === 'star') {
        meshRef.current.rotation.y += delta * 0.2
        // Subtle pulsing for stars
        const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
        meshRef.current.scale.setScalar(scale)
      } else if (object.type === 'compact') {
        if (object.name.includes('Neutron')) {
          // Very fast rotation for neutron stars
          meshRef.current.rotation.y += delta * 8
          // Electromagnetic pulse effect
          const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.2 + 1
          meshRef.current.scale.setScalar(pulse)
        } else if (object.name.includes('Black Hole')) {
          // Slow, ominous rotation
          meshRef.current.rotation.y += delta * 0.1
          // Gravitational lensing effect
          const lensing = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
          meshRef.current.scale.setScalar(lensing)
        }
      }
    }

    // Animate event horizon ring for black holes
    if (ringRef.current && object.name.includes('Black Hole')) {
      ringRef.current.rotation.z += delta * 3
      // Accretion disk shimmer
      const shimmer = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2
      ringRef.current.material.opacity = shimmer
    }
  })

  // Create material based on object type
  const material = useMemo(() => {
    if (object.name.includes('Black Hole')) {
      return new THREE.MeshBasicMaterial({ 
        color: '#000000',
        transparent: true,
        opacity: 0.9
      })
    } else if (object.type === 'compact') {
      return new THREE.MeshStandardMaterial({ 
        color: object.color,
        emissive: object.color,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2
      })
    } else if (object.type === 'star') {
      return new THREE.MeshStandardMaterial({ 
        color: object.color,
        emissive: object.color,
        emissiveIntensity: 0.5
      })
    } else {
      return new THREE.MeshStandardMaterial({ 
        color: object.color,
        metalness: 0.1,
        roughness: 0.8
      })
    }
  }, [object])

  return (
    <group>
      {/* Main celestial body */}
      <mesh ref={meshRef} scale={[displayRadius, displayRadius, displayRadius]}>
        {isLoaded && gltf?.scene ? (
          <primitive object={gltf.scene.clone()} />
        ) : (
          <>
            <sphereGeometry args={[1, 16, 16]} />
            {object?.type === 'star' ? (
              <meshBasicMaterial 
                color={object.color || '#ffff00'} 
                emissive={object.color || '#ffff00'}
                emissiveIntensity={0.3}
              />
            ) : object?.type === 'blackhole' ? (
              <meshBasicMaterial 
                color="#000000" 
                transparent 
                opacity={0.8} 
              />
            ) : (
              <meshStandardMaterial 
                color={object?.color || '#ffffff'} 
                metalness={0.1} 
                roughness={0.7} 
              />
            )}
          </>
        )}
      </mesh>
      
      {/* Event horizon ring for black holes */}
      {object.name.includes('Black Hole') && showEventHorizon && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[displayRadius * 1.2, displayRadius * 1.5, 32]} />
          <meshBasicMaterial 
            color="#ff6b35" 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Glow effect for stars */}
      {object.type === 'star' && (
        <mesh>
          <sphereGeometry args={[displayRadius * 1.3, 16, 16]} />
          <meshBasicMaterial 
            color={object.color} 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

// Add the useObjectModel function directly here
export const useObjectModel = (object) => {
  if (!object) {
    return {
      model: null,
      isLoaded: false
    }
  }

  // For now, just return fallback data since we're not loading 3D models
  return {
    model: null,
    isLoaded: false
  }
}

export default CelestialBody