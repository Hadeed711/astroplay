import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const UserSetup = ({ onComplete }) => {
  const { user, setUser } = useAppStore()
  const [name, setName] = useState(user?.name || '')
  const [difficulty, setDifficulty] = useState(user?.difficulty || 'student')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    // Update user in store
    setUser({
      ...user,
      name: name.trim(),
      difficulty
    })
    
    onComplete()
  }

  const difficultyLevels = [
    {
      key: 'eli12',
      title: 'Beginner',
      description: 'Simple explanations, basic concepts',
      icon: '🌟',
      color: 'bg-green-600'
    },
    {
      key: 'student',
      title: 'Student',
      description: 'Moderate difficulty, detailed explanations',
      icon: '🎓',
      color: 'bg-blue-600'
    },
    {
      key: 'pro',
      title: 'Expert',
      description: 'Advanced concepts, technical details',
      icon: '🚀',
      color: 'bg-purple-600'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 pt-16">
      <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 md:p-8 mt-8 max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl mb-4">🚀</div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome to AstroPlay!</h2>
          <p className="text-slate-400 text-sm md:text-base">Let's set up your space exploration profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              maxLength={20}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-white font-medium mb-3">
              Choose Your Level
            </label>
            <div className="space-y-2">
              {difficultyLevels.map((level) => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setDifficulty(level.key)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    difficulty === level.key
                      ? `${level.color} border-white/50`
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="text-left">
                      <div className="text-white font-medium">{level.title}</div>
                      <div className="text-sm text-slate-300">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Start Exploring! 🌌
          </button>
        </form>

        {/* Fun Facts */}
        <div className="mt-6 pt-6 border-t border-slate-600">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Did you know?</p>
            <p className="text-slate-300 text-sm">
              Light from the Sun takes about 8 minutes to reach Earth! ☀️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSetup