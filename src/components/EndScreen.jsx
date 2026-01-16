import React, { useState } from 'react'
import LockBreakingAnimation from './LockBreakingAnimation'
import './EndScreen.css'

const EndScreen = ({ gameData, onRestart }) => {
  const [showMissedLocks, setShowMissedLocks] = useState(false)
  
  if (!gameData) return null

  const { locks, totalScore, jackpots, timeBonus, solvedCount } = gameData

  const getDifficultyPoints = (lock) => {
    // Return the actual coin value from the lock, or a range if not available
    if (lock.coinValue) {
      return lock.coinValue
    }
    // Fallback to difficulty-based ranges
    return {
      easy: '10-20',
      medium: '30-40',
      hard: '50-60'
    }[lock.difficulty]
  }

  const earnedLocks = locks.filter(lock => lock.solved)
  const missedLocks = locks.filter(lock => !lock.solved)
  const unattemptedLocks = locks.filter(lock => lock.state === 'locked')
  const failedLocks = locks.filter(lock => lock.state === 'disabled')

  // Show missed locks section after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowMissedLocks(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="end-screen">
      <div className="end-screen-content">
        <h1 className="end-screen-title">🎉 Game Complete! 🎉</h1>

        {/* Earned Rewards */}
        <div className="rewards-section earned-rewards">
          <h2 className="section-title">Earned Rewards</h2>
          
          <div className="score-display">
            <div className="score-label">Total Coins</div>
            <div className="score-value">{totalScore}</div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Locks Opened</div>
              <div className="stat-value">{solvedCount} / 10</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">First-Attempt Correct</div>
              <div className="stat-value">
                {locks.filter(lock => lock.firstAttemptCorrect).length}
              </div>
            </div>
            {timeBonus > 0 && (
              <div className="stat-item">
                <div className="stat-label">Time Bonus</div>
                <div className="stat-value">+{timeBonus}</div>
              </div>
            )}
          </div>

          {/* Jackpot Status */}
          <div className="jackpot-section">
            {jackpots.megaJackpot ? (
              <div className="jackpot-badge mega-jackpot">
                <div className="jackpot-icon">🌟</div>
                <div className="jackpot-title">MEGA JACKPOT!</div>
                <div className="jackpot-description">All 10 locks on first attempt!</div>
                <div className="jackpot-bonus">Score × 2</div>
              </div>
            ) : jackpots.jackpot ? (
              <div className="jackpot-badge jackpot">
                <div className="jackpot-icon">⭐</div>
                <div className="jackpot-title">JACKPOT!</div>
                <div className="jackpot-description">8+ locks on first attempt!</div>
                <div className="jackpot-bonus">+100 coins</div>
              </div>
            ) : (
              <div className="jackpot-badge no-jackpot">
                <div className="jackpot-icon">🔒</div>
                <div className="jackpot-title">No Jackpot</div>
                <div className="jackpot-description">
                  {locks.filter(lock => lock.firstAttemptCorrect).length < 8
                    ? 'Need 8+ first-attempt correct for Jackpot'
                    : 'Need all 10 first-attempt correct for Mega Jackpot'}
                </div>
              </div>
            )}
          </div>

          {/* Earned Locks List */}
          {earnedLocks.length > 0 && (
            <div className="locks-list earned-locks">
              <h3 className="locks-list-title">Successfully Opened Locks</h3>
              <div className="locks-list-grid">
                {earnedLocks.map((lock) => (
                  <div key={lock.id} className="lock-result-item earned">
                    <div className="lock-result-icon">
                      {lock.firstAttemptCorrect ? '⭐' : '✅'}
                    </div>
                    <div className="lock-result-info">
                      <div className="lock-result-difficulty">{lock.difficulty}</div>
                      <div className="lock-result-points">
                        {lock.isMultiplier === true && lock.multiplierValue > 1
                          ? `${lock.basePoints || lock.coinValue} × ${lock.multiplierValue}x = +${lock.pointsEarned} coins`
                          : `+${lock.pointsEarned} coins`
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Missed Rewards */}
        {(missedLocks.length > 0) && showMissedLocks && (
          <div className="rewards-section missed-rewards">
            <h2 className="section-title">Missed Rewards</h2>
            <p className="missed-description">
              Here's what you could have earned from unattempted or failed locks:
            </p>

            <div className="locks-list missed-locks">
              <div className="locks-list-grid">
                {unattemptedLocks.map((lock, index) => (
                  <div key={lock.id} className="lock-result-item missed unattempted">
                    <div className="lock-animation-wrapper">
                      <LockBreakingAnimation
                        lock={lock}
                        points={getDifficultyPoints(lock)}
                        delay={index * 200}
                      />
                    </div>
                    <div className="lock-result-info">
                      <div className="lock-result-status">Not attempted</div>
                    </div>
                  </div>
                ))}
                {failedLocks.map((lock, index) => (
                  <div key={lock.id} className="lock-result-item missed failed">
                    <div className="lock-animation-wrapper">
                      <LockBreakingAnimation
                        lock={lock}
                        points={getDifficultyPoints(lock)}
                        delay={(unattemptedLocks.length + index) * 200}
                      />
                    </div>
                    <div className="lock-result-info">
                      <div className="lock-result-status">Failed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default EndScreen
