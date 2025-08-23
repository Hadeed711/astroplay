import { useState } from 'react'
import { celestialBodies } from '../../data/celestialBodies'
import useAppStore from '../../store/useAppStore'

const ObjectSelector = () => {
  const { selectedObject, setSelectedObject } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  const objectEntries = Object.entries(celestialBodies)

  const getObjectIcon = (object) => {
    if (object.name.includes('Earth')) return '🌍'
    if (object.name.includes('Moon')) return '🌙'
    if (object.name.includes('Mars')) return '🔴'
    if (object.name.includes('Jupiter')) return '🪐'
    if (object.name.includes('Venus')) return '♀️'
    if (object.name.includes('Saturn')) return '🪐'
    if (object.name.includes('Sun')) return '☀️'
    if (object.name.includes('Betelgeuse')) return '🔴'
    if (object.name.includes('Sirius A')) return '⭐'
    if (object.name.includes('Sirius B')) return '⚪'
    if (object.name.includes('Proxima')) return '🌟'
    if (object.name.includes('Neutron') || object.name.includes('Pulsar') || object.name.includes('PSR')) return '⚪'
    if (object.name.includes('Black Hole') || object.name.includes('Sagittarius') || object.name.includes('M87') || object.name.includes('TON')) return '⚫'
    if (object.type === 'white_dwarf') return '⚪'
    if (object.type === 'moon') return '🌙'
    return '🌌'
  }

  const handleSelect = (objectKey) => {
    setSelectedObject(objectKey)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold text-space-gold mb-4">Object Selector</h3>
      
      {/* Dropdown Container */}
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-space-dark/80 border border-space-blue/50 rounded-lg p-4 flex items-center justify-between hover:border-space-gold/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getObjectIcon(selectedObject)}</span>
            <div className="text-left">
              <div className="text-white font-medium">{selectedObject.name}</div>
              <div className="text-gray-400 text-sm capitalize">{selectedObject.type}</div>
            </div>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu - positioned immediately after button */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-space-dark/95 border border-space-blue/50 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {objectEntries.map(([key, object]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-space-blue/30 transition-colors border-b border-space-blue/20 last:border-b-0 ${
                  selectedObject.name === object.name ? 'bg-space-blue/20' : ''
                }`}
              >
                <span className="text-2xl">{getObjectIcon(object)}</span>
                <div className="text-left flex-1">
                  <div className="text-white font-medium">{object.name}</div>
                  <div className="text-gray-400 text-sm capitalize">{object.type}</div>
                  <div className="text-gray-500 text-xs">{object.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Grid Alternative - separate from dropdown */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {objectEntries.slice(0, 4).map(([key, object]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`p-3 rounded-lg border transition-all hover:scale-105 ${
              selectedObject.name === object.name 
                ? 'border-space-gold bg-space-gold/10' 
                : 'border-space-blue/30 bg-space-dark/50 hover:border-space-blue/50'
            }`}
          >
            <div className="text-2xl mb-2">{getObjectIcon(object)}</div>
            <div className="text-sm text-white font-medium">{object.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ObjectSelector