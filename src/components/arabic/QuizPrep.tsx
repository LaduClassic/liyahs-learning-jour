import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { clusterArabic, DEFAULT_SPELLING_WORDS, SpellingWord } from '@/lib/arabicData'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { QuizUploader } from '@/components/arabic/QuizUploader'
import { useKV } from '@github/spark/hooks'
import { X, Play } from '@phosphor-icons/react'

type PrepMode = 'flashcards' | 'letter-order' | 'phonetic-match' | 'definition-match' | 'write-it'

export function QuizPrep() {
  const [mode, setMode] = useState<PrepMode>('flashcards')
  const [wordIndex, setWordIndex] = useState(0)
  const [customWords] = useKV<SpellingWord[] | null>('arabic-custom-words', null)
  
  const words = customWords || DEFAULT_SPELLING_WORDS

  const handleWordsUpdated = () => {
    setWordIndex(0)
  }

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
    'phonetic-match': 'Match each Arabic word to its English meaning.',
    'definition-match': 'Pair every Arabic word with its transliteration.',
    'write-it': 'Write the Arabic spelling from the English meaning.'
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
        <div className="flex-1 flex justify-center w-full overflow-x-auto">
          <div className="inline-flex flex-nowrap gap-2 p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full shadow-lg">
            {modes.map(({ id, label }) => (
              <Button
                key={id}
                variant={mode === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setMode(id)
                  setWordIndex(0)
                }}
                className={`rounded-full font-bold whitespace-nowrap text-xs sm:text-sm ${
                  mode === id ? 'shadow-lg' : ''
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <QuizUploader onWordsUpdated={handleWordsUpdated} />
        </div>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl text-center text-muted-foreground px-4">
        {descriptions[mode]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${words.length}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {mode === 'letter-order' && <LetterOrderMode words={words} wordIndex={wordIndex} setWordIndex={setWordIndex} />}
          {mode === 'phonetic-match' && <PhoneticMatchMode words={words} />}
          {mode === 'definition-match' && <DefinitionMatchMode words={words} />}
          {mode === 'write-it' && <WriteItMode words={words} wordIndex={wordIndex} setWordIndex={setWordIndex} />}
          {mode === 'flashcards' && <FlashcardsMode words={words} wordIndex={wordIndex} setWordIndex={setWordIndex} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LetterOrderMode({ words, wordIndex, setWordIndex }: { words: SpellingWord[]; wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = words[wordIndex]
  const clusters = clusterArabic(word.arabic)
  const [shuffled, setShuffled] = useState<string[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [used, setUsed] = useState<Set<number>>(new Set())

  useEffect(() => {
    setShuffled([...clusters].sort(() => Math.random() - 0.5))
    setSlots([])
    setUsed(new Set())
  }, [wordIndex, word.arabic])

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
    setWordIndex((wordIndex - 1 + words.length) % words.length)
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % words.length)
  }

  return (
    <Card className="p-4 sm:p-6 md:p-8 w-full">
      <div className="flex flex-col gap-6">
        <p className="text-center text-base sm:text-lg md:text-xl text-muted-foreground">
          Word {wordIndex + 1} — select the letters in order
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center w-full" dir="rtl">
          {clusters.map((_, index) => (
            <div
              key={index}
              className={`w-14 h-16 sm:w-16 sm:h-20 md:min-w-[64px] md:min-h-[72px] border-2 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl ${
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

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center w-full" dir="rtl">
          {shuffled.map((cluster, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              onClick={() => handleTileClick(cluster, index)}
              disabled={used.has(index)}
              className={`min-w-[64px] sm:min-w-[80px] h-auto py-3 sm:py-4 text-2xl sm:text-3xl md:text-4xl border-2 ${
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

        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap w-full">
          <Button onClick={handlePrev} className="flex-1 sm:flex-initial">Prev Word</Button>
          <Button onClick={handleNext} className="flex-1 sm:flex-initial">Next Word</Button>
          <Button variant="secondary" onClick={handleReset} className="flex-1 sm:flex-initial">
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}

function PhoneticMatchMode({ words }: { words: SpellingWord[] }) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [rightOrder] = useState(() =>
    words.map((_, i) => i).sort(() => Math.random() - 0.5)
  )

  const tryMatch = (leftIndex: number | null, rightIndex: number | null) => {
    if (leftIndex === null || rightIndex === null) return

    if (leftIndex === rightIndex) {
      setMatched(new Set([...matched, leftIndex]))
      toast.success('Nice match! ✅')
      setSelectedLeft(null)
      setSelectedRight(null)

      if (matched.size + 1 === words.length) {
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
    <Card className="p-4 sm:p-6 md:p-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Arabic Words
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {words.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleLeftClick(index)}
                disabled={matched.has(index)}
                className={`w-full text-xl sm:text-2xl h-auto py-3 sm:py-4 ${
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

        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            English Meanings
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-xl sm:text-2xl h-auto py-3 sm:py-4 ${
                  matched.has(originalIndex)
                    ? 'bg-success/20 border-success'
                    : selectedRight === originalIndex
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
              >
                {words[originalIndex].phonetic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function DefinitionMatchMode({ words }: { words: SpellingWord[] }) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [rightOrder] = useState(() =>
    words.map((_, i) => i).sort(() => Math.random() - 0.5)
  )

  const tryMatch = (leftIndex: number | null, rightIndex: number | null) => {
    if (leftIndex === null || rightIndex === null) return

    if (leftIndex === rightIndex) {
      setMatched(new Set([...matched, leftIndex]))
      toast.success('Great match! 🌟')
      setSelectedLeft(null)
      setSelectedRight(null)

      if (matched.size + 1 === words.length) {
        toast.success('All transliterations matched! Fantastic! 🎉')
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
    <Card className="p-4 sm:p-6 md:p-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Arabic Words
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {words.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleLeftClick(index)}
                disabled={matched.has(index)}
                className={`w-full text-xl sm:text-2xl h-auto py-3 sm:py-4 ${
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

        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Transliterations
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-xl sm:text-2xl h-auto py-3 sm:py-4 font-mono ${
                  matched.has(originalIndex)
                    ? 'bg-success/20 border-success'
                    : selectedRight === originalIndex
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
              >
                {words[originalIndex].definition}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function WriteItMode({ words, wordIndex, setWordIndex }: { words: SpellingWord[]; wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = words[wordIndex]
  const [showFullscreen, setShowFullscreen] = useState(false)

  const handlePrev = () => {
    setWordIndex((wordIndex - 1 + words.length) % words.length)
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % words.length)
  }

  return (
    <>
      <Card className="p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-center text-2xl sm:text-3xl font-bold text-primary">
              {word.phonetic}
            </p>
            <p className="text-center text-base sm:text-lg font-mono text-muted-foreground">
              ({word.definition})
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowFullscreen(true)}
              className="w-full max-w-md gap-2"
            >
              Open Writing Canvas
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Click to open full-screen writing area
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap w-full">
            <Button onClick={handlePrev} className="flex-1 sm:flex-initial">Prev Word</Button>
            <Button onClick={handleNext} className="flex-1 sm:flex-initial">Next Word</Button>
          </div>
        </div>
      </Card>

      <WriteItDialog
        open={showFullscreen}
        onOpenChange={setShowFullscreen}
        word={word}
      />
    </>
  )
}

function WriteItDialog({ 
  open, 
  onOpenChange, 
  word 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  word: SpellingWord
}) {
  const [showTrace, setShowTrace] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const canvas = canvasRef.current
    if (!canvas || !open) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return
    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 5
      ctx.strokeStyle = '#5B5FC7'
      ctx.lineWidth = 5
      ctx.strokeStyle = '#5B5FC7'
      canvas.style.height = `${rect.height}px`
      
      contextRef.current = ctx
      
      contextRef.current = ctx
    }


    return () => {
      window.removeEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      contextRef.current = null
    
  }, [open])ches' in e && e.touches.length > 0) {

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
 clientY = e.clientY
      return null
    
    let clientX: number
    let clientY: number
      y: clientY - rect.top
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    } else {
      return nulltrue)
  const clearCanvas = () => {
    clearCanvas()
    setShowTrace(true)
      x: clientX - rect.left,
      y: clientY - rect.top

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      >
    if (!coords || !contextRef.current) return overflow-hidden">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10 shrink-0">
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
    -bold">{word.phonetic}</span> ({word.definition})
    contextRef.current.beginPath()
    contextRef.current.moveTo(coords.x, coords.y)
            <Button
              variant="ghost"
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return
e="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0 ml-2 hover:bg-destructive/20 hover:text-destructive"
              <X size={24} weight="bold" />
    if (!coords) return
          </div>
    contextRef.current.lineTo(coords.x, coords.y)
    contextRef.current.stroke()sm:p-4 md:p-6 gap-3 sm:gap-4 overflow-hidden min-h-0">
                onClick={() => setShowTrace(!showTrace)}
                className="text-xs sm:text-sm"
  const stopDrawing = () => {
    if (!contextRef.current) returnuide
                size="sm"
    contextRef.current.closePath()
                disabled={!hasDrawn}
                className="text-xs sm:text-sm"
              >
                Clear Canvas
    if (!canvas || !contextRef.current) return

            <div 
    const dpr = window.devicePixelRatio || 1-2xl sm:rounded-3xl border-4 border-dashed border-primary/30 overflow-hidden min-h-0"
    contextRef.current.clearRect(0, 0, rect.width * dpr, rect.height * dpr)
            >
              {showTrace && (
                <div
  const handleClose = () => {nset-0 flex justify-center items-center select-none pointer-events-none p-4 sm:p-6 md:p-8"
    clearCanvas()
    setShowTrace(true)
    onOpenChange(false)
  }
: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
  return (ch(0.60 0.19 250 / 0.15)',
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="!max-w-none !w-screen !h-screen !max-h-screen !p-0 !gap-0 !border-0 !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0 flex flex-col overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={handleClose}
                </div>
              )}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10 shrink-0">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              onClick={handleClose}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0 ml-2 hover:bg-destructive/20 hover:text-destructive"
        </div>
      </DialogContent>
    </Dialog>
  );
}

          <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 overflow-hidden min-h-0">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrace(!showTrace)}
                className="text-xs sm:text-sm"
              >
                {showTrace ? 'Hide' : 'Show'} Guide
              </Button>
          </Button>
          {revealed && (
            <motion.div
                onClick={clearCanvas}
            </motion.div>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap w-full">
          <Button onClick={handlePrev} className="flex-1 sm:flex-initial">Prev</Button>
          <Button onClick={handleNext} className="flex-1 sm:flex-initial">Next</Button>
        </div>
              className="relative flex-1 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl sm:rounded-3xl border-4 border-dashed border-primary/30 overflow-hidden min-h-0"
    </Card>
  )
              {showTrace && (
                  className="absolute inset-0 flex justify-center items-center select-none pointer-events-none p-4 sm:p-6 md:p-8"                    className="text-[clamp(4rem,15vw,12rem)] whitespace-nowrap font-bold"                      color: 'oklch(0.60 0.19 250 / 0.15)',                      WebkitTextStroke: '2px oklch(0.60 0.19 250 / 0.2)'                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"                onMouseDown={startDrawing}                onMouseMove={draw}                onMouseUp={stopDrawing}                onMouseLeave={stopDrawing}                onTouchStart={startDrawing}                onTouchMove={draw}                onTouchEnd={stopDrawing}
            <div className="text-center space-y-1 shrink-0">              <p className="text-xs sm:text-sm text-pretty">Use your mouse, stylus, or finger to trace the Arabic letters</p>                Toggle the guide to see or hide the outline