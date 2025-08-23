import { useState, useEffect } from 'react'

// Hook for responsive design
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      })
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}

// Responsive Layout Component
export const ResponsiveLayout = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  const getLayoutClasses = () => {
    if (isMobile) {
      return 'mobile-layout flex flex-col h-screen'
    } else if (isTablet) {
      return 'tablet-layout grid grid-cols-1 lg:grid-cols-3 h-screen'
    } else {
      return 'desktop-layout grid grid-cols-4 h-screen'
    }
  }

  return (
    <div className={getLayoutClasses()}>
      {children}
    </div>
  )
}

// Mobile-specific UI panel
export const MobilePanel = ({ title, children, isOpen, onToggle }) => {
  const { isMobile } = useResponsive()
  
  if (!isMobile) return children

  return (
    <div className="mobile-panel">
      {/* Collapsible header for mobile */}
      <div 
        className="bg-gray-800 p-4 border-b border-gray-600 cursor-pointer flex justify-between items-center"
        onClick={onToggle}
      >
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-white text-xl">
          {isOpen ? '▼' : '▶'}
        </span>
      </div>
      
      {/* Collapsible content */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Responsive grid for object selection
export const ResponsiveObjectGrid = ({ objects, selectedObject, onSelect }) => {
  const { isMobile, isTablet } = useResponsive()
  
  const getGridClasses = () => {
    if (isMobile) {
      return 'grid grid-cols-2 gap-2 p-4'
    } else if (isTablet) {
      return 'grid grid-cols-3 gap-3 p-4'
    } else {
      return 'grid grid-cols-4 gap-4 p-4'
    }
  }

  const getItemClasses = (object) => {
    const baseClasses = 'border rounded-lg p-3 cursor-pointer transition-all duration-200 touch-manipulation'
    const activeClasses = selectedObject?.id === object.id 
      ? 'border-blue-500 bg-blue-500/20' 
      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
    
    return `${baseClasses} ${activeClasses}`
  }

  return (
    <div className={getGridClasses()}>
      {objects.map((object) => (
        <div
          key={object.id}
          className={getItemClasses(object)}
          onClick={() => onSelect(object)}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">{object.emoji}</div>
            <div className="text-sm font-medium text-white">{object.name}</div>
            {!isMobile && (
              <div className="text-xs text-gray-400 mt-1">{object.type}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Responsive navigation
export const ResponsiveNavigation = ({ currentPage, onPageChange, pages }) => {
  const { isMobile } = useResponsive()
  
  if (isMobile) {
    // Bottom tab bar for mobile
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 z-50">
        <div className="grid grid-cols-3 h-16">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                currentPage === page.id 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">{page.icon}</span>
              <span className="text-xs">{page.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Desktop/tablet sidebar navigation
  return (
    <nav className="bg-gray-800 border-r border-gray-600 p-4">
      <div className="space-y-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onPageChange(page.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === page.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{page.icon}</span>
            <span className="font-medium">{page.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// Responsive fact panel
export const ResponsiveFactPanel = ({ object, onClose }) => {
  const { isMobile } = useResponsive()
  
  if (isMobile) {
    // Full screen modal for mobile
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">{object.name}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Mobile-optimized content */}
          <FactContent object={object} isMobile={true} />
        </div>
      </div>
    )
  }

  // Desktop/tablet sidebar panel
  return (
    <div className="bg-gray-800 border-l border-gray-600 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{object.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
      <FactContent object={object} isMobile={false} />
    </div>
  )
}

// Fact content component
const FactContent = ({ object, isMobile }) => {
  const textSize = isMobile ? 'text-base' : 'text-sm'
  const spacing = isMobile ? 'space-y-4' : 'space-y-3'
  
  return (
    <div className={spacing}>
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">{object.emoji}</div>
        <div className={`${textSize} text-gray-400`}>{object.type}</div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Physical Properties</h3>
        <div className={`${textSize} text-gray-300 ${spacing}`}>
          <div>Mass: {object.mass}</div>
          <div>Radius: {object.radius}</div>
          <div>Surface Gravity: {object.surfaceGravity}</div>
          <div>Escape Velocity: {object.escapeVelocity}</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
        <p className={`${textSize} text-gray-300 leading-relaxed`}>
          {object.description}
        </p>
      </div>
      
      {object.missions && object.missions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Missions</h3>
          <div className={spacing}>
            {object.missions.map((mission, index) => (
              <div key={index} className={`${textSize} text-gray-300`}>
                {mission}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsiveLayout
