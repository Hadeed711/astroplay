import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getSceneQuestions } from '../../data/quizQuestions'

const SceneQuiz = ({ onComplete, onClose }) => {
  const { selectedObject, showGravityField, showEscapeVelocity, showEventHorizon } = useAppStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // Generate questions based on current scene state
    const visualizations = {
      gravity: showGravityField,
      escape: showEscapeVelocity,
      horizon: showEventHorizon
    }
    
    const sceneQuestions = getSceneQuestions(selectedObject, visualizations)
    setQuestions(sceneQuestions.filter(q => {
      // Only include questions for active visualizations
      return !q.requiresVisualization || visualizations[q.requiresVisualization]
    }))
  }, [selectedObject, showGravityField, showEscapeVelocity, showEventHorizon])

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion]
    const isCorrect = answer === question.correct
    
    const answerRecord = {
      questionId: question.id,
      userAnswer: answer,
      correct: isCorrect,
      pointsEarned: isCorrect ? question.points : 0
    }

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerRecord
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + question.points)
    }

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz complete
      const result = {
        type: 'scene_reading',
        object: selectedObject.name,
        score: score + (isCorrect ? question.points : 0),
        totalQuestions: questions.length,
        correctAnswers: newAnswers.filter(a => a.correct).length + (isCorrect ? 1 : 0),
        answers: [...newAnswers, answerRecord]
      }
      onComplete(result)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-4">Scene Reading Quiz</h2>
          <p className="text-slate-300 mb-6">
            Enable some visualizations (gravity field, escape velocity, etc.) to unlock scene-reading questions!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Scene Reading Quiz</h2>
              <p className="text-slate-400">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Current Object Context */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{selectedObject.emoji}</div>
              <div>
                <div className="text-white font-medium">Observing: {selectedObject.name}</div>
                <div className="text-sm text-slate-400">
                  Active visualizations: {[
                    showGravityField && 'Gravity Field',
                    showEscapeVelocity && 'Escape Velocity',
                    showEventHorizon && 'Event Horizon'
                  ].filter(Boolean).join(', ') || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔍</span>
              <span className="text-sm text-slate-400 uppercase tracking-wide">
                {question.topic} • {question.points} points
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-6">{question.question}</h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white"
                >
                  <span className="font-mono text-blue-400 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>💡</span>
              <span className="font-medium text-blue-300">Hint:</span>
            </div>
            <p className="text-blue-100 text-sm">
              Look carefully at the 3D scene. The visualization shows real physics in action!
            </p>
          </div>

          {/* Score Display */}
          <div className="mt-4 text-center">
            <span className="text-slate-400">Current Score: </span>
            <span className="text-blue-400 font-bold">{score} points</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SceneQuiz