import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SectionHeader } from '@/components/SectionHeader'
import { Confetti } from '@/components/Confetti'
import { islamicQuiz1, fivePillarsOrder, QuizQuestion } from '@/lib/islamicQuizData'
import { toast } from 'sonner'

interface IslamicSectionProps {
  onBack: () => void
  onQuizComplete?: (score: number, total: number) => void
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function IslamicSection({ onBack, onQuizComplete }: IslamicSectionProps) {
  const shuffledQuestions = useMemo(() => shuffleArray(islamicQuiz1), [])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const question = shuffledQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === shuffledQuestions.length - 1
  const userAnswer = userAnswers[question.id] || ''

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [question.id]: answer }))
  }

  const checkAnswer = (userAns: string, correctAns: string) => {
    const normalize = (str: string) => str.toLowerCase().trim()
    return normalize(userAns) === normalize(correctAns)
  }

  const handleNext = () => {
    if (!userAnswer) {
      toast.error('Please answer the question first! 📝')
      return
    }

    const isCorrect = checkAnswer(userAnswer, question.correctAnswer)

    if (isLastQuestion) {
      let finalScore = 0
      shuffledQuestions.forEach(q => {
        if (userAnswers[q.id] && checkAnswer(userAnswers[q.id], q.correctAnswer)) {
          finalScore++
        }
      })

      if (userAnswers[question.id] && isCorrect) {
        finalScore++
      }

      setScore(finalScore)
      setShowResults(true)
      setShowConfetti(finalScore >= shuffledQuestions.length * 0.7)
      onQuizComplete?.(finalScore, shuffledQuestions.length)
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setScore(0)
    setShowConfetti(false)
  }

  if (showResults) {
    const percentage = (score / shuffledQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.85_0.08_50)] via-background to-[oklch(0.90_0.06_80)] p-6">
        <Confetti show={showConfetti} />
        <SectionHeader title="Islamic Studies Quiz" emoji="🕌" onBack={onBack} titleColor="#D4AF37" />

        <div className="max-w-2xl mx-auto mt-12">
          <Card className="p-8 text-center bg-white/95 backdrop-blur-sm border-4 border-[#D4AF37]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <div className="text-7xl mb-6">
                {percentage >= 90 ? '🌟' : percentage >= 70 ? '⭐' : percentage >= 50 ? '👍' : '📖'}
              </div>

              <h2 className="text-4xl font-bold mb-4 text-[#D4AF37]">
                {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Great Job!' : percentage >= 50 ? 'Good Effort!' : 'Keep Learning!'}
              </h2>

              <div className="text-6xl font-bold mb-6 text-foreground">
                {score} / {shuffledQuestions.length}
              </div>

              <p className="text-2xl mb-8 text-muted-foreground">
                {percentage >= 90 
                  ? 'You know your Islamic Studies very well! Masha Allah!' 
                  : percentage >= 70 
                  ? 'You did great! Keep up the good work!' 
                  : percentage >= 50
                  ? 'Good start! Practice more to improve!'
                  : 'Keep studying and try again! You can do it!'}
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleRestart} size="lg" className="bg-primary hover:bg-primary/90 text-xl px-8 py-6">
                  Try Again
                </Button>
                <Button onClick={onBack} variant="outline" size="lg" className="text-xl px-8 py-6">
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </Card>

          <Card className="mt-6 p-6 bg-white/90">
            <h3 className="text-2xl font-bold mb-4 text-center">Review Your Answers</h3>
            <div className="space-y-3">
              {shuffledQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id]
                const isCorrect = userAns && checkAnswer(userAns, q.correctAnswer)

                return (
                  <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <Check className="text-success" size={24} weight="bold" />
                      ) : (
                        <X className="text-destructive" size={24} weight="bold" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">Q{idx + 1}: {q.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Your answer: <span className={isCorrect ? 'text-success font-semibold' : 'text-destructive font-semibold'}>{userAns || 'Not answered'}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-success">
                          Correct answer: <span className="font-semibold">{q.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.85_0.08_50)] via-background to-[oklch(0.90_0.06_80)] p-6">
      <SectionHeader title="Islamic Studies Quiz" emoji="🕌" onBack={onBack} titleColor="#D4AF37" />

      <div className="max-w-3xl mx-auto mt-12">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-lg font-semibold text-muted-foreground">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </span>
          <span className="text-lg font-semibold px-4 py-2 bg-[#D4AF37]/20 rounded-full">
            {question.category}
          </span>
        </div>

        <div className="mb-4 bg-muted/30 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-2 border-[#D4AF37]/30">
              <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
                {question.question}
              </h3>

              {question.type === 'fill-in' && (
                <div className="space-y-4">
                  <Input
                    value={userAnswer}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="text-2xl p-6 text-center border-2 focus:border-[#D4AF37]"
                    autoFocus
                  />
                </div>
              )}

              {question.type === 'multiple-choice' && question.options && (
                <div className="grid gap-4">
                  {question.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      variant={userAnswer === option ? 'default' : 'outline'}
                      className={`text-xl p-6 h-auto justify-start ${
                        userAnswer === option 
                          ? 'bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white border-[#D4AF37]' 
                          : 'hover:border-[#D4AF37] hover:bg-[#D4AF37]/10'
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {question.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswer('True')}
                    variant={userAnswer === 'True' ? 'default' : 'outline'}
                    className={`text-2xl p-8 h-auto ${
                      userAnswer === 'True' 
                        ? 'bg-success hover:bg-success/90 text-white' 
                        : 'hover:border-success hover:bg-success/10'
                    }`}
                  >
                    <Check className="mr-2" size={32} weight="bold" />
                    True
                  </Button>
                  <Button
                    onClick={() => handleAnswer('False')}
                    variant={userAnswer === 'False' ? 'default' : 'outline'}
                    className={`text-2xl p-8 h-auto ${
                      userAnswer === 'False' 
                        ? 'bg-destructive hover:bg-destructive/90 text-white' 
                        : 'hover:border-destructive hover:bg-destructive/10'
                    }`}
                  >
                    <X className="mr-2" size={32} weight="bold" />
                    False
                  </Button>
                </div>
              )}

              {question.type === 'write-answer' && (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-6 min-h-[200px] border-2 border-dashed border-[#D4AF37]/30">
                    <Input
                      value={userAnswer}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Write your answer here..."
                      className="text-xl p-4 border-2 focus:border-[#D4AF37]"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            className="text-xl px-6"
          >
            <ArrowLeft className="mr-2" size={24} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            size="lg"
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-xl px-8"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  )
}
