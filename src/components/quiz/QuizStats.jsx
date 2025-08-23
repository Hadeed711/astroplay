import React from 'react'
import { useAppStore } from '../../store/useAppStore'

const QuizStats = () => {
  const { user } = useAppStore()
  
  if (!user?.quizHistory || user.quizHistory.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quiz Statistics</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-slate-400">No quiz data yet. Take your first quiz to see stats!</p>
        </div>
      </div>
    )
  }

  const calculateStats = () => {
    const history = user?.quizHistory || []
    if (history.length === 0) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalPoints: 0,
        totalTime: 0,
        averageScore: 0,
        bestStreak: 0,
        totalHints: 0,
        modeStats: {},
        recentAverage: 0
      }
    }
    
    const totalQuizzes = history.length
    const totalQuestions = history.reduce((sum, quiz) => sum + (quiz.totalQuestions || 0), 0)
    const totalCorrect = history.reduce((sum, quiz) => sum + (quiz.correctAnswers || 0), 0)
    const totalPoints = history.reduce((sum, quiz) => sum + (quiz.score || 0), 0)
    const totalTime = history.reduce((sum, quiz) => sum + (quiz.timeSpent || 0), 0)
    
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const bestStreak = history.length > 0 ? Math.max(...history.map(quiz => quiz.maxStreak || 0)) : 0
    const totalHints = history.reduce((sum, quiz) => sum + (quiz.hintsUsed || 0), 0)
    
    // Mode performance
    const modeStats = {}
    history.forEach(quiz => {
      if (!modeStats[quiz.mode]) {
        modeStats[quiz.mode] = { attempts: 0, totalScore: 0, bestScore: 0 }
      }
      modeStats[quiz.mode].attempts++
      modeStats[quiz.mode].totalScore += quiz.score
      modeStats[quiz.mode].bestScore = Math.max(modeStats[quiz.mode].bestScore, quiz.score)
    })
    
    // Recent performance trend
    const recentQuizzes = history.slice(-5)
    const recentAverage = recentQuizzes.length > 0 
      ? Math.round((recentQuizzes.reduce((sum, quiz) => {
          const questions = quiz.totalQuestions || 1
          const correct = quiz.correctAnswers || 0
          return sum + (correct / questions)
        }, 0) / recentQuizzes.length) * 100)
      : 0
    
    return {
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      totalPoints,
      totalTime,
      averageScore,
      bestStreak,
      totalHints,
      modeStats,
      recentAverage
    }
  }

  const stats = calculateStats()
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getPerformanceTrend = () => {
    const recent = user.quizHistory.slice(-5)
    if (recent.length < 2) return 'neutral'
    
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2))
    const secondHalf = recent.slice(Math.floor(recent.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, quiz) => sum + (quiz.correctAnswers / quiz.totalQuestions), 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, quiz) => sum + (quiz.correctAnswers / quiz.totalQuestions), 0) / secondHalf.length
    
    if (secondAvg > firstAvg + 0.1) return 'improving'
    if (secondAvg < firstAvg - 0.1) return 'declining'
    return 'stable'
  }

  const trend = getPerformanceTrend()
  const trendIcons = {
    improving: { icon: '📈', color: 'text-green-400', text: 'Improving' },
    declining: { icon: '📉', color: 'text-red-400', text: 'Needs Focus' },
    stable: { icon: '➡️', color: 'text-blue-400', text: 'Consistent' }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quiz Statistics Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalQuizzes}</div>
            <div className="text-sm text-slate-400">Quizzes Taken</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.averageScore}%</div>
            <div className="text-sm text-slate-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.bestStreak}</div>
            <div className="text-sm text-slate-400">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalPoints}</div>
            <div className="text-sm text-slate-400">Total Points</div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Recent Performance</div>
              <div className="text-sm text-slate-400">Last 5 quizzes: {stats.recentAverage}% average</div>
            </div>
            <div className={`flex items-center gap-2 ${trendIcons[trend].color}`}>
              <span className="text-xl">{trendIcons[trend].icon}</span>
              <span className="font-medium">{trendIcons[trend].text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Performance */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Performance by Mode</h3>
        <div className="space-y-3">
          {Object.entries(stats.modeStats).map(([mode, data]) => {
            const avgScore = Math.round(data.totalScore / data.attempts)
            const modeIcons = {
              quick10: '⚡',
              gravity: '🌍',
              orbits: '🪐',
              compact: '🕳️'
            }
            
            return (
              <div key={mode} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{modeIcons[mode] || '📝'}</span>
                    <div>
                      <div className="text-white font-medium capitalize">{mode.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-sm text-slate-400">{data.attempts} attempts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{avgScore} pts avg</div>
                    <div className="text-sm text-slate-400">Best: {data.bestScore}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Learning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-white font-bold">{formatTime(stats.totalTime)}</div>
            <div className="text-sm text-slate-400">Total Study Time</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💡</div>
            <div className="text-white font-bold">{stats.totalHints}</div>
            <div className="text-sm text-slate-400">Hints Used</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-white font-bold">{Math.round((stats.totalCorrect / stats.totalQuestions) * 100)}%</div>
            <div className="text-sm text-slate-400">Overall Accuracy</div>
          </div>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Quiz History</h3>
        <div className="space-y-2">
          {user.quizHistory.slice(-5).reverse().map((quiz, index) => {
            const percentage = Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)
            const date = new Date(quiz.completedAt).toLocaleDateString()
            
            return (
              <div key={index} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {quiz.mode === 'quick10' ? '⚡' : 
                       quiz.mode === 'gravity' ? '🌍' :
                       quiz.mode === 'orbits' ? '🪐' : '🕳️'}
                    </span>
                    <div>
                      <div className="text-white font-medium capitalize">
                        {quiz.mode.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-sm text-slate-400">{date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{quiz.score} pts</div>
                    <div className="text-sm text-slate-400">{percentage}% correct</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizStats