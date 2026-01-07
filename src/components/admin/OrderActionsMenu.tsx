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
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrderActionsMenuProps {
  orderId: string
  orderNumber: string
  currentStatus: OrderStatus
}

export function OrderActionsMenu({ orderId, orderNumber, currentStatus }: OrderActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
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
          endpoint = `/api/admin/orders/${orderId}/status`
          method = 'PATCH'
          body = { status: 'cancelled' }
          break

        case 'mark-delivered':
          endpoint = `/api/admin/orders/${orderId}/status`
          method = 'PATCH'
          body = { status: 'delivered' }
          break

        case 'refund':
          // TODO: Implement refund functionality
          toast.info('Funzionalità in arrivo', {
            description: 'La gestione rimborsi sarà disponibile a breve'
          })
          setIsLoading(false)
          return

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

      toast.success('Operazione completata', {
        description: 'L\'azione è stata eseguita con successo',
      })
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
              onClick={() => handleAction('cancel')}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annulla ordine
            </DropdownMenuItem>
          )}

          {canRefund && (
            <DropdownMenuItem onClick={() => handleAction('refund')}>
              <DollarSign className="mr-2 h-4 w-4" />
              Rimborsa ordine
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
