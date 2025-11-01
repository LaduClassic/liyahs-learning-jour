import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Robot, Lightbulb, Path, Code } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { SequenceGame } from '@/components/SequenceGame'
import { PatternMatcher } from '@/components/PatternMatcher'
import { RobotCommands } from '@/components/RobotCommands'

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

  const activities = [
    {
      title: 'Robot Commands',
      description: 'Guide the robot to the goal with code!',
      icon: <Robot weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 280)',
      activity: 'robot' as CodingActivity
    },
    {
      title: 'Sequence Builder',
      description: 'Put steps in the right order',
      icon: <Path weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 200)',
      activity: 'sequence' as CodingActivity
    },
    {
      title: 'Pattern Matcher',
      description: 'Find and complete the patterns',
      icon: <Lightbulb weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 50)',
      activity: 'patterns' as CodingActivity
    },
    {
      title: 'More Games',
      description: 'Coming soon: More coding adventures!',
      icon: <Code weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 140)',
      activity: 'menu' as CodingActivity
    }
  ]

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
          
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'oklch(0.70 0.18 280)' }}>
            Coding Fun 💻
          </h2>
          
          <div className="w-24" />
        </div>

        <div className="mb-8 text-center">
          <p className="text-2xl text-muted-foreground">
            Learn to think like a programmer! 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`h-56 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl ${
                  activity.activity === 'menu' ? 'opacity-60' : 'cursor-pointer'
                }`}
                style={{ backgroundColor: activity.color }}
                onClick={() => activity.activity !== 'menu' && setCurrentActivity(activity.activity)}
              >
                <div className="text-white">
                  {activity.icon}
                </div>
                <h3 className="text-2xl font-bold text-white text-center">
                  {activity.title}
                </h3>
                <p className="text-white/90 text-center text-lg">
                  {activity.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

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
