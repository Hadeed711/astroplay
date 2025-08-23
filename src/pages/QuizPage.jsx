import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuizQuestions, quizModes } from '../data/quizQuestions'
import { useAppStore } from '../store/useAppStore'
import PersonalizedFeedback from '../components/quiz/PersonalizedFeedback'
import UserSetup from '../components/quiz/UserSetup'

const QuizPage = () => {
  const navigate = useNavigate()
  const { user, isUserSetup, updateUserProgress } = useAppStore()
  
  const [selectedMode, setSelectedMode] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showFeedback, setShowFeedback] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && selectedMode && !showResults) {
      handleQuizComplete()
    }
  }, [timeLeft, showResults, selectedMode])

  const startQuiz = (mode) => {
    setSelectedMode(mode)
    const quizQuestions = generateQuizQuestions(mode, user?.difficulty || 'student')
    setQuestions(quizQuestions)
    setTimeLeft(quizModes[mode].timeLimit)
    setCurrentQuestion(0)
    setUserAnswers([])
    setShowResults(false)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setHintsUsed(0)
    setShowHint(false)
    setQuestionStartTime(Date.now())
  }

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion]
    const timeSpent = (Date.now() - questionStartTime) / 1000
    
    let isCorrect = false
    let actualAnswer = answer
    
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        isCorrect = answer === question.correct
        break
      case 'estimation':
        const numAnswer = parseFloat(answer)
        isCorrect = Math.abs(numAnswer - question.correctValue) <= question.tolerance
        actualAnswer = numAnswer
        break
      case 'unit_conversion':
        isCorrect = parseFloat(answer) === question.correct
        actualAnswer = parseFloat(answer)
        break
    }

    // Calculate points with bonuses
    let points = 0
    if (isCorrect) {
      points = question.points
      
      // Speed bonus (answered in under 10 seconds)
      if (timeSpent < 10) points += 5
      
      // Streak bonus
      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak(Math.max(maxStreak, newStreak))
      
      if (newStreak >= 3) points += 2 * newStreak // Escalating streak bonus
      
      // No hint bonus
      if (!showHint) points += 3
    } else {
      setStreak(0)
    }

    setScore(score + points)

    // Record answer
    const answerRecord = {
      questionId: question.id,
      userAnswer: actualAnswer,
      correct: isCorrect,
      timeSpent,
      hintsUsed: showHint ? 1 : 0,
      pointsEarned: points
    }

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerRecord
    setUserAnswers(newAnswers)

    // Reset for next question
    setShowHint(false)
    setQuestionStartTime(Date.now())

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete()
    }
  }

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  const handleQuizComplete = () => {
    setShowResults(true)
    
    // Calculate final stats
    const correctAnswers = userAnswers.filter(a => a.correct).length
    const avgTimePerQuestion = userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / userAnswers.length
    
    const quizResult = {
      mode: selectedMode,
      score: score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: quizModes[selectedMode].timeLimit - timeLeft,
      avgTimePerQuestion,
      maxStreak,
      hintsUsed,
      answers: userAnswers,
      completedAt: new Date().toISOString()
    }
    
    updateUserProgress('quiz', quizResult)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStreakDisplay = () => {
    if (streak === 0) return null
    return (
      <div className="flex items-center gap-2 text-orange-400">
        <span>🔥</span>
        <span className="font-bold">{streak} streak!</span>
      </div>
    )
  }

  // Show user setup if not completed
  if (!isUserSetup || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark pt-24">
        <UserSetup onComplete={() => {}} />
      </div>
    )
  }

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark text-white p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          
          <h1 className="text-5xl font-bold mb-4 text-center">🚀 AstroPlay Quiz Challenge</h1>
          <p className="text-xl text-slate-300 text-center mb-8">Test your space knowledge with interactive quizzes</p>
          
          {/* Difficulty Level Display */}
          <div className="bg-slate-800 rounded-xl p-4 mb-8 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="text-slate-400">Current Level:</span>
              <span className="text-2xl">
                {user.difficulty === 'eli12' ? '🌟' : user.difficulty === 'student' ? '🎓' : '🚀'}
              </span>
              <span className="text-blue-400 font-bold capitalize">
                {user.difficulty === 'eli12' ? 'Beginner' : user.difficulty === 'student' ? 'Student' : 'Expert'}
              </span>
              <button
                onClick={() => navigate('/quiz-dashboard')}
                className="ml-4 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
              >
                Change Level
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(quizModes).map(([key, mode]) => (
              <div
                key={key}
                onClick={() => startQuiz(key)}
                className="bg-slate-800 p-6 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors border border-slate-600 hover:border-blue-500"
              >
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
                <p className="text-slate-300 mb-4">{mode.description}</p>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{mode.questions} questions</span>
                  <span>{Math.floor(mode.timeLimit / 60)} minutes</span>
                </div>
              </div>
            ))}
          </div>

          {/* User stats preview */}
          {user?.quizStats && (
            <div className="mt-12 bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Your Quiz Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{user.quizStats.totalQuizzes || 0}</div>
                  <div className="text-sm text-slate-400">Quizzes Taken</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{user.quizStats.averageScore || 0}%</div>
                  <div className="text-sm text-slate-400">Average Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{user.quizStats.bestStreak || 0}</div>
                  <div className="text-sm text-slate-400">Best Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{user.quizStats.totalPoints || 0}</div>
                  <div className="text-sm text-slate-400">Total Points</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } 
 if (showResults) {
    const correctAnswers = userAnswers.filter(a => a.correct).length
    const percentage = Math.round((correctAnswers / questions.length) * 100)
    const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0)
    const efficiency = Math.round((score / totalPossiblePoints) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark text-white p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Quiz Complete!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Main Results */}
            <div className="bg-slate-800 p-8 rounded-xl text-center">
              <div className="text-6xl mb-4">
                {percentage >= 90 ? '🏆' : percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <div className="text-3xl font-bold mb-2">{score} points</div>
              <div className="text-xl text-slate-300 mb-2">{correctAnswers}/{questions.length} correct ({percentage}%)</div>
              <div className="text-slate-400">
                Efficiency: {efficiency}% • Time: {formatTime(quizModes[selectedMode].timeLimit - timeLeft)}
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-slate-800 p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Performance Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Best Streak:</span>
                  <span className="text-orange-400 font-bold">🔥 {maxStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hints Used:</span>
                  <span className="text-blue-400">{hintsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Time/Question:</span>
                  <span className="text-green-400">
                    {Math.round(userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / userAnswers.length)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Speed Bonuses:</span>
                  <span className="text-purple-400">
                    {userAnswers.filter(a => a.timeSpent < 10 && a.correct).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-slate-800 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-bold mb-4">Question Review</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const answer = userAnswers[index]
                return (
                  <div key={question.id} className={`p-4 rounded-lg ${answer.correct ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={answer.correct ? 'text-green-400' : 'text-red-400'}>
                        {answer.correct ? '✓' : '✗'}
                      </span>
                      <span className="font-medium">Q{index + 1}: {question.question}</span>
                      <span className="text-sm text-slate-400">+{answer.pointsEarned} pts</span>
                    </div>
                    <p className="text-sm text-slate-300 ml-6">{question.explanation}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => startQuiz(selectedMode)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setSelectedMode(null)}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Choose Different Mode
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              View Feedback
            </button>
          </div>

          {/* Personalized Feedback Modal */}
          {showFeedback && (
            <PersonalizedFeedback
              quizResult={{
                mode: selectedMode,
                score: score,
                totalQuestions: questions.length,
                correctAnswers,
                timeSpent: quizModes[selectedMode].timeLimit - timeLeft,
                avgTimePerQuestion: userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / userAnswers.length,
                maxStreak,
                hintsUsed,
                answers: userAnswers
              }}
              onClose={() => setShowFeedback(false)}
            />
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  if (!question) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark via-space-purple/20 to-space-dark text-white p-6 pt-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-lg">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            {getStreakDisplay()}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono">
              ⏱️ {formatTime(timeLeft)}
            </div>
            <div className="text-lg text-blue-400">
              {score} pts
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-slate-800 p-8 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{quizModes[selectedMode].icon}</span>
              <span className="text-sm text-slate-400 uppercase tracking-wide">
                {question.topic} • {question.points} points
              </span>
            </div>
            
            {!showHint && (
              <button
                onClick={useHint}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
              >
                💡 Hint
              </button>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

          {/* Hint display */}
          {showHint && (
            <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="font-medium text-yellow-400">Hint:</span>
              </div>
              <p className="text-yellow-100">{question.explanation}</p>
            </div>
          )}

          {/* Answer options based on question type */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <span className="font-mono text-blue-400 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                False
              </button>
            </div>
          )}

          {(question.type === 'estimation' || question.type === 'unit_conversion') && (
            <div className="space-y-4">
              <input
                type="number"
                step="any"
                placeholder={`Enter your answer${question.unit ? ` (${question.unit})` : ''}`}
                className="w-full p-4 bg-slate-700 rounded-lg text-white placeholder-slate-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswer(e.target.value)
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  handleAnswer(input.value)
                }}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPage