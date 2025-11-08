import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageSquare, X, Upload, Link } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CreateBookDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: {
    title: string
    author: string
    description: string
    genre: string
    coverImage?: string
  }) => void
}

export function CreateBookDialog({ open, onClose, onSave }: CreateBookDialogProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCoverImage(result)
    }
    reader.onerror = () => {
      toast.error('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setCoverImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a book title')
      return
    }
    if (!author.trim()) {
      toast.error('Please enter an author name')
      return
    }

    onSave({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre: genre.trim(),
      coverImage: coverImage.trim() || undefined
    })

    setTitle('')
    setAuthor('')
    setDescription('')
    setGenre('')
    setCoverImage('')
  }

  const handleClose = () => {
    setTitle('')
    setAuthor('')
    setDescription('')
    setGenre('')
    setCoverImage('')
    setUploadMethod('upload')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Book</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'upload' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('upload')}
                className="flex-1 rounded-lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="flex-1 rounded-lg"
              >
                <Link className="h-4 w-4 mr-2" />
                Use URL
              </Button>
            </div>

            {coverImage ? (
              <div className="relative rounded-xl border-2 border-border overflow-hidden">
                <img
                  src={coverImage}
                  alt="Book cover preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border px-6 py-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageSquare className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-1">Add Cover Image</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadMethod === 'upload'
                      ? 'Upload an image from your device'
                      : 'Enter an image URL for your book cover'}
                  </p>
                </div>

                {uploadMethod === 'upload' ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                ) : (
                  <Input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="max-w-xs"
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                placeholder="e.g., The Midnight Garden"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                placeholder="e.g., Jane Doe"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre (Optional)</Label>
              <Input
                id="genre"
                placeholder="e.g., Fantasy, Mystery, Science Fiction"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Book Description</Label>
              <Textarea
                id="description"
                placeholder="A brief summary of your book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose} className="rounded-lg">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="rounded-lg">
            Create Book
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
