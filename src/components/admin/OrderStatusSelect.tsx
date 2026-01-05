// src/components/admin/OrderStatusSelect.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'pending', label: 'In attesa' },
  { value: 'paid', label: 'Pagato' },
  { value: 'processing', label: 'In lavorazione' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
  { value: 'refunded', label: 'Rimborsato' },
]

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    setStatus(newStatus)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error updating order status:', error)
      setStatus(currentStatus) // Revert on error
      alert('Errore durante l\'aggiornamento dello stato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[150px]">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
