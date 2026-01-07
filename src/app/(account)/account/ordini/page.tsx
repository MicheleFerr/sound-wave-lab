// src/app/(account)/account/ordini/page.tsx
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'I miei ordini | Sound Wave Lab',
  description: 'Visualizza lo storico dei tuoi ordini',
}

interface OrderItem {
  id: string
  product_name: string
  variant_sku: string
  variant_attributes: {
    size?: string
    color?: string
  }
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  tracking_number: string | null
  carrier: string | null
  tracking_url: string | null
  order_items: OrderItem[]
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
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get orders by user_id
  const { data: userOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      tracking_number,
      carrier,
      tracking_url,
      order_items (
        id,
        product_name,
        variant_sku,
        variant_attributes,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Also get guest orders with matching email (not yet associated)
  const { data: guestOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total,
      created_at,
      tracking_number,
      carrier,
      tracking_url,
      shipping_address,
      order_items (
        id,
        product_name,
        variant_sku,
        variant_attributes,
        quantity,
        unit_price,
        total_price
      )
    `)
    .is('user_id', null)
    .order('created_at', { ascending: false })

  // Filter guest orders by email and merge with user orders
  const guestOrdersForUser = (guestOrders || []).filter(order => {
    const shippingEmail = (order.shipping_address as { email?: string })?.email
    return shippingEmail?.toLowerCase() === user.email?.toLowerCase()
  })

  // Merge and deduplicate by order_number
  const allOrders = [...(userOrders || []), ...guestOrdersForUser]
  const uniqueOrders = allOrders.filter((order, index, self) =>
    index === self.findIndex(o => o.order_number === order.order_number)
  )
  const typedOrders = uniqueOrders as Order[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">I miei ordini</h1>
        <p className="text-muted-foreground">
          Visualizza lo storico dei tuoi ordini
        </p>
      </div>

      {typedOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun ordine</h3>
            <p className="text-muted-foreground text-center mb-6">
              Non hai ancora effettuato nessun ordine.
            </p>
            <Button asChild>
              <Link href="/products">
                Inizia a fare shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {typedOrders.map((order) => {
            const status = statusLabels[order.status] || { label: order.status, variant: 'secondary' as const }

            return (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-base">
                          Ordine #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-medium">{item.product_name}</span>
                          {item.variant_attributes && (
                            <span className="text-muted-foreground ml-2">
                              {item.variant_attributes.size && `Taglia: ${item.variant_attributes.size}`}
                              {item.variant_attributes.size && item.variant_attributes.color && ' - '}
                              {item.variant_attributes.color && `Colore: ${item.variant_attributes.color}`}
                            </span>
                          )}
                          <span className="text-muted-foreground ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span>{formatPrice(item.total_price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {order.tracking_number && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tracking:</span>{' '}
                        {order.tracking_url ? (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono underline hover:text-brand-teal inline-flex items-center gap-1"
                          >
                            {order.tracking_number}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="font-mono">{order.tracking_number}</span>
                        )}
                        {order.carrier && (
                          <span className="text-muted-foreground"> ({order.carrier})</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="border-t pt-3 mt-3">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href={`/account/ordini/${order.id}`}>
                        Dettagli ordine
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
