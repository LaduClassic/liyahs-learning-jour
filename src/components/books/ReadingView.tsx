import { useState, useEffect } from 'react'
import { Book } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Gear } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReadingViewProps {
  book: Book
  onBack: () => void
}

export function ReadingView({ book, onBack }: ReadingViewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showUI, setShowUI] = useState(true)

  const currentPage = book.pages[currentPageIndex]
  const progress = book.pages.length > 0 ? ((currentPageIndex + 1) / book.pages.length) * 100 : 0

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showUI) {
      timeout = setTimeout(() => {
        setShowUI(false)
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [showUI, currentPageIndex])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width * 0.25) {
      goToPreviousPage()
    } else if (x > width * 0.75) {
      goToNextPage()
    } else {
      setShowUI(!showUI)
    }
  }

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
      setShowUI(true)
    }
  }

  const goToNextPage = () => {
    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
      setShowUI(true)
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      goToNextPage()
    } else {
      goToPreviousPage()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {showUI && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="ml-2 flex-1 text-center">
                <h1 className="font-semibold leading-tight tracking-tight">{book.title}</h1>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <Gear className="h-6 w-6" />
              </Button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <main
        className="flex-1 px-6 pt-28 pb-32 overflow-y-auto cursor-pointer"
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                handleSwipe('right')
              } else if (info.offset.x < -100) {
                handleSwipe('left')
              }
            }}
            className="space-y-6"
          >
            {currentPage ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {currentPage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">This page is empty</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="absolute inset-y-0 left-0 w-1/4" aria-label="Previous page" />
      <div className="absolute inset-y-0 right-0 w-1/4" aria-label="Next page" />
   //
   

      <AnimatePresence>
        {showUI && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Page {currentPageIndex + 1} of {book.pages.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {book.pages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-xl font-semibold mb-2">No pages yet</p>
            <p className="text-muted-foreground">Start writing to add content to your book</p>
          </div>
        </div>
      )}
    </div>
  )
}
