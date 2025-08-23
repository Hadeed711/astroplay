import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const AdvancedParticleSystem = ({ object, type, visible }) => {
  const particlesRef = useRef()
  const timeRef = useRef(0)

  // Create particle system based on type and object
  const particleSystem = useMemo(() => {
    if (!visible) return null

    const count = getParticleCount(type, object)
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      initializeParticle(i, positions, velocities, lifetimes, colors, sizes, type, object)
    }

    return {
      count,
      positions,
      velocities,
      lifetimes,
      colors,
      sizes,
      maxLifetime: getMaxLifetime(type)
    }
  }, [visible, type, object])

  const getParticleCount = (type, object) => {
    switch (type) {
      case 'stellar_wind': return object.type === 'star' ? 200 : 0
      case 'accretion_disk': return object.type === 'blackhole' ? 300 : 0
      case 'magnetic_field': return object.type === 'neutron_star' ? 150 : 0
      case 'atmospheric': return object.type === 'planet' ? 100 : 0
      case 'cosmic_rays': return 80
      default: return 0
    }
  }

  const getMaxLifetime = (type) => {
    switch (type) {
      case 'stellar_wind': return 5.0
      case 'accretion_disk': return 8.0
      case 'magnetic_field': return 6.0
      case 'atmospheric': return 4.0
      case 'cosmic_rays': return 10.0
      default: return 5.0
    }
  }

  const initializeParticle = (index, positions, velocities, lifetimes, colors, sizes, type, object) => {
    const i3 = index * 3
    
    switch (type) {
      case 'stellar_wind':
        // Radial emission from star surface
        const angle = Math.random() * Math.PI * 2
        const elevation = (Math.random() - 0.5) * Math.PI
        const startRadius = 1.2
        
        positions[i3] = Math.cos(angle) * Math.cos(elevation) * startRadius
        positions[i3 + 1] = Math.sin(angle) * Math.cos(elevation) * startRadius
        positions[i3 + 2] = Math.sin(elevation) * startRadius
        
        velocities[i3] = positions[i3] * 0.5
        velocities[i3 + 1] = positions[i3 + 1] * 0.5
        velocities[i3 + 2] = positions[i3 + 2] * 0.5
        
        colors[i3] = 1.0      // Red
        colors[i3 + 1] = 0.8  // Green
        colors[i3 + 2] = 0.3  // Blue
        break

      case 'accretion_disk':
        // Spiral motion around black hole
        const diskAngle = Math.random() * Math.PI * 2
        const diskRadius = 1.5 + Math.random() * 2
        
        positions[i3] = Math.cos(diskAngle) * diskRadius
        positions[i3 + 1] = Math.sin(diskAngle) * diskRadius
        positions[i3 + 2] = (Math.random() - 0.5) * 0.2
        
        // Orbital velocity
        const orbitalSpeed = 0.8 / Math.sqrt(diskRadius)
        velocities[i3] = -Math.sin(diskAngle) * orbitalSpeed
        velocities[i3 + 1] = Math.cos(diskAngle) * orbitalSpeed
        velocities[i3 + 2] = 0
        
        colors[i3] = 1.0      // Orange-red
        colors[i3 + 1] = 0.4
        colors[i3 + 2] = 0.0
        break

      case 'magnetic_field':
        // Field lines around neutron star
        const fieldAngle = Math.random() * Math.PI * 2
        const fieldRadius = 2 + Math.random() * 3
        
        positions[i3] = Math.cos(fieldAngle) * fieldRadius
        positions[i3 + 1] = Math.sin(fieldAngle) * fieldRadius
        positions[i3 + 2] = (Math.random() - 0.5) * 4
        
        velocities[i3] = 0
        velocities[i3 + 1] = 0
        velocities[i3 + 2] = Math.sign(positions[i3 + 2]) * 0.3
        
        colors[i3] = 0.0      // Cyan
        colors[i3 + 1] = 1.0
        colors[i3 + 2] = 1.0
        break

      case 'atmospheric':
        // Atmospheric particles around planet
        const atmAngle = Math.random() * Math.PI * 2
        const atmRadius = 1.1 + Math.random() * 0.3
        
        positions[i3] = Math.cos(atmAngle) * atmRadius
        positions[i3 + 1] = Math.sin(atmAngle) * atmRadius
        positions[i3 + 2] = (Math.random() - 0.5) * 0.5
        
        velocities[i3] = -Math.sin(atmAngle) * 0.1
        velocities[i3 + 1] = Math.cos(atmAngle) * 0.1
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05
        
        colors[i3] = 0.5
        colors[i3 + 1] = 0.8
        colors[i3 + 2] = 1.0
        break

      case 'cosmic_rays':
        // High-energy particles from deep space
        positions[i3] = (Math.random() - 0.5) * 10
        positions[i3 + 1] = (Math.random() - 0.5) * 10
        positions[i3 + 2] = (Math.random() - 0.5) * 10
        
        velocities[i3] = (Math.random() - 0.5) * 2
        velocities[i3 + 1] = (Math.random() - 0.5) * 2
        velocities[i3 + 2] = (Math.random() - 0.5) * 2
        
        colors[i3] = 0.8
        colors[i3 + 1] = 0.3
        colors[i3 + 2] = 1.0
        break
    }
    
    lifetimes[index] = Math.random() * getMaxLifetime(type)
    sizes[index] = 0.02 + Math.random() * 0.08
  }

  // Animate particles
  useFrame((state, delta) => {
    if (!visible || !particlesRef.current || !particleSystem) return

    timeRef.current += delta
    const { positions, velocities, lifetimes, colors, sizes } = particleSystem

    for (let i = 0; i < particleSystem.count; i++) {
      const i3 = i * 3
      
      // Update lifetime
      lifetimes[i] -= delta
      
      // Reset particle if lifetime expired
      if (lifetimes[i] <= 0) {
        initializeParticle(i, positions, velocities, lifetimes, colors, sizes, type, object)
        continue
      }
      
      // Update position based on velocity
      positions[i3] += velocities[i3] * delta
      positions[i3 + 1] += velocities[i3 + 1] * delta
      positions[i3 + 2] += velocities[i3 + 2] * delta
      
      // Apply forces based on particle type
      if (type === 'accretion_disk') {
        // Spiral inward toward black hole
        const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2)
        if (distance > 0.1) {
          const gravityForce = 0.5 / (distance ** 2)
          velocities[i3] -= (positions[i3] / distance) * gravityForce * delta
          velocities[i3 + 1] -= (positions[i3 + 1] / distance) * gravityForce * delta
        }
      }
      
      // Fade particles based on lifetime
      const lifetimeRatio = lifetimes[i] / getMaxLifetime(type)
      const alpha = Math.min(lifetimeRatio * 2, 1) * Math.min((1 - lifetimeRatio) * 2, 1)
      sizes[i] = (0.02 + Math.random() * 0.08) * alpha
    }

    // Update buffers
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true
    particlesRef.current.geometry.attributes.size.needsUpdate = true
  })

  if (!visible || !particleSystem) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleSystem.count}
          array={particleSystem.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleSystem.count}
          array={particleSystem.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleSystem.count}
          array={particleSystem.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        alphaTest={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default AdvancedParticleSystem
