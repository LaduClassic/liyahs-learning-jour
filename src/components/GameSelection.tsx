import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Lightning, Cards, GridFour } from '@phosphor-icons/react'
import { MathOperation, GameType } from '@/lib/types'

interface GameSelectionProps {
  operation: MathOperation
  onSelectGame: (gameType: GameType) => void
  onBack?: () => void
}

export function GameSelection({ operation, onSelectGame, onBack }: GameSelectionProps) {
  const operationTitles: Record<MathOperation, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division'
  }

  const games: Array<{
    type: GameType
    title: string
    description: string
    icon: React.ReactElement
    color: string
  }> = []

  if (operation === 'multiplication') {
    games.push({
      type: 'multiplication-chart' as GameType,
      title: 'Times Table Chart',
      description: 'Explore patterns by highlighting',
      icon: <GridFour weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 300)'
    })
  }

  games.push(
    {
      type: 'flashcards' as GameType,
      title: 'Flashcards',
      description: 'Practice at your own pace',
      icon: <Cards weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 200)'
    },
    {
      type: 'racing' as GameType,
      title: 'Speed Race',
      description: 'Answer as many as you can in 60 seconds!',
      icon: <Lightning weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 50)'
    }
  )

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft size={24} />
              Back
            </Button>
            
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {operationTitles[operation]}
            </h2>
            
            <div className="w-24" />
          </div>
        )}
        
        {!onBack && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              {operationTitles[operation]}
            </h2>
          </div>
        )}

        <div className="mb-6 text-center">
          <p className="text-2xl text-muted-foreground">
            Choose a game to play! 🎮
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer h-64 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: game.color }}
                onClick={() => onSelectGame(game.type)}
              >
                <div className="text-white">
                  {game.icon}
                </div>
                <h3 className="text-2xl font-bold text-white text-center">
                  {game.title}
                </h3>
                <p className="text-white/90 text-center text-lg">
                  {game.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
