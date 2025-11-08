import { useState, useEffect } from 'react'
import { Book, BookPage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CaretLeft, CaretRight, BookOpen, DotsThreeVertical, CloudCheck, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface PageEditorProps {
  book: Book
  onBack: () => void
  onSavePage: (pageId: string, content: string) => void
  onAddPage: () => void
}

export function PageEditor({ book, onBack, onSavePage, onAddPage }: PageEditorProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const currentPage = book.pages[currentPageIndex]

  useEffect(() => {
    if (currentPage) {
      setContent(currentPage.content)
      setHasUnsavedChanges(false)
    }
  }, [currentPageIndex, currentPage])

  const handleSave = async () => {
    if (!currentPage) return
    
    setIsSaving(true)
    onSavePage(currentPage.id, content)
    
    setTimeout(() => {
      setIsSaving(false)
      setHasUnsavedChanges(false)
      toast.success('Page saved!', {
        description: `Page ${currentPage.pageNumber} has been saved`
      })
    }, 500)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    } else {
      onAddPage()
      setCurrentPageIndex(book.pages.length)
    }
  }

  const handleAddNewPage = () => {
    onAddPage()
    setCurrentPageIndex(book.pages.length)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-bold flex-1 text-center truncate px-4">
          {book.title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <DotsThreeVertical className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full p-4"
          >
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your story here..."
              className="w-full h-full resize-none border-none focus-visible:ring-0 text-base leading-relaxed"
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border pt-2 pb-4">
        <div className="grid grid-cols-4 gap-2 px-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              size="icon"
              className="h-12 w-12 rounded-full"
              variant="outline"
            >
              <CaretLeft className="h-5 w-5" />
            </Button>
            <p className="text-sm font-medium text-muted-foreground">Previous</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Page {currentPage?.pageNumber || 0}/{book.totalPages}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={goToNextPage}
              size="icon"
              className="h-12 w-12 rounded-full"
              variant="outline"
            >
              <CaretRight className="h-5 w-5" />
            </Button>
            <p className="text-sm font-medium text-muted-foreground">Next</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              size="icon"
              className="h-12 w-12 rounded-full"
              variant={hasUnsavedChanges ? 'default' : 'outline'}
            >
              {isSaving ? (
                <CloudCheck className="h-5 w-5" />
              ) : hasUnsavedChanges ? (
                <FloppyDisk className="h-5 w-5" />
              ) : (
                <CloudCheck className="h-5 w-5" />
              )}
            </Button>
            <p className={`text-sm font-medium ${hasUnsavedChanges ? 'text-primary' : 'text-muted-foreground'}`}>
              {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
            </p>
          </div>
        </div>

        {book.pages.length === 0 && (
          <div className="px-4 pt-4">
            <Button
              onClick={handleAddNewPage}
              variant="outline"
              className="w-full rounded-lg"
            >
              Add First Page
            </Button>
          </div>
        )}
      </footer>
    </div>
  )
}
