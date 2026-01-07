// src/components/admin/OrderActionsMenu.tsx
'use client'

import { useState } from 'react'
import { OrderStatus } from '@/types/order'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Mail, XCircle, DollarSign, Truck, CheckCircle } from 'lucide-react'
import { ShipOrderModal } from './ShipOrderModal'
import { CancelOrderModal } from './CancelOrderModal'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrderActionsMenuProps {
  orderId: string
  orderNumber: string
  currentStatus: OrderStatus
  orderTotal: number
  hasPayment: boolean
}

export function OrderActionsMenu({
  orderId,
  orderNumber,
  currentStatus,
  orderTotal,
  hasPayment
}: OrderActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const router = useRouter()

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      let endpoint = ''
      let method = 'POST'
      let body = {}

      switch (action) {
        case 'resend-confirmation':
          // TODO: Implement resend confirmation email endpoint
          toast.info('Funzionalità in arrivo', {
            description: 'L\'invio delle email sarà disponibile a breve'
          })
          setIsLoading(false)
          return

        case 'cancel':
          // Open cancel modal instead of direct status change
          setShowCancelModal(true)
          setIsLoading(false)
          return

        case 'mark-delivered':
          endpoint = `/api/admin/orders/${orderId}/status`
          method = 'PATCH'
          body = { status: 'delivered' }
          break

        case 'refund':
          // Call refund API directly (full refund)
          endpoint = `/api/admin/orders/${orderId}/refund`
          method = 'POST'
          body = {
            reason: 'Richiesta manuale da admin',
            notifyCustomer: true
          }
          break

        default:
          setIsLoading(false)
          return
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'operazione')
      }

      // Custom success messages based on action
      if (action === 'refund') {
        toast.success('Rimborso elaborato', {
          description: 'Il cliente riceverà il rimborso entro 5-10 giorni lavorativi',
        })
      } else {
        toast.success('Operazione completata', {
          description: 'L\'azione è stata eseguita con successo',
        })
      }

      router.refresh()
    } catch (error) {
      console.error('Error performing action:', error)
      toast.error('Errore', {
        description: error instanceof Error ? error.message : 'Impossibile completare l\'operazione',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canShip = currentStatus === 'processing' || currentStatus === 'paid'
  const canCancel = ['pending', 'paid', 'processing'].includes(currentStatus)
  const canMarkDelivered = currentStatus === 'shipped'
  const canRefund = ['paid', 'processing', 'shipped', 'delivered'].includes(currentStatus)

  return (
    <div className="flex items-center gap-2">
      {/* Ship order button - only show if order can be shipped */}
      {canShip && (
        <ShipOrderModal
          orderId={orderId}
          orderNumber={orderNumber}
          onShipped={() => router.refresh()}
        />
      )}

      {/* Other actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isLoading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Azioni ordine</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canMarkDelivered && (
            <DropdownMenuItem onClick={() => handleAction('mark-delivered')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Segna come consegnato
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => handleAction('resend-confirmation')}>
            <Mail className="mr-2 h-4 w-4" />
            Reinvia email conferma
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {canCancel && (
            <DropdownMenuItem
              onClick={() => setShowCancelModal(true)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annulla ordine
            </DropdownMenuItem>
          )}

          {canRefund && hasPayment && (
            <DropdownMenuItem onClick={() => handleAction('refund')}>
              <DollarSign className="mr-2 h-4 w-4" />
              Rimborsa ordine
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          orderId={orderId}
          orderNumber={orderNumber}
          currentStatus={currentStatus}
          orderTotal={orderTotal}
          hasPayment={hasPayment}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  )
}
