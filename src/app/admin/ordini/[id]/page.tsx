// src/app/admin/ordini/[id]/page.tsx
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, MapPin, CreditCard, Truck, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dettaglio ordine | Admin',
  description: 'Visualizza i dettagli dell\'ordine',
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

interface ShippingAddress {
  street: string
  city: string
  province: string
  postal_code: string
  country: string
  email?: string
  fullName?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total: number
  created_at: string
  updated_at: string
  tracking_number: string | null
  carrier: string | null
  tracking_url: string | null
  shipping_address: ShippingAddress
  notes: string | null
  order_items: OrderItem[]
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'In attesa di pagamento', variant: 'secondary' },
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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get order - admin can see all orders
  const { data: order } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      subtotal,
      shipping_cost,
      tax_amount,
      discount_amount,
      total,
      created_at,
      updated_at,
      tracking_number,
      carrier,
      tracking_url,
      shipping_address,
      notes,
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
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  const typedOrder = order as unknown as Order
  const status = statusLabels[typedOrder.status] || { label: typedOrder.status, variant: 'secondary' as const }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/ordini">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna agli ordini
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Ordine #{typedOrder.order_number}</h1>
          <p className="text-muted-foreground">
            Effettuato il {formatDate(typedOrder.created_at)}
          </p>
        </div>
        <Badge variant={status.variant} className="text-sm">
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Prodotti ordinati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typedOrder.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <div className="text-sm text-muted-foreground">
                        <span>SKU: {item.variant_sku}</span>
                        {item.variant_attributes?.size && (
                          <span className="ml-3">Taglia: {item.variant_attributes.size}</span>
                        )}
                        {item.variant_attributes?.color && (
                          <span className="ml-3">Colore: {item.variant_attributes.color}</span>
                        )}
                      </div>
                      <p className="text-sm mt-1">
                        {formatPrice(item.unit_price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.total_price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {typedOrder.tracking_number && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Tracciamento spedizione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground">Corriere:</span>{' '}
                    <span className="font-medium">{typedOrder.carrier || 'Non specificato'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Numero tracking:</span>{' '}
                    <span className="font-mono font-medium">{typedOrder.tracking_number}</span>
                  </div>

                  {/* Tracking Link Button */}
                  {typedOrder.tracking_url && (
                    <Button asChild className="w-full mt-2">
                      <a
                        href={typedOrder.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apri tracciamento
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Riepilogo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotale</span>
                  <span>{formatPrice(typedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spedizione</span>
                  <span>{typedOrder.shipping_cost === 0 ? 'Gratis' : formatPrice(typedOrder.shipping_cost)}</span>
                </div>
                {typedOrder.tax_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasse</span>
                    <span>{formatPrice(typedOrder.tax_amount)}</span>
                  </div>
                )}
                {typedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Sconto</span>
                    <span>-{formatPrice(typedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Totale</span>
                    <span>{formatPrice(typedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Indirizzo di spedizione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm space-y-1">
                {typedOrder.shipping_address.fullName && (
                  <p className="font-medium">{typedOrder.shipping_address.fullName}</p>
                )}
                <p>{typedOrder.shipping_address.street}</p>
                <p>
                  {typedOrder.shipping_address.postal_code} {typedOrder.shipping_address.city} ({typedOrder.shipping_address.province})
                </p>
                <p>{typedOrder.shipping_address.country}</p>
                {typedOrder.shipping_address.email && (
                  <p className="mt-2 text-muted-foreground">{typedOrder.shipping_address.email}</p>
                )}
              </address>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
