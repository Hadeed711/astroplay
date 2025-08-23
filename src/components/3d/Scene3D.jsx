import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import React, { Suspense } from 'react'
import Model3D from './Model3D'
import DistanceAnimation from './DistanceAnimation'
import GravityField from './GravityField'
import TimeDilation from './TimeDilation'
import TravelAnimation from './TravelAnimation'
import useAppStore from '../../store/useAppStore'

const Scene3D = () => {
  const {
    selectedObject,
    showGravityField,
    showEventHorizon,
    showTimeDilation,
    showTravelAnimation,
    distanceFromSurface,
    spacecraftSpeed
  } = useAppStore()

  // Reference objects for distance measurement - support all objects
  const referenceObjects = {
    earth: { position: [0, 0, 0] },
    moon: { position: [3, 0, 0] },
    mars: { position: [5, 0, 0] },
    sun: { position: [0, 8, 0] },
    jupiter: { position: [7, 0, 0] },
    venus: { position: [2, 0, 0] },
    saturn: { position: [9, 0, 0] },
    neptune: { position: [12, 0, 0] },
    uranus: { position: [11, 0, 0] },
    mercury: { position: [1, 0, 0] },
    neutronStar: { position: [6, 0, 0] },
    stellarBlackHole: { position: [8, 0, 0] },
    siriusB: { position: [10, 0, 0] },
    sagittariusA: { position: [15, 0, 0] },
    m87: { position: [20, 0, 0] },
    pulsar: { position: [14, 0, 0] },
    redGiant: { position: [16, 0, 0] },
    whiteDwarf: { position: [13, 0, 0] }
  }

  return (
    <div className="w-full h-64 md:h-96 bg-black rounded-lg overflow-hidden border border-space-blue/30">
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: window.innerWidth < 768 ? 90 : 75,
          near: 0.1,
          far: 1000 
        }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false
        }}
        style={{ touchAction: 'none' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />

        {/* Background Stars - persistent */}
        <Stars 
          radius={300} 
          depth={60} 
          count={5000} 
          factor={6} 
          saturation={0} 
          fade={false}
          speed={0.3}
        />

        {/* Main Celestial Body - show when travel animation is NOT active */}
        {!showTravelAnimation && selectedObject && (
          <Suspense fallback={null}>
            <Model3D 
              key={`main-${selectedObject?.key || 'default'}`}
              object={selectedObject} 
              showAtmosphere={true}
            />
          </Suspense>
        )}

        {/* Travel Animation - shows both Earth and selected object */}
        {showTravelAnimation === true && selectedObject && (
          <Suspense fallback={null}>
            <TravelAnimation 
              key={`travel-${selectedObject?.key || 'default'}`}
              selectedObject={selectedObject}
              visible={showTravelAnimation}
              spacecraftSpeed={spacecraftSpeed}
            />
          </Suspense>
        )}

        {/* Interactive Features */}
        <Suspense fallback={null}>
          {showGravityField && (
            <GravityField object={selectedObject} visible={showGravityField} />
          )}

          {showTimeDilation && (
            <TimeDilation 
              object={selectedObject} 
              visible={showTimeDilation} 
              distance={distanceFromSurface}
            />
          )}
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={200}
          autoRotate={false}
          autoRotateSpeed={0.5}
          touchAction="none"
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}

export default Scene3D