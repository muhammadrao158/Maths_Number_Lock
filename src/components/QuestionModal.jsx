import React, { useState, useEffect } from 'react'
import { calculatePoints } from '../utils/gameLogic'
import './QuestionModal.css'

const QuestionModal = ({ lock, onAnswer, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBreakingAnimation, setShowBreakingAnimation] = useState(false)
  const [showMultiplier, setShowMultiplier] = useState(false)
  const [showPoints, setShowPoints] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [baseCoins, setBaseCoins] = useState(0)
  const [multiplier, setMultiplier] = useState(0)
  const [currentLock, setCurrentLock] = useState(lock)
  
  // Update current lock when prop changes
  useEffect(() => {
    setCurrentLock(lock)
  }, [lock])

  const handleAnswerSelect = (answer) => {
    if (feedback) return // Already answered
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentLock.answer
    const attemptNumber = currentLock.attempts + 1

    if (isCorrect) {
      const base = currentLock.basePoints || currentLock.coinValue
      const points = calculatePoints(currentLock, attemptNumber)
      // CRITICAL: Only show multiplier animation if isMultiplier flag is explicitly true
      const hasMultiplier = currentLock.isMultiplier === true
      const mult = hasMultiplier ? (currentLock.multiplierValue || 1) : 1
      
      setBaseCoins(base)
      setMultiplier(mult)
      setPointsEarned(points)
      
      // Start breaking animation
      setShowBreakingAnimation(true)
      setShowConfetti(true)
      
      // Show multiplier after breaking animation (only if lock has multiplier)
      if (hasMultiplier) {
        setTimeout(() => {
          setShowBreakingAnimation(false)
          setShowMultiplier(true)
        }, 1000)
        
        // Show points after multiplier animation
        setTimeout(() => {
          setShowMultiplier(false)
          setShowPoints(true)
        }, 2500)
        
        // Close modal and update game state after showing points
        setTimeout(() => {
          onAnswer(currentLock.id, selectedAnswer, true)
        }, 4000)
      } else {
        // No multiplier - skip multiplier animation
        setTimeout(() => {
          setShowBreakingAnimation(false)
          setShowPoints(true)
        }, 1000)
        
        // Close modal and update game state after showing points
        setTimeout(() => {
          onAnswer(currentLock.id, selectedAnswer, true)
        }, 2500)
      }
    } else {
      if (attemptNumber === 1) {
        // First wrong attempt - record it but keep modal open
        onAnswer(currentLock.id, selectedAnswer, false)
        setFeedback('try-again')
        setTimeout(() => {
          setFeedback(null)
          setSelectedAnswer(null)
        }, 2000)
      } else {
        // Second wrong attempt - close modal
        onAnswer(currentLock.id, selectedAnswer, false)
        setFeedback('disabled')
        setTimeout(() => {
          // Modal will close via GameBoard
        }, 2000)
      }
    }
  }

  const getEncouragingMessage = () => {
    const messages = [
      'Great job!',
      'Awesome!',
      'You got it!',
      'Perfect!',
      'Excellent!',
      'Fantastic!',
      'Well done!',
      'Brilliant!'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getDifficultyColor = () => {
    switch (currentLock.difficulty) {
      case 'easy': return '#4caf50'
      case 'medium': return '#ff9800'
      case 'hard': return '#f44336'
      default: return '#667eea'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showConfetti && (
          <div className="confetti">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'][Math.floor(Math.random() * 5)]
              }} />
            ))}
          </div>
        )}

        <div className="modal-header" style={{ borderColor: getDifficultyColor() }}>
          <h2 className="modal-title">
            {currentLock.difficulty.charAt(0).toUpperCase() + currentLock.difficulty.slice(1)} Lock
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Lock Breaking Animation */}
          {showBreakingAnimation && (
            <div className="lock-breaking-container">
              <div className="lock-breaking">
                <div className="lock-piece lock-piece-1">🔐</div>
                <div className="lock-piece lock-piece-2">🔐</div>
                <div className="lock-piece lock-piece-3">🔐</div>
                <div className="lock-piece lock-piece-4">🔐</div>
              </div>
            </div>
          )}

          {/* Multiplier Animation */}
          {showMultiplier && (
            <div className="multiplier-reveal">
              <div className="multiplier-base">
                <div className="multiplier-coins">{baseCoins} coins</div>
                <div className="multiplier-symbol">×</div>
                <div className="multiplier-value">{multiplier}x</div>
              </div>
              <div className="multiplier-equals">=</div>
            </div>
          )}

          {/* Points Reveal */}
          {showPoints && (
            <div className="points-reveal">
              <div className="points-reveal-icon">💰</div>
              <div className="points-reveal-text">+{pointsEarned} coins</div>
              <div className="points-reveal-message">{getEncouragingMessage()}</div>
            </div>
          )}

          {!showBreakingAnimation && !showMultiplier && !showPoints && (
            <>
              <div className="question-display">
                <p className="question-text">{currentLock.question} = ?</p>
              </div>

              {feedback === 'correct' && (
                <div className="feedback-correct">
                  <div className="feedback-icon">🎉</div>
                  <div className="feedback-text">{getEncouragingMessage()}</div>
                </div>
              )}
            </>
          )}

          {!showBreakingAnimation && !showMultiplier && !showPoints && (
            <>
              {feedback === 'try-again' && (
                <div className="feedback-try-again">
                  <div className="feedback-icon">💪</div>
                  <div className="feedback-text">Try again!</div>
                </div>
              )}

              {feedback === 'disabled' && (
                <div className="feedback-disabled">
                  <div className="feedback-icon">👍</div>
                  <div className="feedback-text">Good try! Let's move on.</div>
                </div>
              )}
            </>
          )}

          {!feedback && !showBreakingAnimation && !showMultiplier && !showPoints && (
            <>
              <div className="answer-options">
                {currentLock.options.map((option, index) => (
                  <button
                    key={index}
                    className={`answer-option ${selectedAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="attempt-info">
                Attempt {currentLock.attempts + 1} of 2
              </div>

              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionModal
