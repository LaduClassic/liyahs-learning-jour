import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SPELLING_WORDS, clusterArabic, normalizeArabic } from '@/lib/arabicData'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type PrepMode = 'flashcards' | 'letter-order' | 'phonetic-match' | 'definition-match' | 'write-it'

export function QuizPrep() {
  const [mode, setMode] = useState<PrepMode>('flashcards')
  const [wordIndex, setWordIndex] = useState(0)

  const modes: Array<{ id: PrepMode; label: string }> = [
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'letter-order', label: 'Letter Order' },
    { id: 'phonetic-match', label: 'Phonetic Match' },
    { id: 'definition-match', label: 'Definition Match' },
    { id: 'write-it', label: 'Write It' }
  ]

  const descriptions: Record<PrepMode, string> = {
    'flashcards': 'Flip through the cards to review every word.',
    'letter-order': 'Arrange the Arabic letters in the correct order.',
    'phonetic-match': 'Match each Arabic word to the way it sounds.',
    'definition-match': 'Pair every Arabic word with its English meaning.',
    'write-it': 'Write the Arabic spelling from the pronunciation.'
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap gap-2 p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full shadow-lg">
          {modes.map(({ id, label }) => (
            <Button
              key={id}
              variant={mode === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setMode(id)
                setWordIndex(0)
              }}
              className={`rounded-full font-bold ${
                mode === id ? 'shadow-lg' : ''
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xl md:text-2xl text-center text-muted-foreground">
        {descriptions[mode]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {mode === 'letter-order' && <LetterOrderMode wordIndex={wordIndex} setWordIndex={setWordIndex} />}
          {mode === 'phonetic-match' && <PhoneticMatchMode />}
          {mode === 'definition-match' && <DefinitionMatchMode />}
          {mode === 'write-it' && <WriteItMode wordIndex={wordIndex} setWordIndex={setWordIndex} />}
          {mode === 'flashcards' && <FlashcardsMode wordIndex={wordIndex} setWordIndex={setWordIndex} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LetterOrderMode({ wordIndex, setWordIndex }: { wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = SPELLING_WORDS[wordIndex]
  const clusters = clusterArabic(word.arabic)
  const [shuffled] = useState(() => [...clusters].sort(() => Math.random() - 0.5))
  const [slots, setSlots] = useState<string[]>([])
  const [used, setUsed] = useState<Set<number>>(new Set())

  const handleTileClick = (tile: string, tileIndex: number) => {
    if (used.has(tileIndex)) return

    const nextSlotIndex = slots.length
    if (nextSlotIndex >= clusters.length) return

    const shouldBe = clusters[nextSlotIndex]
    if (tile === shouldBe) {
      setSlots([...slots, tile])
      setUsed(new Set([...used, tileIndex]))

      if (nextSlotIndex === clusters.length - 1) {
        toast.success('Great job! ✔', {
          description: 'Assembled correctly!'
        })
      }
    } else {
      toast.error('Not quite!', {
        description: 'Try a different letter'
      })
    }
  }

  const handleReset = () => {
    setSlots([])
    setUsed(new Set())
  }

  const handlePrev = () => {
    setWordIndex((wordIndex - 1 + SPELLING_WORDS.length) % SPELLING_WORDS.length)
    handleReset()
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % SPELLING_WORDS.length)
    handleReset()
  }

  return (
    <Card className="p-8 space-y-6">
      <p className="text-center text-xl text-muted-foreground">
        Word {wordIndex + 1} — select the letters in order
      </p>

      <div className="flex flex-wrap gap-3 justify-center" dir="rtl">
        {clusters.map((_, index) => (
          <div
            key={index}
            className={`min-w-[64px] min-h-[72px] border-3 rounded-2xl p-3 flex items-center justify-center text-4xl ${
              slots[index]
                ? 'border-primary bg-card border-solid'
                : 'border-dashed border-muted bg-muted/20'
            }`}
            style={{
              fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif"
            }}
          >
            {slots[index] || ''}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center" dir="rtl">
        {shuffled.map((cluster, index) => (
          <Button
            key={index}
            variant="outline"
            size="lg"
            onClick={() => handleTileClick(cluster, index)}
            disabled={used.has(index)}
            className={`min-w-[80px] h-auto py-4 text-4xl border-2 ${
              used.has(index) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif"
            }}
          >
            {cluster}
          </Button>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button onClick={handlePrev}>Prev Word</Button>
        <Button onClick={handleNext}>Next Word</Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Card>
  )
}

function PhoneticMatchMode() {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [rightOrder] = useState(() =>
    SPELLING_WORDS.map((_, i) => i).sort(() => Math.random() - 0.5)
  )

  const tryMatch = (leftIndex: number | null, rightIndex: number | null) => {
    if (leftIndex === null || rightIndex === null) return

    if (leftIndex === rightIndex) {
      setMatched(new Set([...matched, leftIndex]))
      toast.success('Nice match! ✅')
      setSelectedLeft(null)
      setSelectedRight(null)

      if (matched.size + 1 === SPELLING_WORDS.length) {
        toast.success('All matched! Great work! 🎉')
      }
    } else {
      toast.error('Not a match, try again.')
      setSelectedLeft(null)
      setSelectedRight(null)
    }
  }

  const handleLeftClick = (index: number) => {
    if (matched.has(index)) return
    const newLeft = selectedLeft === index ? null : index
    setSelectedLeft(newLeft)
    if (selectedRight !== null) {
      setTimeout(() => tryMatch(newLeft, selectedRight), 100)
    }
  }

  const handleRightClick = (index: number) => {
    if (matched.has(index)) return
    const newRight = selectedRight === index ? null : index
    setSelectedRight(newRight)
    if (selectedLeft !== null) {
      setTimeout(() => tryMatch(selectedLeft, newRight), 100)
    }
  }

  return (
    <Card className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Words
          </h3>
          <div className="space-y-2">
            {SPELLING_WORDS.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleLeftClick(index)}
                disabled={matched.has(index)}
                className={`w-full text-2xl h-auto py-4 ${
                  matched.has(index)
                    ? 'bg-success/20 border-success'
                    : selectedLeft === index
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
                style={{
                  fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
                  direction: 'rtl'
                }}
              >
                {word.arabic}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Phonetics
          </h3>
          <div className="space-y-2">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-xl h-auto py-4 font-mono ${
                  matched.has(originalIndex)
                    ? 'bg-success/20 border-success'
                    : selectedRight === originalIndex
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
              >
                {SPELLING_WORDS[originalIndex].phonetic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function DefinitionMatchMode() {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [rightOrder] = useState(() =>
    SPELLING_WORDS.map((_, i) => i).sort(() => Math.random() - 0.5)
  )

  const tryMatch = (leftIndex: number | null, rightIndex: number | null) => {
    if (leftIndex === null || rightIndex === null) return

    if (leftIndex === rightIndex) {
      setMatched(new Set([...matched, leftIndex]))
      toast.success('Great match! 🌟')
      setSelectedLeft(null)
      setSelectedRight(null)

      if (matched.size + 1 === SPELLING_WORDS.length) {
        toast.success('All meanings matched! Fantastic! 🎉')
      }
    } else {
      toast.error('Try matching again.')
      setSelectedLeft(null)
      setSelectedRight(null)
    }
  }

  const handleLeftClick = (index: number) => {
    if (matched.has(index)) return
    const newLeft = selectedLeft === index ? null : index
    setSelectedLeft(newLeft)
    if (selectedRight !== null) {
      setTimeout(() => tryMatch(newLeft, selectedRight), 100)
    }
  }

  const handleRightClick = (index: number) => {
    if (matched.has(index)) return
    const newRight = selectedRight === index ? null : index
    setSelectedRight(newRight)
    if (selectedLeft !== null) {
      setTimeout(() => tryMatch(selectedLeft, newRight), 100)
    }
  }

  return (
    <Card className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Arabic
          </h3>
          <div className="space-y-2">
            {SPELLING_WORDS.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleLeftClick(index)}
                disabled={matched.has(index)}
                className={`w-full text-2xl h-auto py-4 ${
                  matched.has(index)
                    ? 'bg-success/20 border-success'
                    : selectedLeft === index
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
                style={{
                  fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
                  direction: 'rtl'
                }}
              >
                {word.arabic}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Definition
          </h3>
          <div className="space-y-2">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-xl h-auto py-4 ${
                  matched.has(originalIndex)
                    ? 'bg-success/20 border-success'
                    : selectedRight === originalIndex
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
              >
                {SPELLING_WORDS[originalIndex].definition}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function WriteItMode({ wordIndex, setWordIndex }: { wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = SPELLING_WORDS[wordIndex]
  const [input, setInput] = useState('')

  const checkAnswer = () => {
    const normalized = normalizeArabic(input)
    const expected = normalizeArabic(word.arabic)
    return normalized === expected
  }

  const isCorrect = input.length > 0 && checkAnswer()

  const handlePrev = () => {
    setWordIndex((wordIndex - 1 + SPELLING_WORDS.length) % SPELLING_WORDS.length)
    setInput('')
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % SPELLING_WORDS.length)
    setInput('')
  }

  return (
    <Card className="p-8 space-y-6">
      <p className="text-center text-xl font-mono text-primary">
        Write the Arabic: {word.phonetic}
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="اكتب الكلمة هنا"
        dir="rtl"
        className="w-full text-3xl p-4 border-2 border-input rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        style={{
          fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif"
        }}
      />

      {input && (
        <p
          className={`text-center text-xl font-bold ${
            isCorrect ? 'text-success' : 'text-destructive'
          }`}
        >
          {isCorrect ? 'Correct! ✅' : 'Keep trying…'}
        </p>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <Button onClick={handlePrev}>Prev Word</Button>
        <Button onClick={handleNext}>Next Word</Button>
      </div>
    </Card>
  )
}

function FlashcardsMode({ wordIndex, setWordIndex }: { wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = SPELLING_WORDS[wordIndex]
  const [revealed, setRevealed] = useState(false)

  const handlePrev = () => {
    setWordIndex((wordIndex - 1 + SPELLING_WORDS.length) % SPELLING_WORDS.length)
    setRevealed(false)
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % SPELLING_WORDS.length)
    setRevealed(false)
  }

  return (
    <Card className="p-12 space-y-8">
      <div
        className="text-7xl text-center"
        style={{
          fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
          direction: 'rtl'
        }}
      >
        {word.arabic}
      </div>

      <div className="text-center space-y-4">
        <Button variant="secondary" size="lg" onClick={() => setRevealed(!revealed)}>
          {revealed ? 'Hide' : 'Show'} phonetics
        </Button>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-mono text-primary"
          >
            {word.phonetic}
          </motion.div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button onClick={handlePrev}>Prev</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </Card>
  )
}
