import React, { useState } from 'react'

const DefinitionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const definitions = [
    {
      term: "Light Year",
      category: "distance",
      definition: "A unit of astronomical distance equal to the distance that light travels in one year in a vacuum, approximately 9.46 trillion kilometers (5.88 trillion miles).",
      example: "The nearest star to our Sun, Proxima Centauri, is about 4.24 light-years away.",
      icon: "💫"
    },
    {
      term: "Andromeda Galaxy",
      category: "celestial",
      definition: "The nearest major galaxy to the Milky Way, located approximately 2.5 million light-years away. Also known as M31, it contains over one trillion stars.",
      example: "Andromeda is approaching the Milky Way and will collide with it in about 4.5 billion years.",
      icon: "🌌"
    },
    {
      term: "James Webb Space Telescope (JWST)",
      category: "technology",
      definition: "NASA's premier space-based infrared observatory, launched in 2021. It's the most powerful space telescope ever built, designed to study the early universe.",
      example: "JWST has captured images of galaxies that formed just 400 million years after the Big Bang.",
      icon: "🔭"
    },
    {
      term: "Black Hole",
      category: "celestial",
      definition: "A region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon.",
      example: "The supermassive black hole Sagittarius A* at the center of our galaxy has a mass of 4 million suns.",
      icon: "⚫"
    },
    {
      term: "Event Horizon",
      category: "physics",
      definition: "The boundary around a black hole beyond which nothing can escape. It's the point of no return for any matter or radiation.",
      example: "The event horizon of a stellar black hole is typically a few kilometers in radius.",
      icon: "🕳️"
    },
    {
      term: "Time Dilation",
      category: "physics",
      definition: "A phenomenon predicted by Einstein's relativity where time passes differently due to gravity or relative motion. Time slows down in stronger gravitational fields.",
      example: "Near a black hole's event horizon, time would appear nearly frozen to an outside observer.",
      icon: "⏰"
    },
    {
      term: "Escape Velocity",
      category: "physics",
      definition: "The minimum speed needed for an object to escape the gravitational influence of a celestial body without further propulsion.",
      example: "Earth's escape velocity is 11.2 km/s, while the Sun's is 617.5 km/s.",
      icon: "🚀"
    },
    {
      term: "Neutron Star",
      category: "celestial",
      definition: "An extremely dense stellar remnant formed when a massive star collapses. A teaspoon of neutron star material would weigh about 6 billion tons.",
      example: "Pulsars are rotating neutron stars that emit beams of radiation from their magnetic poles.",
      icon: "🌟"
    },
    {
      term: "Supernova",
      category: "celestial",
      definition: "The explosive death of a massive star, briefly outshining an entire galaxy and dispersing heavy elements into space.",
      example: "The Crab Nebula is the remnant of a supernova observed by Chinese astronomers in 1054 AD.",
      icon: "💥"
    },
    {
      term: "Redshift",
      category: "physics",
      definition: "The stretching of light wavelengths due to the expansion of the universe or relative motion, making objects appear redder.",
      example: "Distant galaxies show high redshift values, confirming the universe's expansion.",
      icon: "📊"
    },
    {
      term: "Hubble Space Telescope",
      category: "technology",
      definition: "NASA's space-based optical telescope launched in 1990, providing unprecedented views of the universe for over 30 years.",
      example: "Hubble has observed galaxies over 13 billion light-years away, showing the universe's early history.",
      icon: "🛰️"
    },
    {
      term: "Dark Matter",
      category: "physics",
      definition: "Invisible matter that makes up about 27% of the universe, detectable only through its gravitational effects on visible matter.",
      example: "Galaxy rotation curves suggest that dark matter halos surround most galaxies.",
      icon: "🌑"
    },
    {
      term: "Exoplanet",
      category: "celestial",
      definition: "A planet that orbits a star outside our solar system. Over 5,000 exoplanets have been discovered to date.",
      example: "Kepler-452b is called 'Earth's cousin' due to its similar size and location in its star's habitable zone.",
      icon: "🪐"
    },
    {
      term: "Cosmic Microwave Background",
      category: "physics",
      definition: "The afterglow radiation from the Big Bang, providing a snapshot of the universe when it was only 380,000 years old.",
      example: "The CMB temperature is 2.7 Kelvin, with tiny fluctuations that seeded galaxy formation.",
      icon: "📡"
    },
    {
      term: "Solar Wind",
      category: "celestial",
      definition: "A stream of charged particles continuously flowing from the Sun's corona throughout the solar system.",
      example: "Solar wind interacts with Earth's magnetosphere to create auroras at the poles.",
      icon: "☀️"
    },
    {
      term: "Gravitational Waves",
      category: "physics",
      definition: "Ripples in spacetime caused by accelerating massive objects, predicted by Einstein and first detected by LIGO in 2015.",
      example: "The collision of two black holes creates gravitational waves detectable billions of light-years away.",
      icon: "〰️"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'celestial', name: 'Celestial Objects', icon: '🌠' },
    { id: 'distance', name: 'Distance & Scale', icon: '📏' },
    { id: 'technology', name: 'Space Technology', icon: '🛸' }
  ]

  const filteredDefinitions = definitions.filter(def => {
    const matchesSearch = def.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         def.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || def.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span 
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              style={{
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
                textShadow: '0 0 20px rgba(100, 149, 237, 0.5)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
              }}
            >
              📖 Space Definitions
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Explore essential astronomical and physics concepts that power our understanding of the cosmos.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-3 pl-12 bg-space-dark/80 border border-space-blue/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-space-blue/60 focus:ring-2 focus:ring-space-blue/20"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-space-blue text-white shadow-lg'
                    : 'bg-space-dark/60 text-gray-300 hover:bg-space-blue/20 hover:text-white'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {filteredDefinitions.length} of {definitions.length} definitions
          </p>
        </div>

        {/* Definitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDefinitions.map((def, index) => (
            <div
              key={index}
              className="bg-space-dark/80 backdrop-blur-sm border border-space-blue/30 rounded-lg p-6 hover:border-space-blue/60 hover:shadow-xl hover:shadow-space-blue/20 transition-all duration-300 group"
            >
              {/* Term Header */}
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{def.icon}</span>
                <h3 className="text-xl font-bold text-white group-hover:text-space-blue transition-colors">
                  {def.term}
                </h3>
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="px-3 py-1 bg-space-blue/20 text-space-blue text-xs font-medium rounded-full">
                  {categories.find(cat => cat.id === def.category)?.name || 'General'}
                </span>
              </div>

              {/* Definition */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                {def.definition}
              </p>

              {/* Example */}
              <div className="border-t border-space-blue/20 pt-4">
                <p className="text-xs text-gray-400 mb-1 font-semibold">EXAMPLE:</p>
                <p className="text-sm text-gray-300 italic">
                  {def.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDefinitions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No definitions found</h3>
            <p className="text-gray-400">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-16 text-center border-t border-space-blue/20 pt-8">
          <p className="text-gray-400 text-sm">
            📚 All definitions based on current scientific understanding and NASA/ESA data
          </p>
        </div>
      </div>
    </div>
  )
}

export default DefinitionsPage
