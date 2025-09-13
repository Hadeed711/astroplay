import React, { useState } from 'react'
import AsteroidDodger from './AsteroidDodger'

const GameControls = () => {
  const [showGame, setShowGame] = useState(false)

  return (
    <>
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-lg">
        <button
          onClick={() => setShowGame(true)}
          className="flex items-center justify-center md:justify-start md:space-x-2 p-2 md:px-3 md:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors w-full md:w-auto"
        >
          <span className="text-2xl">🎮</span>
          <span className="hidden md:inline text-sm">
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