import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ARABIC_LETTERS } from '@/lib/arabicData'

type WritingCanvasProps = {
  guideText?: string
}

export function WritingCanvas({ guideText: initialGuideText }: WritingCanvasProps) {
  const [selectedLetter, setSelectedLetter] = useState(initialGuideText || 'ا')
  const guideText = selectedLetter
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const setup = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 4
      ctx.strokeStyle = '#5B5CE2'

      ctx.clearRect(0, 0, rect.width, rect.height)
      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
      gradient.addColorStop(0, '#fff9ff')
      gradient.addColorStop(1, '#fff5ff')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      if (guideText) {
        ctx.fillStyle = '#8db9ff'
        ctx.font = '64px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(guideText, rect.width / 2, rect.height / 2)
      }
    }

    setup()
    const observer = new ResizeObserver(setup)
    observer.observe(container)
    return () => observer.disconnect()
  }, [guideText])

  const getPos = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    return {
      x: Math.max(0, Math.min(rect.width, x)),
      y: Math.max(0, Math.min(rect.height, y)),
    }
  }

  const handlePointerDown = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    canvas.setPointerCapture(evt.pointerId)
    isDrawingRef.current = true
    lastPointRef.current = getPos(evt)
  }

  const handlePointerMove = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const last = lastPointRef.current
    const { x, y } = getPos(evt)
    if (!last) {
      lastPointRef.current = { x, y }
      return
    }

    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastPointRef.current = { x, y }
  }

  const endStroke = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas && canvas.hasPointerCapture(evt.pointerId)) {
      canvas.releasePointerCapture(evt.pointerId)
    }
    isDrawingRef.current = false
    lastPointRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const rect = container.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, rect.width, rect.height)
    const event = new Event('resize')
    window.dispatchEvent(event)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="lg:w-64 flex-shrink-0">
        <Card className="p-4">
          <h4 className="font-bold text-lg mb-3 text-foreground">Choose a Letter</h4>
          <ScrollArea className="h-[200px] lg:h-[calc(100vh-24rem)]">
            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
              {ARABIC_LETTERS.map((letter) => (
                <Button
                  key={letter.name}
                  variant={selectedLetter === letter.forms.isolated ? 'default' : 'outline'}
                  className="h-12 text-2xl font-bold"
                  onClick={() => {
                    setSelectedLetter(letter.forms.isolated)
                    clearCanvas()
                  }}
                >
                  {letter.forms.isolated}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-xl font-bold text-primary">Practice Writing</h3>
            <p className="text-sm text-muted-foreground">Trace the letter below</p>
          </div>
          <Button
            onClick={clearCanvas}
            className="rounded-full"
            size="sm"
          >
            Clear Canvas
          </Button>
        </div>

        <div
          ref={containerRef}
          className="flex-1 border-2 border-dashed rounded-2xl overflow-hidden relative"
          style={{ borderColor: '#9ac3ff', background: '#fffafc' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
            onPointerCancel={endStroke}
          />
        </div>

        <div className="mt-2 text-xs sm:text-sm text-center text-muted-foreground">
          Use your stylus or finger to trace the Arabic letters.
        </div>
      </div>
    </div>
  )
}
