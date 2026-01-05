// src/app/admin/ordini/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

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

async function getOrders() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      user:profiles(email, full_name)
    `)
    .order('created_at', { ascending: false })

  // Transform the data to handle Supabase's array return for single relations
  return (orders || []).map(order => ({
    ...order,
    user: Array.isArray(order.user) ? order.user[0] : order.user
  })) as Order[]
}

async function getStats() {
  const supabase = await createClient()

  const { count: total } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { count: pending } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: processing } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['paid', 'processing'])

  const { count: shipped } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'shipped')

  return {
    total: total || 0,
    pending: pending || 0,
    processing: processing || 0,
    shipped: shipped || 0,
  }
}

export default async function AdminOrdersPage() {
  const [orders, stats] = await Promise.all([
    getOrders(),
    getStats(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ordini</h1>
        <p className="text-muted-foreground">
          Gestisci gli ordini dei clienti
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totale Ordini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Attesa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Da Spedire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spediti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.shipped}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tutti gli Ordini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordine</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Totale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[80px]">Azioni</TableHead>
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
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/ordini/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nessun ordine trovato
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
