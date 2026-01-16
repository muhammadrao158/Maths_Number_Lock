import React from 'react'
import './Lock.css'

const Lock = ({ lock, onClick }) => {
  // DEBUG: Log lock data for first lock only
  if (lock.id === 1) {
    console.log('Lock 1 debug:', {
      id: lock.id,
      isMultiplier: lock.isMultiplier,
      isMultiplierType: typeof lock.isMultiplier,
      multiplierValue: lock.multiplierValue,
      multiplierValueType: typeof lock.multiplierValue,
      state: lock.state
    })
  }

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

  // STRICT CHECK: Only show badge if ALL conditions are met
  // CRITICAL: isMultiplier must be explicitly true (not truthy)
  // CRITICAL: multiplierValue must be > 1
  // CRITICAL: state must be 'locked'
  // CRITICAL: Double-check that isMultiplier is exactly true, not just truthy
  const isMultiplierLock = lock.isMultiplier === true && typeof lock.isMultiplier === 'boolean'
  const hasValidMultiplier = typeof lock.multiplierValue === 'number' && lock.multiplierValue > 1 && lock.multiplierValue !== 1
  const isLocked = lock.state === 'locked'
  
  const shouldShowBadge = isMultiplierLock && hasValidMultiplier && isLocked
  
  // DEBUG: Log badge decision for all locks
  if (lock.id <= 10) {
    console.log(`Lock ${lock.id} badge check:`, {
      isMultiplier: lock.isMultiplier,
      isMultiplierType: typeof lock.isMultiplier,
      isMultiplierLock,
      multiplierValue: lock.multiplierValue,
      multiplierValueType: typeof lock.multiplierValue,
      hasValidMultiplier,
      state: lock.state,
      isLocked,
      shouldShowBadge
    })
  }

  return (
    <div
      className={`lock ${getDifficultyClass()} ${getStateClass()}`}
      onClick={() => lock.state === 'locked' && onClick && onClick(lock)}
    >
      <div className="lock-icon">{getIcon()}</div>
      {shouldShowBadge && (
        <div className="lock-multiplier-badge">{lock.multiplierValue}x</div>
      )}
      {lock.state === 'jackpot' && <div className="lock-jackpot-badge">⭐</div>}
    </div>
  )
}

export default Lock
