import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GravityField = ({ object, visible }) => {
  const linesRef = useRef()
  const particlesRef = useRef()

  // Create gravity field lines
  const fieldLines = useMemo(() => {
    if (!visible || !object) return null

    const lines = []
    
    // Object-specific parameters
    const objectRadius = object.radius ? Math.max(0.8, Math.min(2.5, object.radius / 6371)) : 1
    const surfaceGravity = object.surfaceGravity || 9.8
    const gravityStrength = Math.log10(surfaceGravity / 9.8 + 1) * 0.5 + 1
    
    // Adaptive parameters based on object properties
    const numLines = object.type === 'blackhole' ? 20 : 
                    object.type === 'planet' ? 16 : 
                    object.type === 'star' ? 18 : 12
    
    const fieldExtension = object.type === 'blackhole' ? 8 :
                          object.type === 'star' ? 6 :
                          object.type === 'planet' ? 5 : 4
    
    const poleHeight = objectRadius * 1.5

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2
      const points = []
      
      // Create smooth field lines with object-specific curvature
      const numPoints = 30 // More points for smoother curves
      for (let j = 0; j < numPoints; j++) {
        const t = j / (numPoints - 1)
        
        // Smooth curve function for natural field line shape
        const curveIntensity = Math.sin(t * Math.PI) // 0 to 1 to 0
        const fieldRadius = objectRadius + curveIntensity * fieldExtension * gravityStrength
        
        // Smooth transition from pole to pole
        const x = Math.cos(angle) * fieldRadius * curveIntensity * 0.8
        const y = poleHeight - t * (poleHeight * 2) // Smooth top to bottom
        const z = Math.sin(angle) * fieldRadius * curveIntensity * 0.8
        
        points.push(new THREE.Vector3(x, y, z))
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      lines.push(geometry)
    }
    
    return lines
  }, [visible, object])

  // Create test particles
  const particles = useMemo(() => {
    if (!visible) return null

    const particlePositions = []
    const particleVelocities = []
    const numParticles = 8

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 3 + Math.random() * 4
      
      particlePositions.push(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        (Math.random() - 0.5) * 2
      )
      
      // Initial velocity (will be modified by gravity)
      particleVelocities.push(0, 0, 0)
    }

    return {
      positions: new Float32Array(particlePositions),
      velocities: new Float32Array(particleVelocities)
    }
  }, [visible])

  // Animate particles falling toward the object
  useFrame((state, delta) => {
    if (!visible || !particlesRef.current || !particles) return

    try {
      const positions = particlesRef.current.geometry.attributes.position.array
      const numParticles = positions.length / 3

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]

        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z)
        
        // Reset particle if it gets too close or too far
        if (distance < 1.2 || distance > 8) {
          const angle = Math.random() * Math.PI * 2
          const newDistance = 3 + Math.random() * 4
          positions[i3] = Math.cos(angle) * newDistance
          positions[i3 + 1] = Math.sin(angle) * newDistance
          positions[i3 + 2] = (Math.random() - 0.5) * 2
        } else {
          // Apply gravitational acceleration toward center
          const force = 2 / (distance * distance) // Simplified gravity
          const acceleration = force * delta
          
          positions[i3] -= (x / distance) * acceleration
          positions[i3 + 1] -= (y / distance) * acceleration
          positions[i3 + 2] -= (z / distance) * acceleration * 0.5
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    } catch (error) {
      console.warn('GravityField animation error:', error)
    }
  })

  if (!visible || !object) return null

  // Object-specific visual properties
  const getFieldColor = () => {
    switch (object.type) {
      case 'blackhole': return "#ff4444"
      case 'star': return "#ffaa00"
      case 'planet': return "#4ade80"
      case 'moon': return "#8899ff"
      default: return "#4ade80"
    }
  }

  const getFieldOpacity = () => {
    switch (object.type) {
      case 'blackhole': return 0.8
      case 'star': return 0.7
      case 'planet': return 0.5
      case 'moon': return 0.4
      default: return 0.5
    }
  }

  return (
    <group>
      {/* Gravity field lines */}
      {fieldLines && fieldLines.map((geometry, index) => (
        <line key={index}>
          <primitive object={geometry} />
          <lineBasicMaterial 
            color={getFieldColor()} 
            transparent 
            opacity={getFieldOpacity()}
          />
        </line>
      ))}

      {/* Test particles */}
      {particles && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.positions.length / 3}
              array={particles.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            color="#fbbf24" 
            size={0.1} 
            transparent 
            opacity={0.8}
          />
        </points>
      )}
    </group>
  )
}

export default GravityField