import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <>
      {/* Yellow separator line */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      
      <footer className="relative bg-gradient-to-t from-black/90 via-space-dark/80 to-transparent border-t border-space-blue/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* App Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/Favicon.png" 
                  alt="AstroPlay Logo" 
                  className="w-24 h-18 mr-4"
                />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AstroPlay
                </h3>
              </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Explore the cosmos with authentic physics calculations and immersive 3D visualizations. 
              Discover gravity wells, time dilation, and the mysteries of space.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs">☀️</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-xs">🌍</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs">🌙</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-xs">♂️</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#explore" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Explore</a></li>
              <li><a href="#quiz" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Quiz</a></li>
              <li><a href="#dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Dashboard</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About</a></li>
            </ul>
          </div>
          
          {/* Resources & Credits */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">🛰️</span>NASA
                </a>
              </li>
              <li>
                <a 
                  href="https://www.esa.int/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">🇪🇺</span>ESA
                </a>
              </li>
              <li>
                <a 
                  href="https://arxiv.org/list/astro-ph/recent" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">📖</span>ArXiv Astrophysics
                </a>
              </li>
              <li>
                <a 
                  href="https://www.eventhorizontelescope.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">🔭</span>Event Horizon Telescope
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Physics Credits */}
        <div className="border-t border-space-blue/20 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Physics & Data Sources:</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Time dilation calculations based on Einstein's General Relativity. Celestial body data sourced from NASA/JPL, 
            ESA missions, and peer-reviewed astrophysics research. Escape velocity and gravitational calculations verified 
            against established astronomical databases.
          </p>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-space-blue/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} AstroPlay. All rights reserved.
            </p>
          </div>
          
          {/* Developer Info */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <span className="text-xs text-gray-500">Developed by</span>
              <span className="text-sm font-semibold text-white">Hadeed Ahmad</span>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-xs text-gray-500">Contact:</span>
              <a 
                href="tel:+923241669274" 
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                03241669274
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
    </>
  )
}

export default Footer
