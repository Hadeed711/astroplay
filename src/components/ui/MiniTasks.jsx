import { useState, useEffect } from 'react'
import useAppStore from '../../store/useAppStore'

const MiniTasks = () => {
  const {
    selectedObject,
    spacecraftSpeed,
    showGravityField,
    showEscapeVelocity,
    showTimeDilation,
    explanationLevel,
    setSpacecraftSpeed,
    toggleGravityField,
    toggleEscapeVelocity,
    setSelectedObject
  } = useAppStore()

  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [currentChallenge, setCurrentChallenge] = useState(0)

  // Define tasks based on current object and explanation level
  const tasks = [
    {
      id: 'speed_experiment',
      title: 'Speed Experiment',
      description: 'Set spacecraft speed to 20% of light speed',
      icon: '🚀',
      target: { spacecraftSpeed: 0.2 },
      tolerance: 0.02,
      reward: 'See how travel time changes dramatically!',
      hint: 'Use the spacecraft speed slider in the control panel'
    },
    {
      id: 'gravity_visualization',
      title: 'Gravity Explorer',
      description: 'Toggle gravity field visualization ON',
      icon: '🌌',
      target: { showGravityField: true },
      reward: 'Watch particles fall toward the object!',
      hint: 'Find the gravity field toggle in the controls'
    },
    {
      id: 'escape_velocity',
      title: 'Escape Artist',
      description: 'Enable escape velocity visualization',
      icon: '🎯',
      target: { showEscapeVelocity: true },
      reward: 'See which trajectories escape and which fall back!',
      hint: 'Look for the escape velocity toggle'
    },
    {
      id: 'object_comparison',
      title: 'Cosmic Comparison',
      description: selectedObject.name === 'Earth' ? 'Switch to a black hole' : 'Switch to Earth',
      icon: '⚖️',
      target: { 
        selectedObject: selectedObject.name === 'Earth' ? 'blackHole' : 'earth' 
      },
      reward: 'Notice the extreme differences in physics!',
      hint: 'Use the object selector dropdown'
    },
    {
      id: 'time_dilation',
      title: 'Time Traveler',
      description: 'Enable time dilation visualization',
      icon: '⏰',
      target: { showTimeDilation: true },
      reward: 'See how time flows differently near massive objects!',
      hint: 'Toggle time dilation in the control panel',
      requiresCompact: true
    },
    {
      id: 'high_speed',
      title: 'Near Light Speed',
      description: 'Set speed to 90% of light speed',
      icon: '⚡',
      target: { spacecraftSpeed: 0.9 },
      tolerance: 0.05,
      reward: 'Experience relativistic travel times!',
      hint: 'Push the speed slider to maximum'
    }
  ]

  // Filter tasks based on current context
  const availableTasks = tasks.filter(task => {
    if (task.requiresCompact && selectedObject.type !== 'compact') {
      return false
    }
    return true
  })

  // Check if current task is completed
  useEffect(() => {
    const currentTask = availableTasks[currentChallenge]
    if (!currentTask) return

    let isCompleted = false

    if (currentTask.target.spacecraftSpeed !== undefined) {
      const tolerance = currentTask.tolerance || 0.01
      isCompleted = Math.abs(spacecraftSpeed - currentTask.target.spacecraftSpeed) <= tolerance
    } else if (currentTask.target.showGravityField !== undefined) {
      isCompleted = showGravityField === currentTask.target.showGravityField
    } else if (currentTask.target.showEscapeVelocity !== undefined) {
      isCompleted = showEscapeVelocity === currentTask.target.showEscapeVelocity
    } else if (currentTask.target.showTimeDilation !== undefined) {
      isCompleted = showTimeDilation === currentTask.target.showTimeDilation
    } else if (currentTask.target.selectedObject !== undefined) {
      isCompleted = selectedObject.name.toLowerCase().replace(/\s+/g, '') === 
        (currentTask.target.selectedObject === 'earth' ? 'earth' : 'stellarblackhole')
    }

    if (isCompleted && !completedTasks.has(currentTask.id)) {
      setCompletedTasks(prev => new Set([...prev, currentTask.id]))
      // Auto-advance to next task after a delay
      setTimeout(() => {
        if (currentChallenge < availableTasks.length - 1) {
          setCurrentChallenge(prev => prev + 1)
        }
      }, 2000)
    }
  }, [spacecraftSpeed, showGravityField, showEscapeVelocity, showTimeDilation, selectedObject, currentChallenge, availableTasks, completedTasks])

  const currentTask = availableTasks[currentChallenge]
  const isCurrentTaskCompleted = currentTask && completedTasks.has(currentTask.id)
  const completionPercentage = (completedTasks.size / availableTasks.length) * 100

  const handleTaskAction = (task) => {
    if (task.target.spacecraftSpeed !== undefined) {
      setSpacecraftSpeed(task.target.spacecraftSpeed)
    } else if (task.target.showGravityField !== undefined) {
      if (showGravityField !== task.target.showGravityField) {
        toggleGravityField()
      }
    } else if (task.target.showEscapeVelocity !== undefined) {
      if (showEscapeVelocity !== task.target.showEscapeVelocity) {
        toggleEscapeVelocity()
      }
    } else if (task.target.selectedObject !== undefined) {
      setSelectedObject(task.target.selectedObject)
    }
  }

  const nextTask = () => {
    if (currentChallenge < availableTasks.length - 1) {
      setCurrentChallenge(prev => prev + 1)
    }
  }

  const prevTask = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(prev => prev - 1)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium flex items-center">
          <span className="mr-2">🎯</span>
          Interactive Challenges
        </h4>
        <div className="text-sm text-gray-400">
          {completedTasks.size}/{availableTasks.length} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-space-gold to-space-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Progress: {completionPercentage.toFixed(0)}%
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className={`rounded-lg border p-4 transition-all duration-300 ${
          isCurrentTaskCompleted 
            ? 'bg-green-900/20 border-green-500/50' 
            : 'bg-space-blue/20 border-space-blue/50'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{currentTask.icon}</span>
              <div>
                <h5 className="text-white font-medium">{currentTask.title}</h5>
                <p className="text-gray-300 text-sm">{currentTask.description}</p>
              </div>
            </div>
            {isCurrentTaskCompleted && (
              <div className="text-green-400 text-xl">✅</div>
            )}
          </div>

          {isCurrentTaskCompleted ? (
            <div className="bg-green-900/30 rounded p-3 border border-green-500/30">
              <p className="text-green-300 text-sm font-medium">🎉 Task Completed!</p>
              <p className="text-green-200 text-xs mt-1">{currentTask.reward}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-space-dark/50 rounded p-3">
                <p className="text-gray-400 text-xs">
                  💡 Hint: {currentTask.hint}
                </p>
              </div>
              
              <button
                onClick={() => handleTaskAction(currentTask)}
                className="w-full bg-space-gold hover:bg-space-gold/80 text-space-dark font-medium py-2 px-4 rounded transition-colors"
              >
                Quick Action
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevTask}
          disabled={currentChallenge === 0}
          className="px-3 py-1 bg-space-dark border border-space-blue/30 text-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-space-blue/20 transition-colors"
        >
          ← Previous
        </button>
        
        <span className="text-gray-400 text-sm self-center">
          {currentChallenge + 1} of {availableTasks.length}
        </span>
        
        <button
          onClick={nextTask}
          disabled={currentChallenge === availableTasks.length - 1}
          className="px-3 py-1 bg-space-dark border border-space-blue/30 text-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-space-blue/20 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Completed Tasks Summary */}
      {completedTasks.size > 0 && (
        <div className="mt-4 p-3 bg-space-dark/30 rounded border border-space-blue/20">
          <h6 className="text-gray-300 text-sm font-medium mb-2">Completed Challenges:</h6>
          <div className="flex flex-wrap gap-1">
            {Array.from(completedTasks).map(taskId => {
              const task = tasks.find(t => t.id === taskId)
              return task ? (
                <span key={taskId} className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                  {task.icon} {task.title}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* All Tasks Completed */}
      {completedTasks.size === availableTasks.length && (
        <div className="mt-4 p-4 bg-gradient-to-r from-space-gold/20 to-space-purple/20 rounded-lg border border-space-gold/50">
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h5 className="text-space-gold font-bold mb-1">Congratulations!</h5>
            <p className="text-gray-300 text-sm">
              You've completed all challenges for {selectedObject.name}!
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Try selecting a different celestial object for new challenges.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniTasks