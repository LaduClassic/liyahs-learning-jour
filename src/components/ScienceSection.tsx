import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Planet, Drop, Atom, Flask } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { PeriodicTable } from '@/components/PeriodicTable'
import { WaterCycle } from '@/components/WaterCycle'
import { SolarSystem } from '@/components/SolarSystem'

interface ScienceSectionProps {
  onBack: () => void
}

type ScienceActivity = 'menu' | 'periodic-table' | 'water-cycle' | 'solar-system'

export function ScienceSection({ onBack }: ScienceSectionProps) {
  const [currentActivity, setCurrentActivity] = useState<ScienceActivity>('menu')

  if (currentActivity === 'periodic-table') {
    return <PeriodicTable onBack={() => setCurrentActivity('menu')} />
  }

  if (currentActivity === 'water-cycle') {
    return <WaterCycle onBack={() => setCurrentActivity('menu')} />
  }

  if (currentActivity === 'solar-system') {
    return <SolarSystem onBack={() => setCurrentActivity('menu')} />
  }

  const topics = [
    {
      title: 'Periodic Table',
      description: 'Discover amazing elements and their secrets!',
      icon: <Atom weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 280)',
      activity: 'periodic-table' as ScienceActivity
    },
    {
      title: 'Water Cycle',
      description: 'Learn how water travels around our world',
      icon: <Drop weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 200)',
      activity: 'water-cycle' as ScienceActivity
    },
    {
      title: 'Solar System',
      description: 'Explore planets, stars, and space!',
      icon: <Planet weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 250)',
      activity: 'solar-system' as ScienceActivity
    },
    {
      title: 'Science Experiments',
      description: 'Coming soon: Fun experiments to try!',
      icon: <Flask weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 140)',
      activity: 'menu' as ScienceActivity
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
          
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'oklch(0.70 0.18 50)' }}>
            Science Lab 🔬
          </h2>
          
          <div className="w-24" />
        </div>

        <div className="mb-8 text-center">
          <p className="text-2xl text-muted-foreground">
            Explore the wonders of science! 🌟
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`h-56 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl ${
                  topic.activity === 'menu' ? 'opacity-60' : 'cursor-pointer'
                }`}
                style={{ backgroundColor: topic.color }}
                onClick={() => topic.activity !== 'menu' && setCurrentActivity(topic.activity)}
              >
                <div className="text-white">
                  {topic.icon}
                </div>
                <h3 className="text-2xl font-bold text-white text-center">
                  {topic.title}
                </h3>
                <p className="text-white/90 text-center text-lg">
                  {topic.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
