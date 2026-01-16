import React, { useState, useEffect } from 'react'
import './Timer.css'

const Timer = ({ onTimeUp, isActive, onTimeChange }) => {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1
        if (onTimeChange) {
          onTimeChange(newTime)
        }
        if (newTime === 0) {
          clearInterval(interval)
          if (onTimeUp) onTimeUp()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp, onTimeChange])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="timer">
      <div className="timer-display">
        <span className="timer-icon">⏱️</span>
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>
      {timeLeft < 60 && <div className="timer-warning">Hurry!</div>}
    </div>
  )
}

export default Timer
