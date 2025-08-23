import useAppStore from '../../store/useAppStore'

const ExplanationLevel = () => {
  const { explanationLevel, setExplanationLevel } = useAppStore()

  const levels = [
    { 
      key: 'eli12', 
      label: 'ELI12', 
      description: 'Simple explanations for young learners',
      icon: '🧒'
    },
    { 
      key: 'student', 
      label: 'Student', 
      description: 'Educational content for students',
      icon: '🎓'
    },
    { 
      key: 'pro', 
      label: 'Professional', 
      description: 'Technical details for experts',
      icon: '🔬'
    }
  ]

  return (
    <div className="mb-6">
      <h4 className="text-white font-medium mb-3">Explanation Level</h4>
      <div className="grid grid-cols-3 gap-2">
        {levels.map((level) => (
          <button
            key={level.key}
            onClick={() => setExplanationLevel(level.key)}
            className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
              explanationLevel === level.key
                ? 'border-space-gold bg-space-gold/10 text-white'
                : 'border-space-blue/30 bg-space-dark/50 text-gray-300 hover:border-space-blue/50'
            }`}
          >
            <div className="text-lg mb-1">{level.icon}</div>
            <div className="text-xs font-medium">{level.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ExplanationLevel