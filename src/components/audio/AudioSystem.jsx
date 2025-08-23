import { useState, useEffect, useRef, createContext, useContext } from 'react'

const AudioContext = createContext()

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audioRefs = useRef({})
  const gainNodeRef = useRef(null)
  const audioContextRef = useRef(null)

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.value = volume
      } catch (error) {
        console.warn('Web Audio API not supported:', error)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isEnabled ? volume : 0
    }
  }, [volume, isEnabled])

  // Audio files configuration
  const audioFiles = {
    ambient: {
      deep_space: '/audio/deep_space_ambient.mp3',
      solar_wind: '/audio/solar_wind.mp3',
      pulsar: '/audio/pulsar_rhythm.mp3'
    },
    effects: {
      object_select: '/audio/object_select.wav',
      travel_start: '/audio/travel_start.wav',
      time_dilation: '/audio/time_dilation.wav',
      gravity_field: '/audio/gravity_field.wav',
      escape_velocity: '/audio/escape_velocity.wav',
      quiz_correct: '/audio/quiz_correct.wav',
      quiz_wrong: '/audio/quiz_wrong.wav',
      ui_click: '/audio/ui_click.wav',
      ui_hover: '/audio/ui_hover.wav'
    },
    object_specific: {
      black_hole: '/audio/black_hole_accretion.mp3',
      neutron_star: '/audio/neutron_star_pulse.mp3',
      star: '/audio/stellar_fusion.mp3',
      planet: '/audio/planetary_atmosphere.mp3'
    }
  }

  // Create synthetic audio for missing files
  const createSyntheticAudio = (type, frequency = 440, duration = 1) => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const envelope = audioContextRef.current.createGain()
    
    oscillator.connect(envelope)
    envelope.connect(gainNodeRef.current)
    
    switch (type) {
      case 'object_select':
        oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1)
        envelope.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.1)
        break
        
      case 'ui_click':
        oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime)
        envelope.gain.setValueAtTime(0.2, audioContextRef.current.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.05)
        break
        
      case 'ui_hover':
        oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime)
        envelope.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.03)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.03)
        break
        
      case 'quiz_correct':
        // Ascending arpeggio
        [440, 554, 659, 880].forEach((freq, i) => {
          const osc = audioContextRef.current.createOscillator()
          const env = audioContextRef.current.createGain()
          osc.connect(env)
          env.connect(gainNodeRef.current)
          osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime + i * 0.1)
          env.gain.setValueAtTime(0.2, audioContextRef.current.currentTime + i * 0.1)
          env.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + i * 0.1 + 0.2)
          osc.start(audioContextRef.current.currentTime + i * 0.1)
          osc.stop(audioContextRef.current.currentTime + i * 0.1 + 0.2)
        })
        break
        
      case 'quiz_wrong':
        oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(110, audioContextRef.current.currentTime + 0.3)
        envelope.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContextRef.current.currentTime + 0.3)
        break
        
      case 'travel_start':
        oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 0.5)
        envelope.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5)
        oscillator.start(audioContextRef.current.currentTime)
        oscillator.stop(audioContextRef.current.currentTime + 0.5)
        break
    }
  }

  const playSound = (soundId, loop = false) => {
    if (!isEnabled || !audioContextRef.current) return

    // Check if it's a synthetic sound
    const syntheticSounds = ['object_select', 'ui_click', 'ui_hover', 'quiz_correct', 'quiz_wrong', 'travel_start']
    if (syntheticSounds.includes(soundId)) {
      createSyntheticAudio(soundId)
      return
    }

    // Try to load and play audio file
    const audio = new Audio()
    audio.volume = volume
    audio.loop = loop
    
    // Find audio file path
    let audioPath = null
    Object.values(audioFiles).forEach(category => {
      if (category[soundId]) {
        audioPath = category[soundId]
      }
    })
    
    if (audioPath) {
      audio.src = audioPath
      audio.play().catch(() => {
        // Fallback to synthetic audio if file not found
        createSyntheticAudio(soundId)
      })
    } else {
      createSyntheticAudio(soundId)
    }
  }

  const stopSound = (soundId) => {
    if (audioRefs.current[soundId]) {
      audioRefs.current[soundId].pause()
      audioRefs.current[soundId].currentTime = 0
    }
  }

  const playAmbient = (objectType) => {
    const ambientMap = {
      'blackhole': 'black_hole',
      'neutron_star': 'neutron_star',
      'star': 'star',
      'planet': 'planet'
    }
    
    const ambientId = ambientMap[objectType] || 'deep_space'
    playSound(ambientId, true)
  }

  const toggleAudio = () => {
    setIsEnabled(!isEnabled)
    if (!isEnabled) {
      playSound('ui_click')
    }
  }

  const value = {
    isEnabled,
    volume,
    setVolume,
    playSound,
    stopSound,
    playAmbient,
    toggleAudio
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

// Audio Controls Component
export const AudioControls = () => {
  const { isEnabled, volume, setVolume, toggleAudio } = useAudio()

  return (
    <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
      <button
        onClick={toggleAudio}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        <span className="text-2xl">
          {isEnabled ? '🔊' : '🔇'}
        </span>
        <span className="text-sm">{isEnabled ? 'Audio On' : 'Audio Off'}</span>
      </button>
      
      {isEnabled && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-300 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
