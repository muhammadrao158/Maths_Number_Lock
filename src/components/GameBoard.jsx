import React, { useState, useEffect } from 'react'
import Lock from './Lock'
import QuestionModal from './QuestionModal'
import Timer from './Timer'
import { initializeLocks, calculatePoints, calculateJackpots, calculateTotalScore } from '../utils/gameLogic'
import './GameBoard.css'

const GameBoard = ({ onGameEnd }) => {
  const [locks, setLocks] = useState([])
  const [selectedLock, setSelectedLock] = useState(null)
  const [timeLeft, setTimeLeft] = useState(300)
  const [timerActive, setTimerActive] = useState(true)

  useEffect(() => {
    setLocks(initializeLocks())
  }, [])

  const calculateTimeBonus = (timeRemaining) => {
    // Faster completion = higher bonus (max 50 coins for completing in < 1 minute)
    if (timeRemaining >= 240) return 50 // 4+ minutes left
    if (timeRemaining >= 180) return 40 // 3-4 minutes left
    if (timeRemaining >= 120) return 30 // 2-3 minutes left
    if (timeRemaining >= 60) return 20  // 1-2 minutes left
    return 10 // < 1 minute left
  }

  const handleLockClick = (lock) => {
    if (lock.state === 'locked') {
      setSelectedLock(lock)
    }
  }

  const handleAnswer = (lockId, answer, isCorrect) => {
    setLocks((prevLocks) => {
      return prevLocks.map((lock) => {
        if (lock.id === lockId) {
          const newAttempts = lock.attempts + 1
          let newState = lock.state
          let solved = lock.solved
          let pointsEarned = lock.pointsEarned
          let firstAttemptCorrect = lock.firstAttemptCorrect

          if (isCorrect) {
            solved = true
            pointsEarned = calculatePoints(lock, newAttempts)
            if (newAttempts === 1) {
              firstAttemptCorrect = true
              newState = 'jackpot'
            } else {
              newState = 'solved'
            }
            // Close modal on correct answer
            setSelectedLock(null)
          } else {
            if (newAttempts >= 2) {
              newState = 'disabled'
              solved = false
              // Close modal after second wrong attempt
              setSelectedLock(null)
            }
            // Keep modal open after first wrong attempt - update selectedLock
            else {
              const updatedLock = {
                ...lock,
                attempts: newAttempts,
                state: newState,
                solved,
                pointsEarned,
                firstAttemptCorrect
              }
              setSelectedLock(updatedLock)
            }
          }

          return {
            ...lock,
            attempts: newAttempts,
            state: newState,
            solved,
            pointsEarned,
            firstAttemptCorrect
          }
        }
        return lock
      })
    })
  }

  const handleTimeUp = () => {
    setTimerActive(false)
    endGame()
  }

  const endGame = () => {
    const solvedCount = locks.filter(lock => lock.solved).length
    const timeBonus = calculateTimeBonus(timeLeft)
    
    if (solvedCount >= 4) {
      const jackpots = calculateJackpots(locks)
      const totalScore = calculateTotalScore(locks, jackpots, timeBonus)
      
      onGameEnd({
        locks,
        totalScore,
        jackpots,
        timeBonus,
        solvedCount
      })
    } else {
      // Not enough locks solved, still show end screen
      const jackpots = { jackpot: false, megaJackpot: false, jackpotBonus: 0 }
      const totalScore = calculateTotalScore(locks, jackpots, timeBonus)
      
      onGameEnd({
        locks,
        totalScore,
        jackpots,
        timeBonus,
        solvedCount
      })
    }
  }

  const handleEndRun = () => {
    setTimerActive(false)
    endGame()
  }

  const solvedCount = locks.filter(lock => lock.solved).length
  const canEndRun = solvedCount >= 4

  // Show loading state while locks are initializing
  if (locks.length === 0) {
    return (
      <div className="game-board">
        <div style={{ textAlign: 'center', color: 'white', fontSize: '24px', padding: '50px' }}>
          Loading locks...
        </div>
      </div>
    )
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <Timer 
          onTimeUp={handleTimeUp} 
          isActive={timerActive}
          onTimeChange={setTimeLeft}
        />
        <button 
          className="end-run-button" 
          onClick={handleEndRun}
          disabled={!canEndRun}
        >
          End
        </button>
      </div>

      <div className="locks-grid">
        {locks.map((lock) => (
          <Lock
            key={lock.id}
            lock={lock}
            onClick={handleLockClick}
          />
        ))}
      </div>

      {selectedLock && (
        <QuestionModal
          lock={selectedLock}
          onAnswer={handleAnswer}
          onClose={() => setSelectedLock(null)}
        />
      )}
    </div>
  )
}

export default GameBoard
