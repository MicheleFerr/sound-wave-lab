// src/components/admin/CategoryList.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
}

interface CategoryListProps {
  categories: Category[]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category?: Category
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')
  const [imageUrl, setImageUrl] = useState(category?.image_url || '')
  const [sortOrder, setSortOrder] = useState(category?.sort_order || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!category) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (category) {
        // Update
        const { error: updateError } = await supabase
          .from('categories')
          .update({
            name,
            slug,
            description: description || null,
            image_url: imageUrl || null,
            sort_order: sortOrder,
          })
          .eq('id', category.id)

        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('categories')
          .insert({
            name,
            slug,
            description: description || null,
            image_url: imageUrl || null,
            sort_order: sortOrder,
          })

        if (insertError) throw insertError
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Error saving category:', err)
      setError('Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Categoria *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Es: T-Shirt"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug URL</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="t-shirt"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione della categoria..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL Immagine</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Ordine</Label>
        <Input
          id="sortOrder"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
        />
        <p className="text-xs text-muted-foreground">
          Numero più basso = appare prima
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annulla
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-brand-gradient bg-brand-gradient-hover"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvataggio...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {category ? 'Aggiorna' : 'Crea'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const handleSave = () => {
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return

    setDeleteLoading(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCategories(categories.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Errore durante l\'eliminazione')
    } finally {
      setDeleteLoading(null)
    }
  }

  const openNewDialog = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNewDialog}
              className="bg-brand-gradient bg-brand-gradient-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory || undefined}
              onClose={() => setIsDialogOpen(false)}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead>Ordine</TableHead>
            <TableHead className="w-[100px]">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {category.description || '-'}
              </TableCell>
              <TableCell>{category.sort_order}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteLoading === category.id}
                  >
                    {deleteLoading === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nessuna categoria trovata
        </div>
      )}
    </div>
  )
}
