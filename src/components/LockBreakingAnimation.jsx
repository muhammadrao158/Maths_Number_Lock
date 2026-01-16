import React, { useState, useEffect } from 'react'
import './LockBreakingAnimation.css'

const LockBreakingAnimation = ({ lock, points, delay = 0, onComplete }) => {
  const [showBreaking, setShowBreaking] = useState(false)
  const [showPoints, setShowPoints] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowBreaking(true)
    }, delay)

    const timer2 = setTimeout(() => {
      setShowBreaking(false)
      setShowPoints(true)
      if (onComplete) {
        setTimeout(onComplete, 1500)
      }
    }, delay + 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [delay, onComplete])

  return (
    <div className="lock-breaking-item">
      {showBreaking && (
        <div className="lock-breaking-container-small">
          <div className="lock-breaking-small">
            <div className="lock-piece lock-piece-1">🔐</div>
            <div className="lock-piece lock-piece-2">🔐</div>
            <div className="lock-piece lock-piece-3">🔐</div>
            <div className="lock-piece lock-piece-4">🔐</div>
          </div>
        </div>
      )}

      {showPoints && (
        <div className="lock-points-reveal-small">
          <div className="lock-points-icon">💰</div>
          <div className="lock-points-value">{points} coins</div>
        </div>
      )}

      {!showBreaking && !showPoints && (
        <div className="lock-pending">
          <div className="lock-pending-icon">🔒</div>
        </div>
      )}
    </div>
  )
}

export default LockBreakingAnimation
