import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Planet, Drop, Lightning, Flower } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ScienceSectionProps {
  onBack: () => void
}

export function ScienceSection({ onBack }: ScienceSectionProps) {
  const topics = [
    {
      title: 'Earth & Space',
      description: 'Learn about planets, stars, and our amazing Earth!',
      icon: <Planet weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 250)'
    },
    {
      title: 'Water Cycle',
      description: 'Discover how water travels around our world',
      icon: <Drop weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 200)'
    },
    {
      title: 'Energy & Forces',
      description: 'Explore how things move and change',
      icon: <Lightning weight="fill" size={48} />,
      color: 'oklch(0.70 0.18 60)'
    },
    {
      title: 'Plants & Animals',
      description: 'Meet amazing living things in nature',
      icon: <Flower weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 140)'
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
                className="cursor-pointer h-56 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: topic.color }}
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

        <Card className="mt-8 p-8 bg-accent/20">
          <p className="text-xl text-center text-foreground">
            More science activities coming soon! Keep exploring! 🚀
          </p>
        </Card>
      </div>
    </div>
  )
}
