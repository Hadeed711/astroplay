import { useState, useEffect, useRef } from 'react'

const StarField = () => {
  const [stars, setStars] = useState([])
  const [isHovering, setIsHovering] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setStars([])
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    if (isHovering) {
      // Generate stars around cursor position
      const newStars = []
      const numStars = 15 + Math.random() * 10 // 15-25 stars
      
      for (let i = 0; i < numStars; i++) {
        // Create stars in a radius around the cursor
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 150 + 50 // 50-200px from cursor
        const x = mousePos.x + Math.cos(angle) * distance
        const y = mousePos.y + Math.sin(angle) * distance
        
        newStars.push({
          id: Math.random(),
          x,
          y,
          size: Math.random() * 3 + 1, // 1-4px
          opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
          twinkleDelay: Math.random() * 2, // 0-2s delay
          color: Math.random() > 0.8 ? '#fbbf24' : '#ffffff' // 20% gold, 80% white
        })
      }
      
      setStars(newStars)
    }
  }, [mousePos, isHovering])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: -1 }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse-slow"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            animationDelay: `${star.twinkleDelay}s`,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export default StarField