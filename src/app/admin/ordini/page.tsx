// src/app/admin/ordini/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye } from 'lucide-react'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { OrderFilters } from '@/components/admin/OrderFilters'
import { OrderBulkActions } from '@/components/admin/OrderBulkActions'

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

interface SearchParams {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

async function getOrders(filters: SearchParams) {
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      user:profiles(email, full_name)
    `)

  // Apply filters
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.dateFrom) {
    query = query.gte('created_at', new Date(filters.dateFrom).toISOString())
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    query = query.lte('created_at', dateTo.toISOString())
  }

  // Search by order number or email
  if (filters.search) {
    query = query.or(`order_number.ilike.%${filters.search}%`)
  }

  query = query.order('created_at', { ascending: false })

  const { data: orders } = await query

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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = await searchParams
  const [orders, stats] = await Promise.all([
    getOrders(filters),
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <OrderFilters />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tutti gli Ordini ({orders.length})</CardTitle>
            <OrderBulkActions />
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessun ordine trovato
            </div>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
