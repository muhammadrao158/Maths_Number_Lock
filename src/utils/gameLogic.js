// Generate math problems based on difficulty
export const generateProblem = (difficulty) => {
  let num1, num2, num3, operator, answer, question

  switch (difficulty) {
    case 'easy':
      // Simple addition/subtraction with small numbers
      num1 = Math.floor(Math.random() * 20) + 1
      num2 = Math.floor(Math.random() * 20) + 1
      operator = Math.random() > 0.5 ? '+' : '-'
      answer = operator === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2)
      question = `${Math.max(num1, num2)} ${operator} ${Math.min(num1, num2)}`
      break

    case 'medium':
      // Multi-step or larger numbers
      const operations = [
        () => {
          num1 = Math.floor(Math.random() * 50) + 10
          num2 = Math.floor(Math.random() * 30) + 5
          return { question: `${num1} + ${num2}`, answer: num1 + num2 }
        },
        () => {
          num1 = Math.floor(Math.random() * 50) + 20
          num2 = Math.floor(Math.random() * 20) + 5
          return { question: `${num1} - ${num2}`, answer: num1 - num2 }
        },
        () => {
          num1 = Math.floor(Math.random() * 10) + 2
          num2 = Math.floor(Math.random() * 10) + 2
          return { question: `${num1} × ${num2}`, answer: num1 * num2 }
        }
      ]
      const op = operations[Math.floor(Math.random() * operations.length)]
      const result = op()
      question = result.question
      answer = result.answer
      break

    case 'hard':
      // Complex or logic-heavy problems
      const hardOps = [
        () => {
          num1 = Math.floor(Math.random() * 100) + 20
          num2 = Math.floor(Math.random() * 50) + 10
          num3 = Math.floor(Math.random() * 30) + 5
          return { question: `${num1} + ${num2} - ${num3}`, answer: num1 + num2 - num3 }
        },
        () => {
          num1 = Math.floor(Math.random() * 12) + 3
          num2 = Math.floor(Math.random() * 12) + 3
          num3 = Math.floor(Math.random() * 10) + 2
          return { question: `${num1} × ${num2} - ${num3}`, answer: num1 * num2 - num3 }
        },
        () => {
          num1 = Math.floor(Math.random() * 50) + 20
          num2 = Math.floor(Math.random() * 20) + 5
          num3 = Math.floor(Math.random() * 20) + 5
          return { question: `${num1} - ${num2} + ${num3}`, answer: num1 - num2 + num3 }
        }
      ]
      const hardOp = hardOps[Math.floor(Math.random() * hardOps.length)]
      const hardResult = hardOp()
      question = hardResult.question
      answer = hardResult.answer
      break

    default:
      question = '1 + 1'
      answer = 2
  }

  // Generate wrong answers
  const wrongAnswers = []
  while (wrongAnswers.length < 3) {
    const wrong = answer + Math.floor(Math.random() * 20) - 10
    if (wrong !== answer && wrong > 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong)
    }
  }

  // Shuffle answers
  const allAnswers = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5)

  return {
    question,
    answer,
    options: allAnswers
  }
}

// Get available coin values for a difficulty level
const getAvailableCoinValues = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      // Generate array of all possible values 10-20
      return Array.from({ length: 11 }, (_, i) => i + 10)
    case 'medium':
      // Generate array of all possible values 30-40
      return Array.from({ length: 11 }, (_, i) => i + 30)
    case 'hard':
      // Generate array of all possible values 50-60
      return Array.from({ length: 11 }, (_, i) => i + 50)
    default:
      return [10]
  }
}

// Get unique random coin value from available pool
const getUniqueCoinValue = (availableValues, usedValues) => {
  const available = availableValues.filter(val => !usedValues.includes(val))
  if (available.length === 0) {
    // If all values are used, pick randomly from the full range
    return availableValues[Math.floor(Math.random() * availableValues.length)]
  }
  const selected = available[Math.floor(Math.random() * available.length)]
  return selected
}


// Get multiplier value based on difficulty (only used when isMultiplier === true)
const getMultiplierValue = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 2
    case 'medium':
      return 4
    case 'hard':
      return 6
    default:
      return 1
  }
}

// Initialize locks with difficulty distribution (pure random, strict constraints)
export const initializeLocks = () => {
  const locks = []
  const config = {
    easy: 4,
    medium: 3,
    hard: 3
  }

  // Generate all questions with default multiplier settings
  let nextId = 1
  Object.entries(config).forEach(([difficulty, count]) => {
    const usedCoins = new Set()
    for (let i = 0; i < count; i += 1) {
      const problem = generateProblem(difficulty)
      const availableValues = getAvailableCoinValues(difficulty)
      const coinValue = getUniqueCoinValue(availableValues, Array.from(usedCoins))
      usedCoins.add(coinValue)

      locks.push({
        id: nextId++,
        difficulty,
        question: problem.question,
        answer: problem.answer,
        options: problem.options,
        coinValue, // Base points (unique random coin value)
        basePoints: coinValue,
        isMultiplier: false, // default
        multiplierValue: 1,  // default
        state: 'locked',
        attempts: 0,
        solved: false,
        pointsEarned: 0,
        firstAttemptCorrect: false
      })
    }
  })

  // Assign exactly one multiplier per difficulty (random)
  ;['easy', 'medium', 'hard'].forEach((level) => {
    const levelLocks = locks.filter(l => l.difficulty === level)
    if (levelLocks.length === 0) return

    const multiplierIndex = Math.floor(Math.random() * levelLocks.length)
    const multiplierValue = getMultiplierValue(level)

    levelLocks.forEach((lock, idx) => {
      const isMultiplier = idx === multiplierIndex
      lock.isMultiplier = isMultiplier
      lock.multiplierValue = isMultiplier ? multiplierValue : 1
    })
  })

  // DEV CHECK: Verify exactly 1 multiplier per difficulty and none else
  ;['easy', 'medium', 'hard'].forEach(level => {
    const levelLocks = locks.filter(q => q.difficulty === level)
    const multiplierCount = levelLocks.filter(q => q.isMultiplier === true).length
    const nonMultiplierCount = levelLocks.filter(q => q.isMultiplier === false).length

    console.assert(
      multiplierCount === 1,
      `Invalid multiplier count for ${level}: ${multiplierCount} (expected 1)`
    )

    console.assert(
      nonMultiplierCount === levelLocks.length - 1,
      `Invalid non-multiplier count for ${level}: ${nonMultiplierCount} (expected ${levelLocks.length - 1})`
    )

    levelLocks.forEach(lock => {
      if (!lock.isMultiplier) {
        console.assert(
          lock.multiplierValue === 1,
          `Lock ${lock.id} has isMultiplier=false but multiplierValue=${lock.multiplierValue} (expected 1)`
        )
      }
    })
  })

  // VERIFICATION: Log for each question to confirm correct multiplier assignment
  console.log('=== MULTIPLIER VERIFICATION ===')
  console.log('Total locks:', locks.length)

  const easyLocks = locks.filter(l => l.difficulty === 'easy')
  const mediumLocks = locks.filter(l => l.difficulty === 'medium')
  const hardLocks = locks.filter(l => l.difficulty === 'hard')

  console.log('\nEasy locks:', easyLocks.length)
  easyLocks.forEach(l => {
    console.log(`  Lock ${l.id}: isMultiplier=${l.isMultiplier}, multiplierValue=${l.multiplierValue}, basePoints=${l.basePoints}`)
  })
  console.log(`  Multiplier count: ${easyLocks.filter(l => l.isMultiplier === true).length} (should be 1)`)

  console.log('\nMedium locks:', mediumLocks.length)
  mediumLocks.forEach(l => {
    console.log(`  Lock ${l.id}: isMultiplier=${l.isMultiplier}, multiplierValue=${l.multiplierValue}, basePoints=${l.basePoints}`)
  })
  console.log(`  Multiplier count: ${mediumLocks.filter(l => l.isMultiplier === true).length} (should be 1)`)

  console.log('\nHard locks:', hardLocks.length)
  hardLocks.forEach(l => {
    console.log(`  Lock ${l.id}: isMultiplier=${l.isMultiplier}, multiplierValue=${l.multiplierValue}, basePoints=${l.basePoints}`)
  })
  console.log(`  Multiplier count: ${hardLocks.filter(l => l.isMultiplier === true).length} (should be 1)`)

  console.log('\n=== END VERIFICATION ===')

  // Keep order by id
  locks.sort((a, b) => a.id - b.id)

  return locks
}

// Calculate points based on lock's base points, multiplier, and attempt
// CRITICAL: Multiplier is ONLY applied if isMultiplier === true
export const calculatePoints = (lock, attemptNumber) => {
  const basePoints = lock.basePoints || lock.coinValue
  
  // CRITICAL: Only apply multiplier if isMultiplier flag is explicitly true
  // Otherwise, multiplierValue is ALWAYS 1
  const multiplierValue = (lock.isMultiplier === true) ? (lock.multiplierValue || 1) : 1

  if (attemptNumber === 1) {
    // First attempt: full base points × multiplierValue (only if isMultiplier === true)
    return basePoints * multiplierValue
  } else {
    // Second attempt: half base points × multiplierValue (only if isMultiplier === true)
    return Math.floor((basePoints * 0.5) * multiplierValue)
  }
}

// Calculate jackpot eligibility
export const calculateJackpots = (locks) => {
  const firstAttemptCorrect = locks.filter(lock => lock.firstAttemptCorrect).length
  const totalCorrect = locks.filter(lock => lock.solved).length

  if (totalCorrect < 4) {
    return { jackpot: false, megaJackpot: false, jackpotBonus: 0 }
  }

  const jackpot = firstAttemptCorrect >= 8
  const megaJackpot = firstAttemptCorrect === 10

  return {
    jackpot,
    megaJackpot,
    jackpotBonus: jackpot ? 100 : 0
  }
}

// Calculate total score
export const calculateTotalScore = (locks, jackpots, timeBonus = 0) => {
  const baseScore = locks.reduce((sum, lock) => sum + lock.pointsEarned, 0)
  const jackpotBonus = jackpots.jackpotBonus
  
  let totalScore = baseScore + jackpotBonus + timeBonus
  
  if (jackpots.megaJackpot) {
    totalScore = totalScore * 2
  }

  return totalScore
}
