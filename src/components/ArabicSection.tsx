import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Question } from '@phosphor-icons/react'
import { LettersQuiz } from '@/components/arabic/LettersQuiz'
import { QuizPrep } from '@/components/arabic/QuizPrep'
import { LetterReference } from '@/components/arabic/LetterReference'

interface ArabicSectionProps {
  onBack: () => void
}

export function ArabicSection({ onBack }: ArabicSectionProps) {
  const [showReference, setShowReference] = useState(false)

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
            Aaliyah's Journey ✨
          </h2>
          
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowReference(true)}
            className="gap-2"
          >
            <Question size={24} weight="fill" />
            Help
          </Button>
        </div>

        <div className="mb-8 text-center">
          <p className="text-2xl text-muted-foreground">
            مرحبا! Let's learn Arabic! 🌙
          </p>
        </div>

        <Tabs defaultValue="letters" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex gap-2 bg-muted/50 p-2 rounded-full">
              <TabsTrigger
                value="letters"
                className="rounded-full px-6 py-2 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
              >
                Letters
              </TabsTrigger>
              <TabsTrigger
                value="prep"
                className="rounded-full px-6 py-2 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
              >
                Quiz Prep
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="letters" className="mt-0">
            <LettersQuiz />
          </TabsContent>

          <TabsContent value="prep" className="mt-0">
            <QuizPrep />
          </TabsContent>
        </Tabs>
      </div>

      <LetterReference
        open={showReference}
        onOpenChange={setShowReference}
      />
    </div>
  )
}
