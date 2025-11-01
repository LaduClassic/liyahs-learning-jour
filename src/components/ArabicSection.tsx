import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { House, Question, BookOpen, Flask, NumberSquareOne, Code } from '@phosphor-icons/react'
import { LettersQuiz } from '@/components/arabic/LettersQuiz'
import { QuizPrep } from '@/components/arabic/QuizPrep'
import { LetterReference } from '@/components/arabic/LetterReference'

interface ArabicSectionProps {
  onBack: () => void
}

export function ArabicSection({ onBack }: ArabicSectionProps) {
  const [showReference, setShowReference] = useState(false)
  const [showSubjectSelector, setShowSubjectSelector] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-3 flex-wrap">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSubjectSelector(!showSubjectSelector)}
            className="gap-2"
          >
            <House size={24} />
            <span className="hidden sm:inline">Subjects</span>
          </Button>
          
          <h2 className="text-3xl md:text-5xl font-bold flex-1 text-center" style={{ color: 'oklch(0.68 0.16 30)' }}>
            Liyah's Journey ✨
          </h2>
          
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowReference(true)}
            className="gap-2"
          >
            <Question size={24} weight="fill" />
            <span className="hidden sm:inline">Help</span>
          </Button>
        </div>

        {showSubjectSelector && (
          <Card className="mb-8 p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Choose a Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="h-auto flex flex-col gap-2 py-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
              >
                <NumberSquareOne size={40} className="text-purple-600" weight="fill" />
                <span className="text-lg font-bold">Math</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="h-auto flex flex-col gap-2 py-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
              >
                <Flask size={40} className="text-green-600" weight="fill" />
                <span className="text-lg font-bold">Science</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSubjectSelector(false)}
                className="h-auto flex flex-col gap-2 py-6 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200"
              >
                <BookOpen size={40} className="text-orange-600" weight="fill" />
                <span className="text-lg font-bold">Arabic</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="h-auto flex flex-col gap-2 py-6 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200"
              >
                <Code size={40} className="text-blue-600" weight="fill" />
                <span className="text-lg font-bold">Coding</span>
              </Button>
            </div>
          </Card>
        )}

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
