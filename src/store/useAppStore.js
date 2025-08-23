import { create } from 'zustand'
import { celestialBodies } from '../data/celestialBodies'

const useAppStore = create((set, get) => ({
  // Current selected celestial body
  selectedObject: { ...celestialBodies.earth, key: 'earth' },
  setSelectedObject: (objectKey) => set({
    selectedObject: { ...celestialBodies[objectKey] || celestialBodies.earth, key: objectKey }
  }),

  // 3D Scene controls
  showGravityField: false,

  showEventHorizon: true,
  showTimeDilation: false,
  showTravelLine: false, // Disabled by default to avoid unwanted lines
  showTravelAnimation: false, // New state for 3D travel animation

  toggleGravityField: () => set((state) => ({ showGravityField: !state.showGravityField })),

  toggleEventHorizon: () => set((state) => ({ showEventHorizon: !state.showEventHorizon })),
  toggleTimeDilation: () => set((state) => ({ showTimeDilation: !state.showTimeDilation })),
  toggleTravelLine: () => set((state) => ({ showTravelLine: !state.showTravelLine })),
  toggleTravelAnimation: () => set((state) => ({ showTravelAnimation: !state.showTravelAnimation })),

  // Physics parameters
  distanceFromSurface: 100, // km
  spacecraftSpeed: 0.1, // fraction of light speed
  orbitAltitude: 400, // km

  setDistanceFromSurface: (distance) => set({ distanceFromSurface: distance }),
  setSpacecraftSpeed: (speed) => set({ spacecraftSpeed: speed }),
  setOrbitAltitude: (altitude) => set({ orbitAltitude: altitude }),

  // Content display level
  explanationLevel: 'student', // 'eli12', 'student', 'pro'
  setExplanationLevel: (level) => set({ explanationLevel: level }),

  // User data and progress
  user: null, // Will be set after user setup
  isUserSetup: false,

  setUser: (userData) => set({
    user: {
      ...userData,
      quizHistory: userData.quizHistory || [],
      quizStats: userData.quizStats || {
        totalQuizzes: 0,
        totalPoints: 0,
        averageScore: 0,
        bestStreak: 0,
      },
      contentProgress: userData.contentProgress || {},
      taskProgress: userData.taskProgress || [],
    },
    isUserSetup: true
  }),

  // Quiz state
  currentQuiz: null,
  quizScore: 0,
  quizStreak: 0,

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  updateQuizScore: (points) => set((state) => ({ quizScore: state.quizScore + points })),
  updateQuizStreak: (correct) => set((state) => ({ quizStreak: correct ? state.quizStreak + 1 : 0 })),
  resetQuiz: () => set({ currentQuiz: null, quizScore: 0, quizStreak: 0 }),

  // User progress tracking
  updateUserProgress: (type, data) => {
    set((state) => {
      const newUser = { ...state.user }

      if (type === 'content') {
        if (!newUser.contentProgress) newUser.contentProgress = {}
        newUser.contentProgress[data.objectId] = {
          ...newUser.contentProgress[data.objectId],
          ...data,
        }
      } else if (type === 'task') {
        if (!newUser.taskProgress) newUser.taskProgress = []
        const existingIndex = newUser.taskProgress.findIndex((t) => t.taskId === data.taskId)
        if (existingIndex >= 0) {
          newUser.taskProgress[existingIndex] = data
        } else {
          newUser.taskProgress.push(data)
        }
      } else if (type === 'quiz') {
        // Initialize quiz tracking
        if (!newUser.quizHistory) newUser.quizHistory = []
        if (!newUser.quizStats) {
          newUser.quizStats = {
            totalQuizzes: 0,
            totalPoints: 0,
            averageScore: 0,
            bestStreak: 0,
          }
        }

        // Add attempt number to quiz data
        const attemptNumber = newUser.quizHistory.length + 1
        const quizWithAttempt = {
          ...data,
          attemptNumber,
          timestamp: new Date().toISOString()
        }

        // Add quiz to history
        newUser.quizHistory.push(quizWithAttempt)

        // Update aggregate stats
        const stats = newUser.quizStats
        stats.totalQuizzes = newUser.quizHistory.length
        stats.totalPoints = newUser.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0)

        const totalCorrect = newUser.quizHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0)
        const totalQuestions = newUser.quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0)
        stats.averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

        stats.bestStreak = Math.max(stats.bestStreak, data.maxStreak)

        // Keep only last 50 quizzes to prevent storage bloat
        if (newUser.quizHistory.length > 50) {
          newUser.quizHistory = newUser.quizHistory.slice(-50)
        }
      }

      return { user: newUser }
    })
  },

  // Content generation helper
  generateContent: (topic, level = 'student') => {
    return `Generated ${level} content for ${topic}`
  },
}))

export { useAppStore }
export default useAppStore
