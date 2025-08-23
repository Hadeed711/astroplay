import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const TouchControls = ({ enabled = true }) => {
  const { camera, gl } = useThree()
  const [touches, setTouches] = useState({})
  const [gestureState, setGestureState] = useState({
    isRotating: false,
    isPinching: false,
    isDoubleTap: false,
    lastTapTime: 0,
    initialDistance: 0,
    initialRotation: { x: 0, y: 0 }
  })

  const touchStartRef = useRef({})

  useEffect(() => {
    if (!enabled || !gl.domElement) return

    const canvas = gl.domElement

    // Touch event handlers
    const handleTouchStart = (event) => {
      event.preventDefault()
      const touchList = Array.from(event.touches)
      
      if (touchList.length === 1) {
        // Single touch - potential rotation or double tap
        const touch = touchList[0]
        const currentTime = Date.now()
        
        // Check for double tap
        if (currentTime - gestureState.lastTapTime < 300) {
          setGestureState(prev => ({
            ...prev,
            isDoubleTap: true,
            lastTapTime: currentTime
          }))
          // Reset camera position on double tap
          camera.position.set(0, 0, 5)
          camera.lookAt(0, 0, 0)
        } else {
          setGestureState(prev => ({
            ...prev,
            isRotating: true,
            lastTapTime: currentTime,
            initialRotation: { x: touch.clientX, y: touch.clientY }
          }))
        }
        
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY
        }
      } else if (touchList.length === 2) {
        // Two finger pinch/zoom
        const touch1 = touchList[0]
        const touch2 = touchList[1]
        
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        setGestureState(prev => ({
          ...prev,
          isPinching: true,
          isRotating: false,
          initialDistance: distance
        }))
      }
      
      setTouches(touchList.reduce((acc, touch) => {
        acc[touch.identifier] = {
          x: touch.clientX,
          y: touch.clientY
        }
        return acc
      }, {}))
    }

    const handleTouchMove = (event) => {
      event.preventDefault()
      const touchList = Array.from(event.touches)
      
      if (touchList.length === 1 && gestureState.isRotating) {
        // Single finger rotation
        const touch = touchList[0]
        const deltaX = touch.clientX - gestureState.initialRotation.x
        const deltaY = touch.clientY - gestureState.initialRotation.y
        
        // Rotate camera around origin
        const sensitivity = 0.005
        const spherical = new THREE.Spherical()
        spherical.setFromVector3(camera.position)
        
        spherical.theta -= deltaX * sensitivity
        spherical.phi += deltaY * sensitivity
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))
        
        camera.position.setFromSpherical(spherical)
        camera.lookAt(0, 0, 0)
        
        setGestureState(prev => ({
          ...prev,
          initialRotation: { x: touch.clientX, y: touch.clientY }
        }))
      } else if (touchList.length === 2 && gestureState.isPinching) {
        // Two finger pinch zoom
        const touch1 = touchList[0]
        const touch2 = touchList[1]
        
        const currentTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        const scale = currentTouchDistance / gestureState.initialDistance
        const zoomSensitivity = 0.01
        
        // Zoom in/out
        const direction = camera.position.clone().normalize()
        const currentCameraDistance = camera.position.length()
        const newDistance = Math.max(2, Math.min(20, currentCameraDistance / scale))
        
        camera.position.copy(direction.multiplyScalar(newDistance))
        
        setGestureState(prev => ({
          ...prev,
          initialDistance: currentTouchDistance
        }))
      }
    }

    const handleTouchEnd = (event) => {
      event.preventDefault()
      const remainingTouches = Array.from(event.touches)
      
      if (remainingTouches.length === 0) {
        // All touches ended
        setGestureState(prev => ({
          ...prev,
          isRotating: false,
          isPinching: false,
          isDoubleTap: false
        }))
        setTouches({})
      } else if (remainingTouches.length === 1 && gestureState.isPinching) {
        // Transition from pinch to rotation
        const touch = remainingTouches[0]
        setGestureState(prev => ({
          ...prev,
          isPinching: false,
          isRotating: true,
          initialRotation: { x: touch.clientX, y: touch.clientY }
        }))
      }
    }

    // Add touch event listeners
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, camera, gl.domElement, gestureState])

  return null
}

// Touch-friendly UI controls
export const TouchUI = ({ onToggle, controls }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main toggle button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault()
          setIsExpanded(!isExpanded)
        }}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-2xl shadow-lg touch-manipulation"
      >
        {isExpanded ? '×' : '⚙️'}
      </button>

      {/* Expanded controls */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-gray-800/95 rounded-lg p-4 min-w-48 backdrop-blur-sm">
          <div className="space-y-3">
            {Object.entries(controls).map(([key, { label, enabled }]) => (
              <button
                key={key}
                onTouchStart={(e) => {
                  e.preventDefault()
                  onToggle(key, !enabled)
                }}
                className={`w-full p-3 rounded-lg text-left touch-manipulation transition-colors ${
                  enabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs">
                    {enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Touch instructions */}
          <div className="mt-4 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">Touch Controls:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Single finger: Rotate view</li>
              <li>• Two fingers: Pinch to zoom</li>
              <li>• Double tap: Reset camera</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TouchControls
