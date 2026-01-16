import React from 'react'
import './Lock.css'

const Lock = ({ lock, onClick }) => {
  const getDifficultyClass = () => {
    return `lock-difficulty-${lock.difficulty}`
  }

  const getStateClass = () => {
    if (lock.state === 'solved' || lock.state === 'jackpot') return 'lock-solved'
    if (lock.state === 'disabled') return 'lock-disabled'
    return 'lock-locked'
  }

  const getIcon = () => {
    if (lock.state === 'jackpot') return '🎉'
    if (lock.state === 'solved') return '✅'
    if (lock.state === 'disabled') return '🔒'
    return '🔐'
  }

  return (
    <div
      className={`lock ${getDifficultyClass()} ${getStateClass()}`}
      onClick={() => lock.state === 'locked' && onClick && onClick(lock)}
    >
      <div className="lock-icon">{getIcon()}</div>
      {lock.state === 'jackpot' && <div className="lock-jackpot-badge">⭐</div>}
    </div>
  )
}

export default Lock
