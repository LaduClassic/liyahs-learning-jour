import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Plus, Minus, X, Divide } from '@phosphor-icons/react'
import { MathOperation, GameType } from '@/lib/types'
import { GameSelection } from '@/components/GameSelection'
import { FlashcardGame } from '@/components/FlashcardGame'
import { RacingGame } from '@/components/RacingGame'
import { MultiplicationChart } from '@/components/MultiplicationChart'

interface MathSectionProps {
  onBack: () => void
  onSessionComplete: (operation: MathOperation, score: number, total: number) => void
}

export function MathSection({ onBack, onSessionComplete }: MathSectionProps) {
  const [selectedOperation, setSelectedOperation] = useState<MathOperation>('addition')
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)

  const handleSelectGame = (gameType: GameType) => {
    setSelectedGame(gameType)
  }

  const handleBackToGames = () => {
    setSelectedGame(null)
  }

  const handleBackToOperations = () => {
    setSelectedGame(null)
  }

  const handleGameComplete = (score: number, total: number) => {
    onSessionComplete(selectedOperation, score, total)
    setSelectedGame(null)
  }

  if (selectedGame === 'multiplication-chart') {
    return <MultiplicationChart onBack={handleBackToGames} />
  }

  if (selectedGame === 'flashcards') {
    return (
      <FlashcardGame
        operation={selectedOperation}
        onBack={handleBackToGames}
        onSessionComplete={handleGameComplete}
      />
    )
  }

  if (selectedGame === 'racing') {
    return (
      <RacingGame
        operation={selectedOperation}
        onBack={handleBackToGames}
        onSessionComplete={handleGameComplete}
      />
    )
  }

  if (selectedGame) {
    return (
      <GameSelection
        operation={selectedOperation}
        onSelectGame={handleSelectGame}
        onBack={handleBackToOperations}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft size={24} />
            Home
          </Button>
          
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            Math Fun 🧮
          </h2>
          
          <div className="w-24" />
        </div>

        <Tabs value={selectedOperation} onValueChange={(value) => setSelectedOperation(value as MathOperation)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-transparent">
            <TabsTrigger
              value="addition"
              className="text-lg md:text-xl py-4 px-6 data-[state=active]:bg-success data-[state=active]:text-success-foreground"
            >
              <Plus size={24} weight="bold" className="mr-2" />
              Addition
            </TabsTrigger>
            <TabsTrigger
              value="subtraction"
              className="text-lg md:text-xl py-4 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Minus size={24} weight="bold" className="mr-2" />
              Subtraction
            </TabsTrigger>
            <TabsTrigger
              value="multiplication"
              className="text-lg md:text-xl py-4 px-6 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <X size={24} weight="bold" className="mr-2" />
              Multiplication
            </TabsTrigger>
            <TabsTrigger
              value="division"
              className="text-lg md:text-xl py-4 px-6 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
            >
              <Divide size={24} weight="bold" className="mr-2" />
              Division
            </TabsTrigger>
          </TabsList>

          {(['addition', 'subtraction', 'multiplication', 'division'] as MathOperation[]).map((operation) => (
            <TabsContent key={operation} value={operation} className="mt-8">
              <GameSelection
                operation={operation}
                onSelectGame={handleSelectGame}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
