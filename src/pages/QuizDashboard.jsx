import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import QuizStats from '../components/quiz/QuizStats'
import PersonalizedFeedback from '../components/quiz/PersonalizedFeedback'
import DailyChallenge from '../components/quiz/DailyChallenge'
import UserSetup from '../components/quiz/UserSetup'
import { quizModes } from '../data/quizQuestions'

const QuizDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isUserSetup } = useAppStore()
  const [activeTab, setActiveTab] = useState('overview')

  // Handle URL parameters for direct navigation to tabs
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'rewards'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [location.search])

  // Show user setup if not completed
  if (!isUserSetup || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark pt-24">
        <UserSetup onComplete={() => {}} />
      </div>
    )
  }

  const getTodayPerformance = () => {
    if (!user?.quizHistory || user.quizHistory.length === 0) return null
    
    const today = new Date().toDateString()
    const todayQuizzes = user.quizHistory.filter(quiz => 
      new Date(quiz.completedAt).toDateString() === today
    )
    
    if (todayQuizzes.length === 0) return null
    
    const totalCorrect = todayQuizzes.reduce((sum, quiz) => sum + quiz.correctAnswers, 0)
    const totalQuestions = todayQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0)
    
    return {
      percentage: Math.round((totalCorrect / totalQuestions) * 100),
      quizzesTaken: todayQuizzes.length,
      totalScore: todayQuizzes.reduce((sum, quiz) => sum + quiz.score, 0)
    }
  }

  const getRecommendedQuiz = () => {
    if (!user?.quizHistory || user.quizHistory.length === 0) {
      return { mode: 'quick10', reason: 'Perfect for getting started!' }
    }

    // Analyze weak areas
    const modePerformance = {}
    user.quizHistory.forEach(quiz => {
      if (!modePerformance[quiz.mode]) {
        modePerformance[quiz.mode] = { correct: 0, total: 0 }
      }
      modePerformance[quiz.mode].correct += quiz.correctAnswers
      modePerformance[quiz.mode].total += quiz.totalQuestions
    })

    // Find weakest mode
    let weakestMode = 'quick10'
    let lowestScore = 1
    
    Object.entries(modePerformance).forEach(([mode, stats]) => {
      const score = stats.correct / stats.total
      if (score < lowestScore) {
        lowestScore = score
        weakestMode = mode
      }
    })

    return {
      mode: weakestMode,
      reason: `Improve your ${quizModes[weakestMode]?.title} performance`
    }
  }

  const todayPerformance = getTodayPerformance()
  const recommendedQuiz = getRecommendedQuiz()

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'rewards', label: 'Rewards', icon: '🌌' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">📊 Quiz Dashboard</h1>
            <p className="text-slate-400 text-lg">Track your progress and challenge yourself</p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🚀</span>
            Take Quiz
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Today's Performance */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🌅</span>
                  Today's Performance
                </h3>
                {todayPerformance ? (
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {todayPerformance.percentage}%
                    </div>
                    <div className="text-sm text-slate-400">
                      {todayPerformance.quizzesTaken} quiz{todayPerformance.quizzesTaken > 1 ? 'es' : ''} today
                    </div>
                    <div className="text-sm mt-2 text-green-400">
                      🏆 Total Score: {todayPerformance.totalScore}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">�</div>
                    <p className="text-slate-400">No quizzes taken today</p>
                  </div>
                )}
              </div>

              {/* Total Stats */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Total Achievement
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {user?.quizStats?.totalPoints || 0}
                </div>
                <div className="text-sm text-slate-400 mb-2">Total Points</div>
                <div className="text-sm text-orange-400">
                  🔥 Best Streak: {user?.quizStats?.bestStreak || 0}
                </div>
              </div>

              {/* Recommended Quiz */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Recommended
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{quizModes[recommendedQuiz.mode]?.icon}</span>
                  <div>
                    <div className="font-medium">{quizModes[recommendedQuiz.mode]?.title}</div>
                    <div className="text-sm text-slate-400">{recommendedQuiz.reason}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/quiz')}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                >
                  Start Quiz
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(quizModes).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => navigate('/quiz')}
                    className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">{mode.icon}</div>
                    <div className="font-medium text-sm">{mode.title}</div>
                    <div className="text-xs text-slate-400">{mode.questions} questions</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Quiz History */}
            {user?.quizHistory && user.quizHistory.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Recent Quizzes</h3>
                <div className="space-y-3">
                  {user.quizHistory.slice(-3).reverse().map((quiz, index) => {
                    const percentage = Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)
                    const date = new Date(quiz.completedAt).toLocaleDateString()
                    
                    return (
                      <div key={index} className="bg-slate-700 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{quizModes[quiz.mode]?.icon}</span>
                          <div>
                            <div className="font-medium">{quizModes[quiz.mode]?.title}</div>
                            <div className="text-sm text-slate-400">{date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-400">{quiz.score} pts</div>
                          <div className="text-sm text-slate-400">{percentage}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && <DailyChallenge />}
      </div>
    </div>
  )
}

export default QuizDashboard