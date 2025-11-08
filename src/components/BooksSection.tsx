import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Book, BookPage, ExportFormat } from '@/lib/types'
import { MyBooksScreen } from '@/components/books/MyBooksScreen'
import { CreateBookDialog } from '@/components/books/CreateBookDialog'
import { BookOverview } from '@/components/books/BookOverview'
import { PageEditor } from '@/components/books/PageEditor'
import { ReadingView } from '@/components/books/ReadingView'
import { toast } from 'sonner'

type BooksView = 'list' | 'overview' | 'editor' | 'reading'

interface BooksSectionProps {
  onBack: () => void
}

export function BooksSection({ onBack }: BooksSectionProps) {
  const [books, setBooks] = useKV<Book[]>('user-books', [])
  const [currentView, setCurrentView] = useState<BooksView>('list')
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const selectedBook = books?.find(book => book.id === selectedBookId)

  const handleCreateBook = (data: {
    title: string
    author: string
    description: string
    genre: string
    coverImage?: string
  }) => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: data.title,
      author: data.author,
      description: data.description,
      genre: data.genre,
      coverImage: data.coverImage,
      status: 'draft',
      pages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalPages: 0,
      completionPercentage: 0
    }

    setBooks(currentBooks => [...(currentBooks || []), newBook])
    setShowCreateDialog(false)
    toast.success('Book created!', {
      description: `${data.title} has been added to your library`
    })
  }

  const handleViewBook = (bookId: string) => {
    setSelectedBookId(bookId)
    setCurrentView('overview')
  }

  const handleEditBook = (bookId: string) => {
    setSelectedBookId(bookId)
    setCurrentView('editor')
  }

  const handleStartReading = () => {
    setCurrentView('reading')
  }

  const handleSavePage = (pageId: string, content: string) => {
    if (!selectedBook) return

    setBooks(currentBooks => {
      if (!currentBooks) return []

      return currentBooks.map(book => {
        if (book.id === selectedBookId) {
          const updatedPages = book.pages.map(page =>
            page.id === pageId
              ? { ...page, content, lastEdited: Date.now() }
              : page
          )

          const filledPages = updatedPages.filter(p => p.content.trim().length > 0).length
          const completionPercentage = book.totalPages > 0
            ? Math.round((filledPages / book.totalPages) * 100)
            : 0

          return {
            ...book,
            pages: updatedPages,
            updatedAt: Date.now(),
            completionPercentage
          }
        }
        return book
      })
    })
  }

  const handleAddPage = () => {
    if (!selectedBook) return

    const newPage: BookPage = {
      id: `page-${Date.now()}`,
      pageNumber: selectedBook.pages.length + 1,
      content: '',
      lastEdited: Date.now()
    }

    setBooks(currentBooks => {
      if (!currentBooks) return []

      return currentBooks.map(book => {
        if (book.id === selectedBookId) {
          return {
            ...book,
            pages: [...book.pages, newPage],
            totalPages: book.pages.length + 1,
            updatedAt: Date.now()
          }
        }
        return book
      })
    })

    toast.success('New page added!', {
      description: `Page ${newPage.pageNumber} is ready for writing`
    })
  }

  const handleExport = (format: ExportFormat) => {
    if (!selectedBook) return

    console.log(`Exporting ${selectedBook.title} as ${format}`)
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedBookId(null)
  }

  const handleBackToOverview = () => {
    setCurrentView('overview')
  }

  if (currentView === 'reading' && selectedBook) {
    return <ReadingView book={selectedBook} onBack={handleBackToOverview} />
  }

  if (currentView === 'editor' && selectedBook) {
    return (
      <PageEditor
        book={selectedBook}
        onBack={handleBackToOverview}
        onSavePage={handleSavePage}
        onAddPage={handleAddPage}
      />
    )
  }

  if (currentView === 'overview' && selectedBook) {
    return (
      <BookOverview
        book={selectedBook}
        onBack={handleBackToList}
        onStartReading={handleStartReading}
        onEdit={() => setCurrentView('editor')}
        onExport={handleExport}
      />
    )
  }

  return (
    <>
      <MyBooksScreen
        books={books || []}
        onBack={onBack}
        onCreate={() => setShowCreateDialog(true)}
        onViewBook={handleViewBook}
        onEditBook={handleEditBook}
      />
      <CreateBookDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleCreateBook}
      />
    </>
  )
}
