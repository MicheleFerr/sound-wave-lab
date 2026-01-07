// src/components/admin/OrderBulkActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, Download, RefreshCw } from 'lucide-react'
import { OrderStatus } from '@/types/order'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'In attesa di pagamento' },
  { value: 'paid', label: 'Pagato' },
  { value: 'processing', label: 'In lavorazione' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
  { value: 'refunded', label: 'Rimborsato' },
]

export function OrderBulkActions() {
  const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>('processing')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleExportOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/orders/export')

      if (!response.ok) {
        throw new Error('Errore durante l\'export')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ordini-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Export completato', {
        description: 'Il file CSV è stato scaricato',
      })
    } catch (error) {
      console.error('Error exporting orders:', error)
      toast.error('Errore durante l\'export degli ordini')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusChange = async () => {
    // This would require selecting orders in the table
    // For now, show a message that this feature requires order selection
    toast.info('Funzionalità in arrivo', {
      description: 'Seleziona gli ordini dalla tabella per cambiare lo status in massa',
    })
    setShowBulkStatusDialog(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            Azioni
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Azioni in massa</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowBulkStatusDialog(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Cambia status multipli
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleExportOrders}>
            <Download className="mr-2 h-4 w-4" />
            Esporta tutti gli ordini (CSV)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bulk Status Change Dialog */}
      <Dialog open={showBulkStatusDialog} onOpenChange={setShowBulkStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambia Status in Massa</DialogTitle>
            <DialogDescription>
              Seleziona il nuovo status da applicare agli ordini selezionati
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nuovo Status</label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Questa azione modificherà lo status di tutti gli ordini selezionati.
              Funzionalità completa disponibile a breve.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBulkStatusDialog(false)}
            >
              Annulla
            </Button>
            <Button onClick={handleBulkStatusChange}>
              Applica Modifiche
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
