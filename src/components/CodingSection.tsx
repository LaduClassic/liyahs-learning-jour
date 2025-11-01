import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Robot, Lightbulb, Path, Code } from '@phosphor-icons/react'
import { SequenceGame } from '@/components/SequenceGame'
import { PatternMatcher } from '@/components/PatternMatcher'
import { RobotCommands } from '@/components/RobotCommands'
import { SectionHeader } from '@/components/SectionHeader'
import { ActivityGrid, ActivityCardData } from '@/components/ActivityGrid'

interface CodingSectionProps {
  onBack: () => void
}

type CodingActivity = 'menu' | 'sequence' | 'patterns' | 'robot'

export function CodingSection({ onBack }: CodingSectionProps) {
  const [currentActivity, setCurrentActivity] = useState<CodingActivity>('menu')

  if (currentActivity === 'sequence') {
    return <SequenceGame onBack={() => setCurrentActivity('menu')} />
  }

  if (currentActivity === 'patterns') {
    return <PatternMatcher onBack={() => setCurrentActivity('menu')} />
  }

  if (currentActivity === 'robot') {
    return <RobotCommands onBack={() => setCurrentActivity('menu')} />
  }

  const activities: ActivityCardData[] = [
    {
      title: 'Robot Commands',
      description: 'Guide the robot to the goal with code!',
      icon: <Robot weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 280)',
      onClick: () => setCurrentActivity('robot')
    },
    {
      title: 'Step Sorter',
      description: 'Put steps in the right order',
      icon: <Path weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 200)',
      onClick: () => setCurrentActivity('sequence')
    },
    {
      title: 'Pattern Matcher',
      description: 'Find and complete the patterns',
      icon: <Lightbulb weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 50)',
      onClick: () => setCurrentActivity('patterns')
    },
    {
      title: 'More Games',
      description: 'Coming soon: More coding adventures!',
      icon: <Code weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 140)',
      onClick: () => {},
      disabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Coding Fun"
          emoji="💻"
          onBack={onBack}
          titleColor="oklch(0.70 0.18 280)"
        />

        <ActivityGrid
          activities={activities}
          subtitle="Learn to think like a programmer! 🚀"
        />

        <Card className="mt-8 p-6 bg-accent/20">
          <h3 className="text-2xl font-bold mb-4 text-center">What is Coding? 💡</h3>
          <p className="text-lg text-center">
            Coding is like giving instructions to a computer or robot. Just like following a recipe to bake cookies, computers need step-by-step instructions to do tasks! 🍪
          </p>
        </Card>
      </div>
    </div>
  )
}
