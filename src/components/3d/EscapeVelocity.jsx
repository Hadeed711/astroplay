import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const EscapeVelocity = ({ object, visible }) => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y += 0.01
    }
  })

  if (!visible || !object) return null

  // Create escape velocity trajectories
  const trajectories = []
  const numTrajectories = 8

  for (let i = 0; i < numTrajectories; i++) {
    const angle = (i / numTrajectories) * Math.PI * 2
    const points = []
    
    // Create parabolic escape trajectories
    for (let j = 0; j < 30; j++) {
      const t = j / 29
      const x = Math.cos(angle) * t * 5
      const z = Math.sin(angle) * t * 5
      const y = t * 3 - t * t * 2 // Parabolic path
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    trajectories.push({
      points,
      color: i % 2 === 0 ? '#00FF00' : '#FF0000' // Green for escape, red for return
    })
  }

  return (
    <group ref={groupRef}>
      {trajectories.map((trajectory, index) => (
        <Line
          key={index}
          points={trajectory.points}
          color={trajectory.color}
          lineWidth={3}
          transparent
          opacity={0.7}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}
    </group>
  )
}

export default EscapeVelocity