import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Sparkles, Trash2, Bot, User } from 'lucide-react'

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm AstroBot, your advanced space exploration assistant! Ask me anything about the cosmos, planets, stars, galaxies, space missions, astrophysics, or space exploration! 🌌",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Call AI server for real AI responses (works locally with Ollama)
  const callAIServer = async (userInput) => {
    try {
      // Try local Ollama first (for development)
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput
        }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ AI Response from ${data.provider}:`, data.response)
        return data.response
      } else {
        throw new Error(`Server error: ${response.status}`)
      }
    } catch (error) {
      console.warn('⚠️ Local AI server not available (normal for production):', error.message)
      return null
    }
  }

  // Call cloud AI API (works on Vercel)
  const callCloudAI = async (userInput) => {
    try {
      // This will work on Vercel with environment variables
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Cloud AI Response:', data.response)
        return data.response
      } else {
        throw new Error(`Cloud AI error: ${response.status}`)
      }
    } catch (error) {
      console.warn('⚠️ Cloud AI not available:', error.message)
      return null
    }
  }

  // Enhanced AI response generator with real AI integration
  const generateSmartResponse = async (userInput) => {
    // First try to get real AI response
    const aiResponse = await callAIServer(userInput)
    if (aiResponse) {
      return aiResponse
    }
    
    // Fallback to offline responses if AI server is not available
    const input = userInput.toLowerCase()
    const responses = getOfflineSpaceResponse(input)
    
    // Add some randomization and personality for offline mode
    const personalityPrefixes = [
      "That's a fascinating question! ",
      "Great question! ",
      "I love talking about this topic! ",
      "This is one of my favorite space topics! ",
      "Excellent question! ",
      ""
    ]
    
    const personalitySuffixes = [
      " What else would you like to know about space?",
      " Feel free to ask me more about the cosmos!",
      " Is there anything specific about this topic you'd like to explore?",
      " The universe is full of amazing phenomena!",
      " Space never ceases to amaze me!",
      ""
    ]
    
    const prefix = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)]
    const suffix = personalitySuffixes[Math.floor(Math.random() * personalitySuffixes.length)]
    
    return prefix + responses + suffix
  }

  // Comprehensive offline space knowledge base
  const getOfflineSpaceResponse = (question) => {
    const q = question.toLowerCase()
    
    // Black holes and gravity
    if (q.includes('black hole')) {
      return "Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars (over 20-25 times the mass of our Sun) collapse at the end of their lives. The event horizon is the 'point of no return' - once matter crosses this boundary, it inevitably falls toward the singularity at the center where our current understanding of physics breaks down."
    }
    
    // SpaceX and rockets
    else if (q.includes('spacex') || q.includes('starship')) {
      return "SpaceX Starship is a fully reusable spacecraft designed for missions to Mars and beyond. Standing 50 meters tall, it's powered by Raptor engines that burn liquid methane and liquid oxygen. Starship can carry up to 100-150 tons to low Earth orbit and is designed to be refueled in space for longer missions. It represents a major step toward making space travel more cost-effective and enabling human settlement on Mars."
    }
    
    // Exoplanets
    else if (q.includes('exoplanet') || q.includes('planet') && (q.includes('other') || q.includes('detect'))) {
      return "Exoplanets are planets that orbit stars outside our solar system. We've discovered over 5,000 confirmed exoplanets using methods like: 1) Transit method - watching for dimming when planets cross in front of their stars, 2) Radial velocity - detecting the gravitational 'wobble' planets cause in their stars, 3) Direct imaging - actually photographing the planets (very rare), and 4) Gravitational microlensing. Some exoplanets are in the 'habitable zone' where liquid water could exist!"
    }
    
    // James Webb Space Telescope
    else if (q.includes('james webb') || q.includes('jwst') || q.includes('telescope')) {
      return "The James Webb Space Telescope (JWST) is the most powerful space telescope ever built. Launched in 2021, it observes in infrared light and has a 6.5-meter segmented mirror - much larger than Hubble's 2.4-meter mirror. JWST can see the most distant galaxies in the universe, study the atmospheres of exoplanets, and observe star formation in unprecedented detail. It's positioned at the L2 Lagrange point, 1.5 million km from Earth."
    }
    
    // Neutron stars
    else if (q.includes('neutron star')) {
      return "Neutron stars are incredibly dense remnants of massive stars that exploded as supernovas. They pack the mass of 1.5-2 Suns into a sphere only about 20 km across! A teaspoon of neutron star material would weigh about 6 billion tons on Earth. They have the strongest magnetic fields in the universe (trillions of times stronger than Earth's) and can spin hundreds of times per second. Some neutron stars are pulsars, emitting beams of radiation like cosmic lighthouses."
    }
    
    // Mars exploration
    else if (q.includes('mars')) {
      return "Mars is our neighboring red planet, about half the size of Earth. It has polar ice caps, the largest volcano in the solar system (Olympus Mons), and evidence of ancient water flows. Current missions include NASA's Perseverance rover searching for signs of ancient life, and the Ingenuity helicopter - the first powered aircraft on another planet! Mars has a thin atmosphere (mostly CO2) and temperatures ranging from -195°F to 70°F. Future human missions are planned for the 2030s."
    }
    
    // The Sun and stars
    else if (q.includes('sun') || q.includes('star') && !q.includes('neutron')) {
      return "Our Sun is a middle-aged, medium-sized star that's been shining for about 4.6 billion years. It converts 600 million tons of hydrogen into helium every second through nuclear fusion, releasing enormous amounts of energy. The Sun's core reaches 15 million°C! Stars form in nebulae when gravity pulls gas and dust together until nuclear fusion ignites. Depending on their mass, stars can live for millions to trillions of years before dying as white dwarfs, neutron stars, or black holes."
    }
    
    // Galaxies and the universe
    else if (q.includes('galaxy') || q.includes('universe') || q.includes('cosmic')) {
      return "Our Milky Way galaxy contains over 100 billion stars and is about 100,000 light-years across. It's just one of trillions of galaxies in the observable universe! The nearest major galaxy is Andromeda, 2.5 million light-years away - it's actually approaching us and will collide with the Milky Way in about 4.5 billion years. The universe is about 13.8 billion years old and is still expanding, with dark matter and dark energy making up about 95% of everything that exists!"
    }
    
    // Space missions and exploration
    else if (q.includes('mission') || q.includes('nasa') || q.includes('esa')) {
      return "Space agencies like NASA, ESA, and others have sent amazing missions throughout the solar system! Examples include: Voyager 1 & 2 (now in interstellar space), Cassini (studied Saturn for 13 years), New Horizons (flew by Pluto), and Parker Solar Probe (touching the Sun's corona). Current exciting missions include Artemis (returning humans to the Moon), Europa Clipper (studying Jupiter's icy moon), and the upcoming Dragonfly mission to Saturn's moon Titan!"
    }
    
    // Space phenomena
    else if (q.includes('supernova') || q.includes('explosion')) {
      return "Supernovas are spectacular stellar explosions that can briefly outshine entire galaxies! They occur when massive stars run out of nuclear fuel and collapse catastrophically, or when white dwarf stars accumulate too much matter from a companion. These explosions create and scatter heavy elements like carbon, oxygen, and iron throughout space - elements that are essential for planets and life. The shock waves can trigger the formation of new stars!"
    }
    
    // Gravitational phenomena
    else if (q.includes('gravity') || q.includes('gravitational') || q.includes('lensing')) {
      return "Gravitational lensing is a fascinating effect where massive objects bend spacetime so much that they act like cosmic magnifying glasses! When light from distant galaxies passes by massive galaxy clusters, the light gets bent and distorted, sometimes creating multiple images or ring-like shapes called 'Einstein rings.' This effect helps us study dark matter and discover extremely distant galaxies we couldn't otherwise see."
    }
    
    // Space technology
    else if (q.includes('rocket') || q.includes('propulsion')) {
      return "Rockets work by Newton's third law - for every action, there's an equal and opposite reaction. They burn fuel to create hot gas that shoots out the back, pushing the rocket forward. Modern rockets use liquid fuels like hydrogen and oxygen, or solid fuels. Ion drives use electricity to accelerate particles for very efficient (but slow) propulsion. Future concepts include nuclear rockets, solar sails, and even theoretical fusion ramjets for interstellar travel!"
    }
    
    // Time and space
    else if (q.includes('time') || q.includes('relativity')) {
      return "Einstein's relativity shows us that time and space are connected! Time passes slower in strong gravitational fields (like near black holes) and when traveling at high speeds. For astronauts on the International Space Station, time actually passes slightly faster than on Earth's surface because they're farther from our planet's gravity well. This isn't science fiction - GPS satellites have to account for these time differences to work accurately!"
    }
    
    // General space questions
    else if (q.includes('space') || q.includes('cosmos') || q.includes('astronomy')) {
      return "Space is an incredible frontier filled with wonders beyond imagination! From the quantum foam at the smallest scales to galaxy superclusters spanning billions of light-years, the universe operates on scales that challenge our understanding. We're made of stellar material - the calcium in our bones, the iron in our blood, and the oxygen we breathe were all forged in the nuclear furnaces of ancient stars. As Carl Sagan said, 'We are made of star stuff!'"
    }
    
    // Default response for other questions
    else {
      return "That's an interesting question! While I specialize in space and astronomy topics, I'd love to help you explore the cosmos. Try asking me about black holes, planets, stars, galaxies, space missions, rockets, or any other space-related phenomena. The universe is full of amazing discoveries waiting to be discussed! 🌌"
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use real AI or enhanced smart response generation
      const aiResponse = await generateSmartResponse(userInput)
      
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      
    } catch (error) {
      console.error('Error generating response:', error)
      
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble processing your question right now. Please try rephrasing it, and I'll do my best to help you explore the cosmos! 🚀",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickSuggestions = [
    "Explain how black holes work",
    "Tell me about SpaceX Starship",
    "What is gravitational lensing?",
    "How do we detect exoplanets?",
    "Explain the James Webb Telescope",
    "What are neutron stars?"
  ]

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion)
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm AstroBot, your advanced space exploration assistant! Ask me anything about the cosmos, planets, stars, galaxies, space missions, astrophysics, or space exploration! 🌌",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-purple-900/20 to-space-blue/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-space-blue/20 rounded-full">
              <MessageCircle className="w-8 h-8 text-space-blue" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Space Assistant</h1>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            Chat with our AI assistant about space, astronomy, and the cosmos
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-space-dark/50 backdrop-blur-sm rounded-2xl border border-space-blue/20 shadow-xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-space-blue/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-space-blue" />
              <span className="text-white font-semibold">AstroBot</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-white hover:bg-space-blue/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-space-blue/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-space-blue" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-space-blue text-white'
                      : 'bg-gray-700/50 text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-space-blue/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-space-blue" />
                </div>
                <div className="bg-gray-700/50 text-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-space-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-space-blue rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-space-blue rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-space-blue/20">
              <p className="text-sm text-gray-400 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="px-3 py-1 text-xs bg-space-blue/20 text-space-blue hover:bg-space-blue/30 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-space-blue/20">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about space, planets, stars, or anything cosmic..."
                className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-space-blue/50 focus:border-transparent resize-none"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-space-blue hover:bg-space-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Powered by Hugging Face AI • Space knowledge at your fingertips</p>
        </div>
      </div>
    </div>
  )
}
export default AIChatPage