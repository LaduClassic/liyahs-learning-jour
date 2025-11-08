import { useState, useEffect } from 'react'
import { Book, BookPage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CaretLeft, CaretRight, BookOpen, DotsThreeVertical, CloudCheck, FloppyDisk, Plus } from '@phosphor-icons/react'
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
    } else {
      setContent('')
      setHasUnsavedChanges(false)
    }
  }, [currentPageIndex, currentPage?.id])

  const handleSave = async () => {
    if (!currentPage) {
      toast.error('No page to save')
      return
    }
    
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
    if (hasUnsavedChanges) {
      handleSave()
    }
    
    if (currentPageIndex < book.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    } else {
      onAddPage()
      setTimeout(() => {
        setCurrentPageIndex(book.pages.length)
      }, 100)
    }
  }

  const handleAddNewPage = () => {
    onAddPage()
    setTimeout(() => {
      setCurrentPageIndex(book.pages.length)
    }, 100)
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
        {book.pages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-bold mb-2">No Pages Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first page to start writing your story</p>
                <Button onClick={handleAddNewPage} className="rounded-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Page
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </main>

      <footer className="border-t border-border pt-2 pb-4">
        {book.pages.length > 0 ? (
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
                disabled={!hasUnsavedChanges || isSaving || !currentPage}
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
        ) : null}
      </footer>
    </div>
  )
}
