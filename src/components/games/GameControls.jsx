import React, { useState } from 'react'
import AsteroidDodger from './AsteroidDodger'

const GameControls = () => {
  const [showGame, setShowGame] = useState(false)

  return (
    <>
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-lg">
        <button
          onClick={() => setShowGame(true)}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors w-full"
        >
          <span className="text-lg md:text-2xl">🎮</span>
          <span className="text-xs md:text-sm">
            Asteroid Dodger
          </span>
        </button>
      </div>

      {showGame && (
        <AsteroidDodger onClose={() => setShowGame(false)} />
      )}
    </>
  )
}

export default GameControls