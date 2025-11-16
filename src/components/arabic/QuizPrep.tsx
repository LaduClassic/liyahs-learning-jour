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
    'phonetic-match': 'Match each Arabic word to the way it sounds.',
    'definition-match': 'Pair every Arabic word with its English meaning.',
    'write-it': 'Write the Arabic spelling from the pronunciation.'
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
            Words
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
            Phonetics
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-base sm:text-lg md:text-xl h-auto py-3 sm:py-4 font-mono ${
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
    <Card className="p-4 sm:p-6 md:p-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Arabic
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
            Definition
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {rightOrder.map((originalIndex) => (
              <Button
                key={originalIndex}
                variant="outline"
                size="lg"
                onClick={() => handleRightClick(originalIndex)}
                disabled={matched.has(originalIndex)}
                className={`w-full text-base sm:text-lg md:text-xl h-auto py-3 sm:py-4 ${
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
            <p className="text-center text-lg sm:text-xl font-mono text-primary font-bold">
              {word.phonetic}
            </p>
            <p className="text-center text-base sm:text-lg text-muted-foreground">
              {word.definition}
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
              Click to open full-screen writing area with demonstrations
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
  const [showAnimation, setShowAnimation] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !open) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 4
      ctx.strokeStyle = 'oklch(0.60 0.19 250)'
      
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    setTimeout(resizeCanvas, 100)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [open])

  const animateWordWriting = async () => {
    setShowAnimation(true)
    
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const canvas = animationCanvasRef.current
    if (!canvas) {
      setShowAnimation(false)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setShowAnimation(false)
      return
    }
    
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    ctx.font = `bold ${Math.min(rect.width * 0.3, 200)}px 'Scheherazade New', 'Noto Naskh Arabic', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'oklch(0.60 0.19 250)'

    const text = word.arabic
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    for (let i = 0; i <= text.length; i++) {
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      const partialText = text.substring(0, i)
      ctx.fillText(partialText, centerX, centerY)

      if (i < text.length) {
        const currentMetrics = ctx.measureText(partialText)
        const cursorX = centerX + currentMetrics.width / 2 + 5
        
        ctx.beginPath()
        ctx.arc(cursorX, centerY, 8, 0, Math.PI * 2)
        ctx.fillStyle = 'oklch(0.85 0.16 90)'
        ctx.fill()
        ctx.fillStyle = 'oklch(0.60 0.19 250)'
      }

      await new Promise(resolve => setTimeout(resolve, 400))
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowAnimation(false)
  }

  const getCoordinates = (e: React.PointerEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const coords = getCoordinates(e)
    if (!coords) return

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setHasDrawn(true)
    lastPointRef.current = coords
    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
  }

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    e.stopPropagation()

    const coords = getCoordinates(e)
    if (!coords || !lastPointRef.current) return

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
    lastPointRef.current = coords
  }

  const stopDrawing = (e?: React.PointerEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    setHasDrawn(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="!max-w-none !w-screen !h-screen !max-h-screen !p-0 !gap-0 !border-0 !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0 flex flex-col overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => {
          clearCanvas()
          setShowTrace(true)
          setShowAnimation(false)
          onOpenChange(false)
        }}
      >
        <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10 shrink-0 z-20">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary truncate">
                Practice Writing
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                <span className="font-mono font-bold">{word.phonetic}</span> — {word.definition}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                clearCanvas()
                setShowTrace(true)
                setShowAnimation(false)
                onOpenChange(false)
              }}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0 ml-2 hover:bg-destructive/20 hover:text-destructive z-30"
              aria-label="Close"
            >
              <X size={24} weight="bold" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 overflow-hidden min-h-0 z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0 z-20">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    animateWordWriting()
                  }}
                  disabled={showAnimation}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Play size={18} weight="fill" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowTrace(!showTrace)
                  }}
                  className="text-xs sm:text-sm"
                >
                  {showTrace ? 'Hide' : 'Show'} Guide
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  clearCanvas()
                }}
                disabled={!hasDrawn}
                className="text-xs sm:text-sm"
              >
                Clear Canvas
              </Button>
            </div>

            <div 
              className="relative flex-1 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl sm:rounded-3xl border-4 border-dashed border-primary/30 overflow-hidden min-h-0 z-10"
              dir="rtl"
            >
              {showTrace && !showAnimation && (
                <div
                  className="absolute inset-0 flex justify-center items-center select-none pointer-events-none p-4 sm:p-6 md:p-8 z-0"
                >
                  <div
                    className="text-[clamp(3rem,12vw,10rem)] whitespace-nowrap"
                    style={{
                      fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
                      color: 'oklch(0.60 0.19 250 / 0.2)',
                      textShadow: '0 0 2px oklch(0.60 0.19 250 / 0.3)',
                      WebkitTextStroke: '2px oklch(0.60 0.19 250 / 0.25)'
                    }}
                  >
                    {word.arabic}
                  </div>
                </div>
              )}

              {showAnimation && (
                <canvas
                  ref={animationCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                />
              )}
              
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onPointerCancel={stopDrawing}
                style={{ touchAction: 'none' }}
              />
            </div>

            <div className="text-center space-y-1 shrink-0 z-20">
              <p className="text-xs sm:text-sm text-pretty">Use your stylus or finger to trace the Arabic letters</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground/70">
                Watch the demo to see how the word is written, then practice on your own
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FlashcardsMode({ words, wordIndex, setWordIndex }: { words: SpellingWord[]; wordIndex: number; setWordIndex: (i: number) => void }) {
  const word = words[wordIndex]
  const [revealed, setRevealed] = useState(false)

  const handlePrev = () => {
    setWordIndex((wordIndex - 1 + words.length) % words.length)
    setRevealed(false)
  }

  const handleNext = () => {
    setWordIndex((wordIndex + 1) % words.length)
    setRevealed(false)
  }

  return (
    <Card className="p-6 sm:p-8 md:p-12 w-full">
      <div className="flex flex-col gap-6 sm:gap-8">
        <div
          className="text-5xl sm:text-6xl md:text-7xl text-center break-words"
          style={{
            fontFamily: "'Scheherazade New', 'Noto Naskh Arabic', 'Noto Kufi Arabic', 'Geeza Pro', 'Arial', sans-serif",
            direction: 'rtl'
          }}
        >
          {word.arabic}
        </div>

        <div className="text-center flex flex-col gap-4">
          <Button variant="secondary" size="lg" onClick={() => setRevealed(!revealed)} className="w-full sm:w-auto">
            {revealed ? 'Hide' : 'Show'} phonetics
          </Button>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-mono text-primary"
            >
              {word.phonetic}
            </motion.div>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap w-full">
          <Button onClick={handlePrev} className="flex-1 sm:flex-initial">Prev</Button>
          <Button onClick={handleNext} className="flex-1 sm:flex-initial">Next</Button>
        </div>
      </div>
    </Card>
  )
}
