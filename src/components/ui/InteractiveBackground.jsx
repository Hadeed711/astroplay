import React, { useEffect, useRef } from 'react'

const InteractiveBackground = ({ children }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let particles = []
    let nebulaClouds = []
    let shootingStars = []
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Create particles for stars
    const createStars = () => {
      particles = []
      for (let i = 0; i < 300; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * 0.02 + 0.005,
          color: `hsl(${180 + Math.random() * 80}, 70%, ${70 + Math.random() * 30}%)`
        })
      }
    }
    
    // Create nebula clouds
    const createNebulae = () => {
      nebulaClouds = []
      for (let i = 0; i < 12; i++) {
        nebulaClouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 150,
          opacity: Math.random() * 0.08 + 0.02,
          speedX: (Math.random() - 0.5) * 0.05,
          speedY: (Math.random() - 0.5) * 0.05,
          color: `hsl(${240 + Math.random() * 80}, 60%, 40%)`
        })
      }
    }
    
    // Create shooting stars
    const createShootingStar = () => {
      if (Math.random() < 0.003) { // 0.3% chance per frame
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.3,
          speedX: Math.random() * 8 + 4,
          speedY: Math.random() * 4 + 2,
          length: Math.random() * 80 + 40,
          opacity: 1,
          life: 1
        })
      }
    }
    
    createStars()
    createNebulae()
    
    // Animation loop
    const animate = () => {
      // Clear with dark space background
      ctx.fillStyle = 'rgba(5, 5, 15, 0.95)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw nebula clouds
      nebulaClouds.forEach(cloud => {
        cloud.x += cloud.speedX
        cloud.y += cloud.speedY
        
        // Wrap around edges
        if (cloud.x > canvas.width + cloud.radius) cloud.x = -cloud.radius
        if (cloud.x < -cloud.radius) cloud.x = canvas.width + cloud.radius
        if (cloud.y > canvas.height + cloud.radius) cloud.y = -cloud.radius
        if (cloud.y < -cloud.radius) cloud.y = canvas.height + cloud.radius
        
        // Create gradient for nebula effect
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.radius
        )
        gradient.addColorStop(0, cloud.color.replace(')', `, ${cloud.opacity})`).replace('hsl', 'hsla'))
        gradient.addColorStop(0.6, cloud.color.replace(')', `, ${cloud.opacity * 0.3})`).replace('hsl', 'hsla'))
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Draw stars
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity += particle.twinkle * (Math.random() > 0.5 ? 1 : -1)
        particle.opacity = Math.max(0.1, Math.min(1, particle.opacity))
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height
        
        // Draw star with glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = particle.color
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('hsl', 'hsla')
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add cross-shaped glow for brighter stars
        if (particle.size > 1.5) {
          ctx.strokeStyle = particle.color.replace(')', `, ${particle.opacity * 0.4})`).replace('hsl', 'hsla')
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x - particle.size * 4, particle.y)
          ctx.lineTo(particle.x + particle.size * 4, particle.y)
          ctx.moveTo(particle.x, particle.y - particle.size * 4)
          ctx.lineTo(particle.x, particle.y + particle.size * 4)
          ctx.stroke()
        }
        
        ctx.shadowBlur = 0
      })
      
      // Create and animate shooting stars
      createShootingStar()
      
      shootingStars.forEach((star, index) => {
        star.x += star.speedX
        star.y += star.speedY
        star.life -= 0.02
        star.opacity = star.life
        
        if (star.life <= 0) {
          shootingStars.splice(index, 1)
          return
        }
        
        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.speedX * star.length / 10, star.y - star.speedY * star.length / 10
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(0.6, `rgba(255, 200, 100, ${star.opacity * 0.6})`)
        gradient.addColorStop(1, 'transparent')
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.speedX * star.length / 10, star.y - star.speedY * star.length / 10)
        ctx.stroke()
        
        // Draw bright head
        ctx.shadowBlur = 20
        ctx.shadowColor = '#ffffff'
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0a1e3e 100%)' }}
      />
      
      {/* Overlay gradients for depth */}
      <div className="fixed inset-0 z-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default InteractiveBackground