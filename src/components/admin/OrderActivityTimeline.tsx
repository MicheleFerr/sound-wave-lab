// src/components/admin/OrderActivityTimeline.tsx
'use client'

import { useEffect, useState } from 'react'
import { OrderActivity, OrderActivityType } from '@/types/order'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  CreditCard,
  XCircle,
  Truck,
  Mail,
  MessageSquare,
  Edit,
  RefreshCcw,
} from 'lucide-react'
import { toast } from 'sonner'

interface OrderActivityTimelineProps {
  orderId: string
}

const activityIcons: Record<OrderActivityType, React.ReactNode> = {
  status_change: <RefreshCcw className="h-4 w-4" />,
  refund: <CreditCard className="h-4 w-4" />,
  cancellation: <XCircle className="h-4 w-4" />,
  shipment: <Truck className="h-4 w-4" />,
  email_sent: <Mail className="h-4 w-4" />,
  note_added: <MessageSquare className="h-4 w-4" />,
  order_edited: <Edit className="h-4 w-4" />,
  payment_captured: <CreditCard className="h-4 w-4" />,
}

const activityLabels: Record<OrderActivityType, string> = {
  status_change: 'Cambio status',
  refund: 'Rimborso',
  cancellation: 'Annullamento',
  shipment: 'Spedizione',
  email_sent: 'Email inviata',
  note_added: 'Nota aggiunta',
  order_edited: 'Ordine modificato',
  payment_captured: 'Pagamento acquisito',
}

export function OrderActivityTimeline({ orderId }: OrderActivityTimelineProps) {
  const [activities, setActivities] = useState<OrderActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [orderId])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/activity`)
      const data = await response.json()

      if (response.ok) {
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Errore durante il caricamento della cronologia')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityDescription = (activity: OrderActivity): string => {
    switch (activity.action_type) {
      case 'status_change':
        return `Status cambiato da "${activity.previous_value?.status}" a "${activity.new_value?.status}"`
      case 'shipment':
        return `Ordine spedito con tracking ${activity.new_value?.tracking_number || 'N/A'}`
      case 'note_added':
        return `Nota ${activity.new_value?.note_type} aggiunta`
      case 'cancellation':
        return 'Ordine annullato'
      case 'refund':
        return `Rimborso di ${activity.new_value?.amount || 'importo non specificato'}`
      case 'email_sent':
        return `Email "${activity.metadata?.subject || 'notifica'}" inviata`
      case 'order_edited':
        return 'Dettagli ordine modificati'
      case 'payment_captured':
        return 'Pagamento acquisito'
      default:
        return 'Attività non specificata'
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Caricamento cronologia...</div>
  }

  if (activities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Nessuna attività registrata
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {activityIcons[activity.action_type]}
            </div>
            {index < activities.length - 1 && (
              <div className="h-full w-0.5 bg-border" />
            )}
          </div>

          {/* Activity content */}
          <div className="flex-1 space-y-1 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {activityLabels[activity.action_type]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(activity.created_at)}
              </span>
            </div>
            <p className="text-sm">{getActivityDescription(activity)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
