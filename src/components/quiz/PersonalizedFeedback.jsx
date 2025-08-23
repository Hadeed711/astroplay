import React from 'react'
import { useAppStore } from '../../store/useAppStore'

const PersonalizedFeedback = ({ quizResult, onClose }) => {
  const { user, generateContent } = useAppStore()
  
  const getFeedbackLevel = (percentage) => {
    if (percentage >= 90) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 60) return 'average'
    return 'needs_improvement'
  }

  const getPersonalizedMessage = () => {
    const percentage = Math.round((quizResult.correctAnswers / quizResult.totalQuestions) * 100)
    const level = getFeedbackLevel(percentage)
    
    const messages = {
      excellent: [
        "Outstanding work! You've mastered these concepts beautifully.",
        "Incredible performance! Your understanding of space physics is impressive.",
        "Perfect! You're ready for more advanced challenges."
      ],
      good: [
        "Great job! You have a solid grasp of the fundamentals.",
        "Well done! A few more practice sessions and you'll be an expert.",
        "Nice work! Your space knowledge is really developing."
      ],
      average: [
        "Good effort! Let's focus on strengthening a few key areas.",
        "You're on the right track! Some review will boost your confidence.",
        "Solid foundation! Time to dive deeper into the concepts."
      ],
      needs_improvement: [
        "Keep going! Every expert started where you are now.",
        "Don't worry! These concepts take time to master.",
        "Great start! Let's build up your space knowledge step by step."
      ]
    }
    
    return messages[level][Math.floor(Math.random() * messages[level].length)]
  }

  const getWeakAreas = () => {
    const topicPerformance = {}
    
    quizResult.answers.forEach((answer, index) => {
      const question = answer.questionId
      const topic = question.split('_')[0] // Extract topic from question ID
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 }
      }
      
      topicPerformance[topic].total++
      if (answer.correct) {
        topicPerformance[topic].correct++
      }
    })
    
    return Object.entries(topicPerformance)
      .filter(([topic, stats]) => stats.correct / stats.total < 0.7)
      .map(([topic]) => topic)
  }

  const getRecommendations = () => {
    const weakAreas = getWeakAreas()
    const recommendations = []
    
    if (weakAreas.includes('gravity') || weakAreas.includes('g')) {
      recommendations.push({
        title: "Explore Gravity Visualizations",
        description: "Visit the 3D scene and experiment with different celestial bodies to see how gravity works.",
        action: "Go to 3D Scene",
        icon: "🌍"
      })
    }
    
    if (weakAreas.includes('compact') || weakAreas.includes('c')) {
      recommendations.push({
        title: "Learn About Black Holes",
        description: "Read our content on compact objects and their extreme physics.",
        action: "Read Content",
        icon: "🕳️"
      })
    }
    
    if (weakAreas.includes('orbits') || weakAreas.includes('o')) {
      recommendations.push({
        title: "Practice Orbital Mechanics",
        description: "Try the orbital visualization to understand how objects move in space.",
        action: "Try Simulation",
        icon: "🪐"
      })
    }
    
    if (quizResult.hintsUsed > quizResult.totalQuestions / 2) {
      recommendations.push({
        title: "Review Fundamentals",
        description: "Strengthen your foundation with our beginner-friendly explanations.",
        action: "Study Basics",
        icon: "📚"
      })
    }
    
    return recommendations
  }

  const getAchievements = () => {
    const achievements = []
    
    if (quizResult.maxStreak >= 5) {
      achievements.push({
        title: "Streak Master",
        description: `Amazing ${quizResult.maxStreak}-question streak!`,
        icon: "🔥"
      })
    }
    
    if (quizResult.hintsUsed === 0) {
      achievements.push({
        title: "Independent Thinker",
        description: "Completed without using any hints!",
        icon: "🧠"
      })
    }
    
    const speedBonuses = quizResult.answers.filter(a => a.timeSpent < 10 && a.correct).length
    if (speedBonuses >= quizResult.totalQuestions / 2) {
      achievements.push({
        title: "Speed Demon",
        description: "Lightning-fast correct answers!",
        icon: "⚡"
      })
    }
    
    const percentage = Math.round((quizResult.correctAnswers / quizResult.totalQuestions) * 100)
    if (percentage === 100) {
      achievements.push({
        title: "Perfect Score",
        description: "Flawless performance!",
        icon: "🏆"
      })
    }
    
    return achievements
  }

  const recommendations = getRecommendations()
  const achievements = getAchievements()
  const personalMessage = getPersonalizedMessage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Personalized Feedback</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Personal Message */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold text-blue-300">Personal Message</span>
            </div>
            <p className="text-white">{personalMessage}</p>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">🏆 Achievements Unlocked</h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-yellow-300">{achievement.title}</div>
                        <div className="text-sm text-yellow-100">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">📈 Recommended Next Steps</h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                        <p className="text-slate-300 text-sm mb-2">{rec.description}</p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          {rec.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Plan */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">📅 Your Study Plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-slate-300">Review quiz explanations (5 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-slate-300">Practice with 3D visualizations (10 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-slate-300">Read related content (15 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                <span className="text-slate-300">Take another quiz tomorrow</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Continue Learning
            </button>
            <button
              onClick={() => {
                // Share results functionality could go here
                navigator.clipboard.writeText(`I scored ${quizResult.score} points on AstroPlay! 🚀`)
              }}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white transition-colors"
            >
              Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedFeedback