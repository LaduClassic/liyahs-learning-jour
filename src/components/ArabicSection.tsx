import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, BookOpen, PencilSimple, Translate, Microphone } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ArabicSectionProps {
  onBack: () => void
}

export function ArabicSection({ onBack }: ArabicSectionProps) {
  const lessons = [
    {
      title: 'Letters & Sounds',
      description: 'Learn the Arabic alphabet',
      icon: <BookOpen weight="fill" size={48} />,
      color: 'oklch(0.68 0.16 30)'
    },
    {
      title: 'Writing Practice',
      description: 'Practice writing Arabic letters',
      icon: <PencilSimple weight="fill" size={48} />,
      color: 'oklch(0.65 0.18 20)'
    },
    {
      title: 'Words & Vocabulary',
      description: 'Build your Arabic word knowledge',
      icon: <Translate weight="fill" size={48} />,
      color: 'oklch(0.70 0.16 40)'
    },
    {
      title: 'Pronunciation',
      description: 'Listen and speak Arabic words',
      icon: <Microphone weight="fill" size={48} />,
      color: 'oklch(0.65 0.20 10)'
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
          
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'oklch(0.68 0.16 30)' }}>
            Arabic Studies 📖
          </h2>
          
          <div className="w-24" />
        </div>

        <div className="mb-8 text-center">
          <p className="text-2xl text-muted-foreground">
            مرحبا! Let's learn Arabic! 🌙
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer h-56 flex flex-col items-center justify-center gap-4 p-6 transition-shadow hover:shadow-2xl"
                style={{ backgroundColor: lesson.color }}
              >
                <div className="text-white">
                  {lesson.icon}
                </div>
                <h3 className="text-2xl font-bold text-white text-center">
                  {lesson.title}
                </h3>
                <p className="text-white/90 text-center text-lg">
                  {lesson.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mt-8 p-8 bg-accent/20">
          <p className="text-xl text-center text-foreground">
            More Arabic lessons coming soon! Keep learning! 📚
          </p>
        </Card>
      </div>
    </div>
  )
}
