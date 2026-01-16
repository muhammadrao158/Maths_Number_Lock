# Math Lock Breaker 🎮

An educational math game where players unlock vaults by solving math problems. Built with React and designed for mobile and web.

## Features

- **10 Locked Vaults**: Each level contains 10 locks with varying difficulty (4 Easy, 3 Medium, 3 Hard)
- **Strategic Gameplay**: Choose which locks to attempt - no character movement, just tap and solve
- **Attempt System**: Each lock allows 2 attempts
  - First attempt correct = Full points + counts toward jackpot
  - Second attempt correct = 50% points (doesn't count toward jackpot)
  - Two wrong attempts = Lock disabled, no points
- **Scoring System**:
  - Easy lock: 10 coins
  - Medium lock: 30 coins
  - Hard lock: 50 coins
- **Jackpot Rewards**:
  - **Jackpot**: 8+ locks correct on first attempt = +100 coins
  - **Mega Jackpot**: All 10 locks correct on first attempt = Total score × 2
- **Timer**: 5-minute countdown timer with time bonus for faster completion
- **End Screen**: Shows earned rewards and reveals missed opportunities
- **Kid-Friendly Design**: Positive feedback, no punishment, encouraging messages

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Game Rules

1. **Minimum Engagement**: Need at least 4 correct locks to complete a run
2. **End Run**: Once you have 4+ correct locks, you can tap "End Run" or wait for the timer
3. **Jackpot Eligibility**: Only first-attempt correct answers count toward jackpots
4. **Time Bonus**: Faster completion = higher time bonus (up to 50 coins)

## Technology Stack

- React 18
- Vite
- CSS3 (with animations)
- Modern JavaScript (ES6+)

## Project Structure

```
src/
├── components/
│   ├── GameBoard.jsx      # Main game component
│   ├── Lock.jsx           # Individual lock component
│   ├── QuestionModal.jsx   # Question/answer modal
│   ├── Timer.jsx          # Timer component
│   └── EndScreen.jsx      # Results screen
├── utils/
│   └── gameLogic.js       # Game logic and calculations
├── App.jsx                # Root component
└── main.jsx               # Entry point
```

## Design Philosophy

This game is designed to be:
- **Educational**: Helps kids practice math in a fun way
- **Encouraging**: Positive feedback, no punishment
- **Strategic**: Players choose difficulty and order
- **Rewarding**: Multiple reward tiers and jackpots
- **Accessible**: Works on mobile and web, responsive design

Enjoy playing Math Lock Breaker! 🎉
