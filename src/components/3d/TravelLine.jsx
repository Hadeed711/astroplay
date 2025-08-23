import React from 'react'
import DistanceAnimation from './DistanceAnimation'

const TravelLine = ({ visible }) => {
  if (!visible) return null

  // Default travel line between Earth and Moon
  const earthPos = { position: [0, 0, 0] }
  const moonPos = { position: [3, 0, 0] }

  return (
    <DistanceAnimation
      fromObject={earthPos}
      toObject={moonPos}
      show={visible}
    />
  )
}

export default TravelLine