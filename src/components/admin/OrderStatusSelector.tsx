// src/components/admin/OrderStatusSelector.tsx
'use client'

import { useState } from 'react'
import { OrderStatus } from '@/types/order'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrderStatusSelectorProps {
  orderId: string
  currentStatus: OrderStatus
}

const statusOptions: Array<{
  value: OrderStatus
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
}> = [
  { value: 'pending', label: 'In attesa di pagamento', variant: 'secondary' },
  { value: 'paid', label: 'Pagato', variant: 'default' },
  { value: 'processing', label: 'In lavorazione', variant: 'default' },
  { value: 'shipped', label: 'Spedito', variant: 'default' },
  { value: 'delivered', label: 'Consegnato', variant: 'outline' },
  { value: 'cancelled', label: 'Annullato', variant: 'destructive' },
  { value: 'refunded', label: 'Rimborsato', variant: 'destructive' },
]

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const router = useRouter()

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === status) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il cambio di status')
      }

      setStatus(newStatus)
      toast.success('Status aggiornato', {
        description: `L'ordine è stato aggiornato a "${statusOptions.find(s => s.value === newStatus)?.label}"`,
      })
      router.refresh()
    } catch (error) {
      console.error('Error changing status:', error)
      toast.error('Errore', {
        description: error instanceof Error ? error.message : 'Impossibile cambiare lo status',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currentOption = statusOptions.find(s => s.value === status)

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue>
          {currentOption && (
            <Badge variant={currentOption.variant} className="text-sm">
              {currentOption.label}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              <Badge variant={option.variant} className="text-sm">
                {option.label}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
