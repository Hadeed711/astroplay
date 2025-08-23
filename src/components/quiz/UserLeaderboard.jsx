import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const UserLeaderboard = () => {
  const { user } = useAppStore()
  const [selectedMode, setSelectedMode] = useState('all')
  
  if (!user?.quizHistory || user.quizHistory.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Quiz Attempts</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-slate-400">No quiz attempts yet. Take your first quiz to see your progress!</p>
        </div>
      </div>
    )
  }

  // Filter attempts by mode
  const filteredAttempts = user.quizHistory
    .filter(attempt => selectedMode === 'all' || attempt.mode === selectedMode)
    .sort((a, b) => b.score - a.score) // Sort by score descending

  const modes = [
    { key: 'all', label: 'All Modes', icon: '🏆' },
    { key: 'quick10', label: 'Quick Quiz', icon: '⚡' },
    { key: 'gravity', label: 'Gravity', icon: '🌍' },
    { key: 'orbits', label: 'Orbits', icon: '🪐' },
    { key: 'compact', label: 'Compact Objects', icon: '🕳️' }
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getScoreColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-300'
      case 3: return 'text-orange-400'
      default: return 'text-blue-400'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Your Quiz Attempts</h2>
      
      {/* Mode Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {modes.map(mode => (
          <button
            key={mode.key}
            onClick={() => setSelectedMode(mode.key)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedMode === mode.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-1">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>

      {/* Attempts List */}
      <div className="space-y-2">
        {filteredAttempts.map((attempt, index) => {
          const rank = index + 1
          const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)
          
          return (
            <div
              key={`${attempt.attemptNumber}-${attempt.timestamp}`}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="text-2xl font-bold min-w-[3rem] text-center">
                  {typeof getRankIcon(rank) === 'string' && getRankIcon(rank).startsWith('#') ? (
                    <span className="text-slate-400">{getRankIcon(rank)}</span>
                  ) : (
                    getRankIcon(rank)
                  )}
                </div>
                
                {/* Attempt Info */}
                <div>
                  <div className="font-bold text-white">
                    Attempt #{attempt.attemptNumber}
                  </div>
                  <div className="text-sm text-slate-400">
                    {attempt.mode.charAt(0).toUpperCase() + attempt.mode.slice(1)} • {formatDate(attempt.timestamp)}
                  </div>
                  <div className="text-sm text-slate-300">
                    {attempt.correctAnswers}/{attempt.totalQuestions} correct ({percentage}%)
                    {attempt.maxStreak > 0 && (
                      <span className="ml-2 text-orange-400">🔥 {attempt.maxStreak} streak</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`text-xl font-bold ${getScoreColor(rank)}`}>
                  {attempt.score}
                </div>
                <div className="text-sm text-slate-400">points</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Personal Best */}
      {filteredAttempts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-3">🎯 Personal Records</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {Math.max(...filteredAttempts.map(a => a.score))}
                </div>
                <div className="text-xs text-slate-400">Best Score</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {Math.max(...filteredAttempts.map(a => a.maxStreak || 0))}
                </div>
                <div className="text-xs text-slate-400">Best Streak</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.max(...filteredAttempts.map(a => Math.round((a.correctAnswers / a.totalQuestions) * 100)))}%
                </div>
                <div className="text-xs text-slate-400">Best Accuracy</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {filteredAttempts.length}
                </div>
                <div className="text-xs text-slate-400">Total Attempts</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserLeaderboard