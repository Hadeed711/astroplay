import React, { useState, useEffect } from 'react'

const RewardNotification = ({ onClose, score, percentage }) => {
  const [showReward, setShowReward] = useState(false)
  const [rewardType, setRewardType] = useState('fact')

  const rewards = {
    fact: {
      title: "🧠 Space Fact Unlocked!",
      description: "Visit the Rewards section to discover amazing astronomy facts!",
      icon: "🌌",
      color: "from-blue-600 to-purple-600"
    },
    image: {
      title: "🖼️ NASA Image Unlocked!",
      description: "Check out the Astronomy Picture of the Day in your rewards!",
      icon: "🛰️", 
      color: "from-purple-600 to-pink-600"
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReward(true)
      // Choose random reward type for variety
      setRewardType(Math.random() > 0.5 ? 'image' : 'fact')
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!showReward) return null

  const reward = rewards[rewardType]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-md w-full overflow-hidden animate-bounce">
        <div className={`bg-gradient-to-r ${reward.color} p-6 text-center`}>
          <div className="text-6xl mb-2">{reward.icon}</div>
          <h2 className="text-2xl font-bold text-white">{reward.title}</h2>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-slate-300 mb-6 leading-relaxed">
            {reward.description}
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                onClose()
                // Navigate to rewards tab
                window.location.href = '/quiz-dashboard?tab=rewards'
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              View Rewards
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardNotification
