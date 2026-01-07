'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusSelect } from './OrderStatusSelect'
import { ShipOrderModal } from './ShipOrderModal'

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  user: {
    email: string
    full_name: string | null
  } | null
}

interface OrdersTableProps {
  orders: Order[]
  onOrderUpdate?: () => void
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'In attesa', variant: 'secondary' },
  paid: { label: 'Pagato', variant: 'default' },
  processing: { label: 'In lavorazione', variant: 'default' },
  shipped: { label: 'Spedito', variant: 'default' },
  delivered: { label: 'Consegnato', variant: 'outline' },
  cancelled: { label: 'Annullato', variant: 'destructive' },
  refunded: { label: 'Rimborsato', variant: 'destructive' },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function OrdersTable({ orders, onOrderUpdate }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ordine</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Totale</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="w-[200px]">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const status = statusLabels[order.status] || { label: order.status, variant: 'secondary' as const }

          return (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                #{order.order_number}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.user?.full_name || '-'}</p>
                  <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(order.created_at)}
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(order.total)}
              </TableCell>
              <TableCell>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {order.status === 'processing' && (
                    <ShipOrderModal
                      orderId={order.id}
                      orderNumber={order.order_number}
                      onShipped={onOrderUpdate}
                    />
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/ordini/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
