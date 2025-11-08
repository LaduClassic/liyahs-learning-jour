import { Book, ExportFormat } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowLeft, BookOpen, BookmarkSimple, PencilSimple, ShareNetwork, Export, FileText, FilePdf, FileDoc } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface BookOverviewProps {
  book: Book
  onBack: () => void
  onStartReading: () => void
  onEdit: () => void
  onExport: (format: ExportFormat) => void
}

export function BookOverview({ book, onBack, onStartReading, onEdit, onExport }: BookOverviewProps) {
  const handleExport = (format: ExportFormat) => {
    onExport(format)
    toast.success(`Exporting as ${format.toUpperCase()}...`, {
      description: 'Your book will be ready shortly'
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getExportIcon = (format: ExportFormat) => {
    switch (format) {
      case 'pdf':
        return <FilePdf className="h-4 w-4 mr-2" />
      case 'docx':
        return <FileDoc className="h-4 w-4 mr-2" />
      case 'epub':
      case 'txt':
        return <FileText className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <BookmarkSimple className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ShareNetwork className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 space-y-6"
        >
          {book.coverImage ? (
            <div
              className="w-full h-96 rounded-xl bg-cover bg-center shadow-xl"
              style={{ backgroundImage: `url(${book.coverImage})` }}
            />
          ) : (
            <div className="w-full h-96 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center shadow-xl">
              <BookOpen className="h-24 w-24 text-primary/30" />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{book.title}</h1>
            <p className="text-lg font-medium text-foreground/80">By {book.author}</p>
            <p className="text-sm text-muted-foreground">
              {book.genre || 'Uncategorized'} • {book.status === 'published' ? 'Published' : 'In Progress'} • Last updated: {formatDate(book.updatedAt)}
            </p>
          </div>

          {book.description && (
            <Card className="p-6 border-t">
              <p className="text-base leading-relaxed text-foreground/90">{book.description}</p>
            </Card>
          )}

          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{book.pages.length}</p>
                <p className="text-sm text-muted-foreground">Pages</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{book.completionPercentage}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-t">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1 rounded-xl h-12 text-base font-semibold"
            >
              <PencilSimple className="mr-2 h-5 w-5" />
              Edit Manuscript
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl h-12 px-4"
                >
                  <Export className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  {getExportIcon('pdf')}
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('epub')}>
                  {getExportIcon('epub')}
                  Export as ePub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  {getExportIcon('docx')}
                  Export as DOCX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('txt')}>
                  {getExportIcon('txt')}
                  Export as TXT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={onStartReading}
            className="w-full rounded-xl h-12 text-base font-bold"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Start Reading
          </Button>
        </div>
      </footer>
    </div>
  )
}
