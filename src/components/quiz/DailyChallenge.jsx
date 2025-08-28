import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

const DailyChallenge = () => {
  const { user } = useAppStore()
  const [funFact, setFunFact] = useState(null)
  const [spaceImage, setSpaceImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('facts')

  // NASA API endpoints
  const NASA_API_KEY = 'DEMO_KEY' // Replace with actual API key if needed
  const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`

  const funFacts = [
    {
      id: 1,
      title: "Black Hole Time Dilation",
      fact: "If you fell into a black hole, time would appear to slow down relative to the outside universe. To an outside observer, you would appear to freeze at the event horizon!",
      category: "Black Holes",
      emoji: "🕳️"
    },
    {
      id: 2,
      title: "Neutron Star Density",
      fact: "A teaspoon of neutron star material would weigh about 6 billion tons on Earth - equivalent to the weight of all cars on Earth combined!",
      category: "Neutron Stars",
      emoji: "⚡"
    },
    {
      id: 3,
      title: "Jupiter's Great Red Spot",
      fact: "The Great Red Spot on Jupiter is a storm that has been raging for at least 300 years and is so large that Earth could fit inside it twice!",
      category: "Planets",
      emoji: "🪐"
    },
    {
      id: 4,
      title: "Light Speed Distance",
      fact: "When you look at the Andromeda Galaxy, you're seeing it as it was 2.5 million years ago - that's how long its light took to reach Earth!",
      category: "Galaxies",
      emoji: "🌌"
    },
    {
      id: 5,
      title: "Diamond Rain",
      fact: "On Neptune and Uranus, it likely rains diamonds! The extreme pressure and temperature conditions can compress carbon into diamond crystals.",
      category: "Planets",
      emoji: "💎"
    },
    {
      id: 6,
      title: "Cosmic Background Radiation",
      fact: "About 1% of the static you see on old TVs is actually cosmic microwave background radiation - leftover heat from the Big Bang!",
      category: "Cosmology",
      emoji: "📺"
    }
  ]

  // Get daily fact based on date
  const getDailyFact = () => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('dailyFactDate')
    const storedFact = localStorage.getItem('dailyFact')

    if (storedDate === today && storedFact) {
      return JSON.parse(storedFact)
    }

    // Get a new fact based on today's date
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    const factIndex = dayOfYear % funFacts.length
    const todaysFact = funFacts[factIndex]

    localStorage.setItem('dailyFactDate', today)
    localStorage.setItem('dailyFact', JSON.stringify(todaysFact))

    return todaysFact
  }

  // Fetch NASA's Astronomy Picture of the Day
  const fetchSpaceImage = async () => {
    setLoading(true)
    try {
      const response = await fetch(APOD_URL)
      const data = await response.json()
      
      if (data.media_type === 'image') {
        setSpaceImage(data)
      } else {
        // If it's a video, show a fallback message
        setSpaceImage({
          ...data,
          url: '/placeholder-space.jpg', // You can add a placeholder image
          explanation: data.explanation || "Today's APOD is a video. Check NASA's website for the full experience!"
        })
      }
    } catch (error) {
      console.error('Error fetching space image:', error)
      setSpaceImage({
        title: "Hubble Deep Field",
        url: '/placeholder-space.jpg',
        explanation: "Explore the cosmos through this amazing view of distant galaxies captured by the Hubble Space Telescope."
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    setFunFact(getDailyFact())
    if (activeTab === 'images') {
      fetchSpaceImage()
    }
  }, [activeTab])

  // Check if user has completed a quiz today
  const hasCompletedQuizToday = () => {
    if (!user?.quizHistory) return false
    
    const today = new Date().toDateString()
    return user.quizHistory.some(quiz => 
      new Date(quiz.completedAt).toDateString() === today
    )
  }

  const userCanAccessRewards = hasCompletedQuizToday()

  const tabs = [
    { key: 'facts', label: 'Fun Facts', icon: '🧠' },
    { key: 'images', label: 'Space Images', icon: '🖼️' }
  ]

  if (!userCanAccessRewards) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🌌</div>
        <h2 className="text-2xl font-bold text-white mb-4">Daily Space Rewards</h2>
        <p className="text-slate-300 mb-6">
          Complete a quiz today to unlock amazing space facts and NASA images!
        </p>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="text-slate-400">🎯 Complete any quiz to unlock:</div>
          <div className="text-white mt-2">
            • Daily astronomy fun facts<br/>
            • NASA's Astronomy Picture of the Day<br/>
            • Educational space content
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          🌌 Daily Space Rewards
        </h2>
        <div className="flex bg-slate-700 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'facts' && funFact && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{funFact.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{funFact.title}</h3>
                  <div className="text-blue-300 text-sm">{funFact.category}</div>
                </div>
              </div>
              <p className="text-slate-200 leading-relaxed">{funFact.fact}</p>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => {
                  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
                  setFunFact(randomFact)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                🎲 Random Fact
              </button>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-4xl mb-4">🛰️</div>
                <div className="text-slate-300">Loading space image...</div>
              </div>
            ) : spaceImage ? (
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg overflow-hidden">
                  <img 
                    src={spaceImage.url} 
                    alt={spaceImage.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-space.jpg'
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{spaceImage.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {spaceImage.explanation?.slice(0, 300)}
                      {spaceImage.explanation?.length > 300 && '...'}
                    </p>
                    {spaceImage.date && (
                      <div className="text-slate-400 text-xs mt-2">
                        📅 {new Date(spaceImage.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={fetchSpaceImage}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    🔄 Refresh Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🌌</div>
                <div className="text-slate-300">Failed to load space image</div>
                <button
                  onClick={fetchSpaceImage}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyChallenge
