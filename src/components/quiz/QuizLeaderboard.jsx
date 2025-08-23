import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const QuizLeaderboard = () => {
  const { user } = useAppStore()
  const [selectedMode, setSelectedMode] = useState('all')
  
  // Mock leaderboard data - in a real app this would come from a backend
  const mockLeaderboard = [
    { name: 'Cosmic Explorer', score: 2450, streak: 12, mode: 'gravity' },
    { name: 'Star Navigator', score: 2380, streak: 8, mode: 'orbits' },
    { name: 'Physics Master', score: 2290, streak: 15, mode: 'compact' },
    { name: 'Space Cadet', score: 2150, streak: 6, mode: 'quick10' },
    { name: 'Gravity Guru', score: 2100, streak: 9, mode: 'gravity' },
    { name: 'Orbit Ace', score: 2050, streak: 7, mode: 'orbits' },
    { name: 'Black Hole Expert', score: 1980, streak: 11, mode: 'compact' },
    { name: 'Speed Runner', score: 1920, streak: 5, mode: 'quick10' }
  ]

  // Add current user to leaderboard if they have quiz stats
  const leaderboardData = [...mockLeaderboard]
  if (user?.quizStats?.totalPoints > 0) {
    leaderboardData.push({
      name: user.name + ' (You)',
      score: user.quizStats.totalPoints,
      streak: user.quizStats.bestStreak,
      mode: 'all',
      isCurrentUser: true
    })
  }

  // Sort by score and filter by mode
  const filteredData = leaderboardData
    .filter(entry => selectedMode === 'all' || entry.mode === selectedMode)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // Top 10

  const modes = [
    { key: 'all', label: 'All Modes', icon: '🏆' },
    { key: 'quick10', label: 'Quick 10', icon: '⚡' },
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

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Quiz Leaderboard</h2>
      
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

      {/* Leaderboard List */}
      <div className="space-y-2">
        {filteredData.map((entry, index) => {
          const rank = index + 1
          return (
            <div
              key={`${entry.name}-${entry.score}`}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                entry.isCurrentUser
                  ? 'bg-blue-900/50 border border-blue-500/50'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
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
                
                {/* Player Info */}
                <div>
                  <div className={`font-bold ${entry.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {entry.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    Best Streak: {entry.streak} • Mode: {entry.mode}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`text-xl font-bold ${getScoreColor(rank)}`}>
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">points</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* User's Position (if not in top 10) */}
      {user?.quizStats?.totalPoints > 0 && !filteredData.some(entry => entry.isCurrentUser) && (
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="text-center text-slate-400 mb-2">Your Position</div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-slate-400">
                  #{leaderboardData.findIndex(entry => entry.isCurrentUser) + 1}
                </div>
                <div>
                  <div className="font-bold text-blue-300">{user.name} (You)</div>
                  <div className="text-sm text-slate-400">
                    Best Streak: {user.quizStats.bestStreak}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-400">
                  {user.quizStats.totalPoints.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">points</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="mt-6 pt-4 border-t border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3 text-center">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🔥', name: 'Streak Master', desc: '10+ streak' },
            { icon: '⚡', name: 'Speed Demon', desc: 'Fast answers' },
            { icon: '🧠', name: 'No Hints', desc: 'Independent' },
            { icon: '🎯', name: 'Perfect Score', desc: '100% correct' }
          ].map((badge, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs font-medium text-white">{badge.name}</div>
              <div className="text-xs text-slate-400">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      {(!user?.quizStats || user.quizStats.totalQuizzes < 5) && (
        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
            <div className="text-white font-bold mb-2">🚀 Ready to Climb the Ranks?</div>
            <div className="text-blue-100 text-sm">
              Take more quizzes to improve your position and unlock achievements!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizLeaderboard