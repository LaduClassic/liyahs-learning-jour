import { useState } from 'react'
import { Planet, Drop, Atom, Flask } from '@phosphor-icons/react'
import { PeriodicTable } from '@/components/PeriodicTable'
import { WaterCycle } from '@/components/WaterCycle'
import { SolarSystem } from '@/components/SolarSystem'
import { SectionHeader } from '@/components/SectionHeader'
import { ActivityGrid, ActivityCardData } from '@/components/ActivityGrid'

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

  const activities: ActivityCardData[] = [
    {
      title: 'Periodic Table',
      description: 'Discover amazing elements and their secrets!',
      icon: <Atom weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 280)',
      onClick: () => setCurrentActivity('periodic-table')
    },
    {
      title: 'Water Cycle',
      description: 'Learn how water travels around our world',
      icon: <Drop weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 200)',
      onClick: () => setCurrentActivity('water-cycle')
    },
    {
      title: 'Solar System',
      description: 'Explore planets, stars, and space!',
      icon: <Planet weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 250)',
      onClick: () => setCurrentActivity('solar-system')
    },
    {
      title: 'Science Experiments',
      description: 'Coming soon: Fun experiments to try!',
      icon: <Flask weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 140)',
      onClick: () => {},
      disabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Science Lab"
          emoji="🔬"
          onBack={onBack}
          titleColor="oklch(0.70 0.18 50)"
        />

        <ActivityGrid
          activities={activities}
          subtitle="Explore the wonders of science! 🌟"
        />
      </div>
    </div>
  )
}
