// src/components/admin/OrderNotesSection.tsx
'use client'

import { useEffect, useState } from 'react'
import { OrderNote, OrderNoteType } from '@/types/order'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Lock, MessageCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface OrderNotesSectionProps {
  orderId: string
}

export function OrderNotesSection({ orderId }: OrderNotesSectionProps) {
  const [notes, setNotes] = useState<OrderNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [activeTab, setActiveTab] = useState<OrderNoteType>('internal')

  useEffect(() => {
    fetchNotes()
  }, [orderId])

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/notes`)
      const data = await response.json()

      if (response.ok) {
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error('Errore durante il caricamento delle note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Inserisci il contenuto della nota')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNoteContent,
          noteType: activeTab,
          notifyCustomer: activeTab === 'customer',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la creazione della nota')
      }

      toast.success('Nota aggiunta', {
        description: activeTab === 'customer' ? 'Il cliente riceverà una notifica via email' : 'Nota interna salvata',
      })

      setNewNoteContent('')
      fetchNotes()
    } catch (error) {
      console.error('Error adding note:', error)
      toast.error('Errore', {
        description: error instanceof Error ? error.message : 'Impossibile aggiungere la nota',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const internalNotes = notes.filter(n => n.note_type === 'internal')
  const customerNotes = notes.filter(n => n.note_type === 'customer')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Caricamento note...</div>
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderNoteType)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="internal" className="flex items-center gap-2">
          <Lock className="h-3 w-3" />
          Interne ({internalNotes.length})
        </TabsTrigger>
        <TabsTrigger value="customer" className="flex items-center gap-2">
          <MessageCircle className="h-3 w-3" />
          Cliente ({customerNotes.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="internal" className="space-y-4 mt-4">
        {/* Add new internal note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Aggiungi una nota interna (visibile solo agli admin)..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleAddNote}
            disabled={isSubmitting || !newNoteContent.trim()}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi nota interna
          </Button>
        </div>

        {/* Display internal notes */}
        <div className="space-y-3">
          {internalNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna nota interna</p>
          ) : (
            internalNotes.map((note) => (
              <div key={note.id} className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="mr-1 h-3 w-3" />
                    Interno
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="customer" className="space-y-4 mt-4">
        {/* Add new customer note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Aggiungi una nota per il cliente (verrà inviata via email)..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleAddNote}
            disabled={isSubmitting || !newNoteContent.trim()}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi nota cliente
          </Button>
        </div>

        {/* Display customer notes */}
        <div className="space-y-3">
          {customerNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna nota per il cliente</p>
          ) : (
            customerNotes.map((note) => (
              <div key={note.id} className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="default" className="text-xs">
                    <MessageCircle className="mr-1 h-3 w-3" />
                    Cliente
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
