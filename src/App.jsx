import React, { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import EndScreen from './components/EndScreen'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('playing') // 'playing' | 'ended'
  const [gameData, setGameData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Catch any errors during rendering
    window.addEventListener('error', (e) => {
      setError(e.message)
    })
  }, [])

  const handleGameEnd = (data) => {
    setGameData(data)
    setGameState('ended')
  }

  const handleRestart = () => {
    setGameState('playing')
    setGameData(null)
    setError(null)
  }

  if (error) {
    return (
      <div className="app" style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
        <h1>Error loading game</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    )
  }

  return (
    <div className="app">
      {gameState === 'playing' ? (
        <GameBoard onGameEnd={handleGameEnd} />
      ) : (
        <EndScreen gameData={gameData} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
