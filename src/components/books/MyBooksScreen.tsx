import { useState } from 'react'
import { Book } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { MagnifyingGlass, Plus, ArrowLeft, BookOpen, PencilSimple, Trash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface MyBooksScreenProps {
  books: Book[]
  onBack: () => void
  onCreate: () => void
  onViewBook: (bookId: string) => void
  onEditBook: (bookId: string) => void
  onDeleteBook: (bookId: string) => void
}

export function MyBooksScreen({ books, onBack, onCreate, onViewBook, onEditBook, onDeleteBook }: MyBooksScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">My Books</h1>
      </header>

      <div className="p-4 space-y-4 flex-1">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {filteredBooks.length === 0 && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your Next Story Awaits</h2>
            <p className="text-muted-foreground mb-6">Start creating your first book and bring your imagination to life!</p>
            <Button onClick={onCreate} size="lg" className="rounded-xl">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Book
            </Button>
          </motion.div>
        )}

        {filteredBooks.length === 0 && books.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching "{searchQuery}"</p>
          </div>
        )}

        <div className="space-y-4 pb-24">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 flex gap-4 hover:shadow-lg transition-shadow">
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {book.genre || 'Uncategorized'} • {book.status === 'published' ? 'Published' : 'Draft'}
                    </p>
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{book.completionPercentage}% Complete</span>
                      <span>{book.pages.length} pages</span>
                    </div>
                    <Progress value={book.completionPercentage} className="h-1.5" />
                  </div>

                  <div className="flex gap-2">
                    {book.status === 'draft' && (
                      <Button
                        onClick={() => onEditBook(book.id)}
                        className="flex-1 rounded-lg"
                        size="sm"
                      >
                        <PencilSimple className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    )}
                    <Button
                      onClick={() => onViewBook(book.id)}
                      variant={book.status === 'draft' ? 'outline' : 'default'}
                      className="flex-1 rounded-lg"
                      size="sm"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {book.status === 'published' ? 'Read' : 'Details'}
                    </Button>
                    <Button
                      onClick={() => onDeleteBook(book.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {book.coverImage ? (
                  <div
                    className="w-24 aspect-[2/3] rounded-lg bg-cover bg-center flex-shrink-0 shadow-md"
                    style={{ backgroundImage: `url(${book.coverImage})` }}
                  />
                ) : (
                  <div className="w-24 aspect-[2/3] rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                    <BookOpen className="h-10 w-10 text-primary/50" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button
          onClick={onCreate}
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl"
        >
          <Plus className="h-7 w-7" />
        </Button>
      </div>
    </div>
  )
}
