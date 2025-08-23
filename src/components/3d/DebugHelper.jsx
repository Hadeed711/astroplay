import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const DebugHelper = () => {
  const cubeRef = useRef()

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta
      cubeRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={cubeRef} position={[3, 3, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  )
}

export default DebugHelper