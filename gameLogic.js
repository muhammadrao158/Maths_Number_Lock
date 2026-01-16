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

// Initialize locks with difficulty distribution
export const initializeLocks = () => {
  const locks = []
  const difficulties = ['easy', 'easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard']
  
  difficulties.forEach((difficulty, index) => {
    const problem = generateProblem(difficulty)
    locks.push({
      id: index + 1,
      difficulty,
      question: problem.question,
      answer: problem.answer,
      options: problem.options,
      state: 'locked', // 'locked' | 'solved' | 'disabled' | 'jackpot'
      attempts: 0,
      solved: false,
      pointsEarned: 0,
      firstAttemptCorrect: false
    })
  })

  return locks
}

// Calculate points based on difficulty and attempt
export const calculatePoints = (difficulty, attemptNumber) => {
  const basePoints = {
    easy: 10,
    medium: 30,
    hard: 50
  }

  if (attemptNumber === 1) {
    return basePoints[difficulty]
  } else {
    return Math.floor(basePoints[difficulty] * 0.5)
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
