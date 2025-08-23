import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

const RealisticCelestialBody = ({ object, showAtmosphere = true }) => {
  const meshRef = useRef()
  const atmosphereRef = useRef()
  
  // Load textures based on object type
  const textures = useMemo(() => {
    const textureMap = {
      earth: {
        map: '/textures/earth_day.jpg',
        normalMap: '/textures/earth_normal.jpg',
        specularMap: '/textures/earth_specular.jpg',
        cloudsMap: '/textures/earth_clouds.jpg'
      },
      mars: {
        map: '/textures/mars.jpg',
        normalMap: '/textures/mars_normal.jpg'
      },
      moon: {
        map: '/textures/moon.jpg',
        normalMap: '/textures/moon_normal.jpg'
      },
      sun: {
        map: '/textures/sun.jpg'
      },
      jupiter: {
        map: '/textures/jupiter.jpg'
      },
      saturn: {
        map: '/textures/saturn.jpg',
        ringMap: '/textures/saturn_rings.png'
      }
    }
    
    return textureMap[object.key] || { map: null }
  }, [object.key])

  // Create materials
  const material = useMemo(() => {
    if (object.type === 'star') {
      // Emissive material for stars
      return new THREE.MeshBasicMaterial({
        color: object.color || '#FDB813',
        emissive: object.color || '#FDB813',
        emissiveIntensity: 0.5
      })
    }
    
    if (object.type === 'blackhole') {
      // Dark material for black holes
      return new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 0.9
      })
    }
    
    // Standard material for planets
    const mat = new THREE.MeshPhongMaterial({
      color: object.color || '#ffffff'
    })
    
    // Add textures if available (in a real app, these would be actual texture files)
    if (textures.map) {
      // For now, use solid colors since we don't have actual texture files
      mat.color = new THREE.Color(object.color || '#ffffff')
    }
    
    return mat
  }, [object, textures])

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the object
      meshRef.current.rotation.y += delta * 0.1
      
      // Add pulsing effect for stars
      if (object.type === 'star') {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
        meshRef.current.scale.setScalar(pulse)
      }
      
      // Add subtle wobble for black holes
      if (object.type === 'blackhole') {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    }
    
    // Animate atmosphere
    if (atmosphereRef.current && showAtmosphere) {
      atmosphereRef.current.rotation.y += delta * 0.05
    }
  })

  // Calculate size based on object radius (scaled for visibility)
  const size = Math.max(0.5, Math.min(3, object.radius / 6371 * 2)) // Earth radius as reference

  return (
    <group>
      {/* Main celestial body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={material} />
      </mesh>
      
      {/* Atmosphere for planets */}
      {showAtmosphere && object.type === 'planet' && object.key !== 'moon' && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.05, 32, 32]} />
          <meshBasicMaterial
            color={object.key === 'earth' ? '#87CEEB' : '#FFA500'}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Saturn's rings */}
      {object.key === 'saturn' && (
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
      {object.type === 'blackhole' && (
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
      {object.type === 'star' && (
        <mesh>
          <sphereGeometry args={[size * 1.3, 32, 32]} />
          <meshBasicMaterial
            color={object.color || '#FDB813'}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default RealisticCelestialBody