// src/components/admin/CancelOrderModal.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { OrderStatus } from '@/types/order'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CancelOrderModalProps {
  orderId: string
  orderNumber: string
  currentStatus: OrderStatus
  orderTotal: number
  hasPayment: boolean
  onClose: () => void
}

export function CancelOrderModal({
  orderId,
  orderNumber,
  currentStatus,
  orderTotal,
  hasPayment,
  onClose,
}: CancelOrderModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [reason, setReason] = useState('')
  const [autoRefund, setAutoRefund] = useState(hasPayment)
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const canRefund = ['paid', 'processing', 'shipped', 'delivered'].includes(currentStatus)

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 200)
  }

  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast.error('Inserisci il motivo della cancellazione')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Cancel order (change status to cancelled)
      const cancelResponse = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })

      if (!cancelResponse.ok) {
        const data = await cancelResponse.json()
        throw new Error(data.error || 'Errore durante la cancellazione')
      }

      // Step 2: Add cancellation note
      await fetch(`/api/admin/orders/${orderId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Ordine annullato.\n\nMotivo: ${reason}`,
          noteType: notifyCustomer ? 'customer' : 'internal',
          notifyCustomer: notifyCustomer,
        }),
      })

      // Step 3: Process refund if requested and payment exists
      if (autoRefund && hasPayment && canRefund) {
        const refundResponse = await fetch(`/api/admin/orders/${orderId}/refund`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: reason,
            notifyCustomer: notifyCustomer,
          }),
        })

        if (!refundResponse.ok) {
          const data = await refundResponse.json()
          toast.warning('Ordine annullato ma errore nel rimborso', {
            description: data.error || 'Potrebbe essere necessario rimborsare manualmente',
          })
        } else {
          toast.success('Ordine annullato e rimborsato', {
            description: `${notifyCustomer ? 'Email inviata al cliente' : 'Cliente non notificato'}`,
          })
        }
      } else {
        toast.success('Ordine annullato', {
          description: autoRefund
            ? 'Nota: ordine non ha pagamenti da rimborsare'
            : notifyCustomer
            ? 'Email di cancellazione inviata'
            : 'Cliente non notificato',
        })
      }

      handleClose()
      router.refresh()
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Errore', {
        description: error instanceof Error ? error.message : 'Impossibile annullare l\'ordine',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Annulla Ordine #{orderNumber}
          </DialogTitle>
          <DialogDescription>
            Questa azione annullerà l'ordine e{' '}
            {hasPayment && canRefund
              ? 'procederà automaticamente al rimborso'
              : 'non potrà essere annullata'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning if order has payment */}
          {hasPayment && canRefund && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Ordine già pagato
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    L'ordine ha un pagamento di <strong>€{orderTotal.toFixed(2)}</strong>.
                    Per legge (Direttiva EU), devi rimborsare il cliente entro 14 giorni.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo cancellazione *
            </Label>
            <Textarea
              id="reason"
              placeholder="Es: Prodotto non disponibile, richiesta cliente, errore ordine..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Questo motivo sarà salvato nel log attività
              {notifyCustomer && ' e inviato al cliente via email'}
            </p>
          </div>

          {/* Auto-refund checkbox */}
          {hasPayment && canRefund && (
            <div className="flex items-start space-x-2 bg-muted p-3 rounded-lg">
              <Checkbox
                id="autoRefund"
                checked={autoRefund}
                onCheckedChange={(checked) => setAutoRefund(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="autoRefund"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Rimborsa automaticamente €{orderTotal.toFixed(2)}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Il rimborso verrà elaborato immediatamente tramite Stripe e accreditato
                  sul metodo di pagamento originale entro 5-10 giorni lavorativi.
                </p>
              </div>
            </div>
          )}

          {/* Notify customer checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="notifyCustomer"
              checked={notifyCustomer}
              onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="notifyCustomer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Invia email di notifica al cliente
              </Label>
              <p className="text-xs text-muted-foreground">
                Il cliente riceverà un'email con il motivo della cancellazione
                {autoRefund && hasPayment && ' e i dettagli del rimborso'}
              </p>
            </div>
          </div>

          {/* EU Rights Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>ℹ️ Diritti EU:</strong> I consumatori hanno diritto di annullare
              un ordine entro 14 giorni dalla ricezione senza fornire motivazione.
              Il rimborso deve essere elaborato entro 14 giorni dalla cancellazione.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Elaborazione...' : 'Conferma Cancellazione'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
