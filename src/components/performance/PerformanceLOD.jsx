import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { LOD } from 'three'
import { useGLTF } from '@react-three/drei'

const PerformanceLOD = ({ object, position = [0, 0, 0], onSelect }) => {
  const { camera } = useThree()
  const lodRef = useRef()
  const lastDistance = useRef(Infinity)

  // LOD configurations based on object type
  const lodConfig = useMemo(() => {
    const baseConfig = {
      high: { distance: 5, geometry: 'detailed' },
      medium: { distance: 15, geometry: 'medium' },
      low: { distance: 40, geometry: 'simple' },
      impostor: { distance: 100, geometry: 'billboard' }
    }

    // Adjust LOD distances based on object importance
    const importance = getObjectImportance(object.type)
    return {
      high: { ...baseConfig.high, distance: baseConfig.high.distance * importance },
      medium: { ...baseConfig.medium, distance: baseConfig.medium.distance * importance },
      low: { ...baseConfig.low, distance: baseConfig.low.distance * importance },
      impostor: { ...baseConfig.impostor, distance: baseConfig.impostor.distance * importance }
    }
  }, [object.type])

  const getObjectImportance = (type) => {
    switch (type) {
      case 'blackhole': return 1.5  // Higher detail at distance
      case 'neutron_star': return 1.3
      case 'star': return 1.2
      case 'planet': return 1.0
      case 'white_dwarf': return 0.8
      default: return 1.0
    }
  }

  // Generate geometries for different LOD levels
  const geometries = useMemo(() => {
    const scale = object.radius || 1

    return {
      detailed: {
        geometry: <icosahedronGeometry args={[scale, 4]} />, // High poly
        segments: 64
      },
      medium: {
        geometry: <icosahedronGeometry args={[scale, 2]} />, // Medium poly
        segments: 32
      },
      simple: {
        geometry: <icosahedronGeometry args={[scale, 1]} />, // Low poly
        segments: 16
      },
      billboard: {
        geometry: <planeGeometry args={[scale * 2, scale * 2]} />, // Flat sprite
        segments: 1
      }
    }
  }, [object.radius])

  // Load high-quality model for close viewing
  const DetailedModel = ({ modelFile }) => {
    try {
      const { scene } = useGLTF(modelFile || '/models/fallback.glb')
      return <primitive object={scene.clone()} />
    } catch (error) {
      return geometries.detailed.geometry
    }
  }

  // Create materials for different object types
  const getMaterial = (lodLevel, objectType) => {
    const baseColor = object.color || '#ffffff'
    
    switch (lodLevel) {
      case 'detailed':
        return (
          <meshPhysicalMaterial
            color={baseColor}
            metalness={objectType === 'neutron_star' ? 0.9 : 0.1}
            roughness={objectType === 'blackhole' ? 0 : 0.3}
            emissive={objectType === 'star' ? baseColor : '#000000'}
            emissiveIntensity={objectType === 'star' ? 0.3 : 0}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        )
      
      case 'medium':
        return (
          <meshStandardMaterial
            color={baseColor}
            metalness={objectType === 'neutron_star' ? 0.8 : 0.1}
            roughness={0.4}
            emissive={objectType === 'star' ? baseColor : '#000000'}
            emissiveIntensity={objectType === 'star' ? 0.2 : 0}
          />
        )
      
      case 'simple':
        return (
          <meshLambertMaterial
            color={baseColor}
            emissive={objectType === 'star' ? baseColor : '#000000'}
            emissiveIntensity={objectType === 'star' ? 0.1 : 0}
          />
        )
      
      case 'billboard':
        return (
          <meshBasicMaterial
            color={baseColor}
            transparent
            alphaTest={0.5}
            side={2} // DoubleSide
          />
        )
      
      default:
        return <meshBasicMaterial color={baseColor} />
    }
  }

  // Update LOD based on camera distance
  useFrame(() => {
    if (!lodRef.current) return

    const distance = camera.position.distanceTo(lodRef.current.position)
    
    // Only update if distance changed significantly (optimization)
    if (Math.abs(distance - lastDistance.current) > 1) {
      lodRef.current.update(camera)
      lastDistance.current = distance
    }
  })

  // Create LOD object
  const createLOD = () => {
    const lod = new LOD()

    // High detail (close)
    const highDetail = (
      <mesh onClick={onSelect}>
        {object.modelFile ? (
          <DetailedModel modelFile={object.modelFile} />
        ) : (
          geometries.detailed.geometry
        )}
        {getMaterial('detailed', object.type)}
      </mesh>
    )

    // Medium detail
    const mediumDetail = (
      <mesh onClick={onSelect}>
        {geometries.medium.geometry}
        {getMaterial('medium', object.type)}
      </mesh>
    )

    // Low detail
    const lowDetail = (
      <mesh onClick={onSelect}>
        {geometries.simple.geometry}
        {getMaterial('simple', object.type)}
      </mesh>
    )

    // Billboard impostor (far)
    const impostor = (
      <mesh onClick={onSelect}>
        {geometries.billboard.geometry}
        {getMaterial('billboard', object.type)}
      </mesh>
    )

    return { lod, highDetail, mediumDetail, lowDetail, impostor }
  }

  return (
    <group ref={lodRef} position={position}>
      {/* Use native Three.js LOD for performance */}
      <primitive object={useMemo(() => {
        const lod = new LOD()
        
        // Add LOD levels (distance-based switching)
        // Note: In actual implementation, we'd need to create Three.js objects
        // For now, we'll use a simplified approach with conditional rendering
        
        return lod
      }, [])} />
      
      {/* Simplified LOD using distance-based conditional rendering */}
      <DistanceBasedLOD
        object={object}
        camera={camera}
        lodConfig={lodConfig}
        geometries={geometries}
        getMaterial={getMaterial}
        onSelect={onSelect}
      />
    </group>
  )
}

// Simplified distance-based LOD component
const DistanceBasedLOD = ({ object, camera, lodConfig, geometries, getMaterial, onSelect }) => {
  const meshRef = useRef()
  const [currentLOD, setCurrentLOD] = useState('high')

  useFrame(() => {
    if (!meshRef.current) return

    const distance = camera.position.distanceTo(meshRef.current.position)
    
    let newLOD = 'impostor'
    if (distance < lodConfig.high.distance) newLOD = 'high'
    else if (distance < lodConfig.medium.distance) newLOD = 'medium'
    else if (distance < lodConfig.low.distance) newLOD = 'low'
    
    if (newLOD !== currentLOD) {
      setCurrentLOD(newLOD)
    }
  })

  const getCurrentGeometry = () => {
    switch (currentLOD) {
      case 'high': return <icosahedronGeometry args={[1, 4]} />
      case 'medium': return <icosahedronGeometry args={[1, 2]} />
      case 'low': return <icosahedronGeometry args={[1, 1]} />
      case 'impostor': return <planeGeometry args={[2, 2]} />
      default: return <icosahedronGeometry args={[1, 1]} />
    }
  }

  return (
    <mesh ref={meshRef} onClick={onSelect}>
      {getCurrentGeometry()}
      {getMaterial(currentLOD, object.type)}
    </mesh>
  )
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId

    const updateMetrics = () => {
      const currentTime = performance.now()
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        const frameTime = Math.round((currentTime - lastTime) / frameCount * 100) / 100
        
        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime,
          memoryUsage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(updateMetrics)
    }
    
    animationId = requestAnimationFrame(updateMetrics)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return metrics
}

// Performance display component
export const PerformanceDisplay = () => {
  const metrics = usePerformanceMonitor()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-3 py-2 bg-gray-800/80 text-white rounded-lg text-sm backdrop-blur-sm"
      >
        📊 Performance
      </button>
      
      {isVisible && (
        <div className="mt-2 p-3 bg-gray-800/90 text-white rounded-lg text-sm backdrop-blur-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className={metrics.fps < 30 ? 'text-red-400' : 'text-green-400'}>
                {metrics.fps}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frame Time:</span>
              <span>{metrics.frameTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>{metrics.memoryUsage}MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerformanceLOD
