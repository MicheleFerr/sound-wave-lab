'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'

interface OrderDetails {
  orderNumber: string
  email: string
  total: number
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderNumber = searchParams.get('order') // For free orders
  const { clearCart } = useCartStore()

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    // Clear cart only once
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [clearCart, cleared])

  useEffect(() => {
    async function fetchOrderDetails() {
      // Handle Stripe session
      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setOrderDetails(data)
          }
        } catch (error) {
          console.error('Error fetching order details:', error)
        } finally {
          setLoading(false)
        }
        return
      }

      // Handle free orders with order number
      if (orderNumber) {
        try {
          const response = await fetch(`/api/orders/${orderNumber}`)
          if (response.ok) {
            const data = await response.json()
            setOrderDetails({
              orderNumber: data.order_number,
              email: data.shipping_address?.email || '',
              total: data.total,
            })
          }
        } catch (error) {
          console.error('Error fetching order details:', error)
          // Still show basic success message for free orders
          setOrderDetails({
            orderNumber: orderNumber,
            email: '',
            total: 0,
          })
        } finally {
          setLoading(false)
        }
        return
      }

      setLoading(false)
    }

    fetchOrderDetails()
  }, [sessionId, orderNumber])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-heading-minimal text-xl md:text-2xl mb-4">
            GRAZIE PER IL TUO ORDINE!
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pure-black" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground text-sm">
                Il tuo ordine è stato completato con successo.
              </p>

              <div className="bg-neutral-grey border border-pure-black/10 p-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Numero ordine:</span>
                    <span className="text-price-mono font-semibold">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Email:</span>
                    <span className="text-sm">{orderDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Totale:</span>
                    <span className="text-price-mono font-bold">
                      {orderDetails.total === 0 ? 'Gratuito' : `€${orderDetails.total.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Riceverai una email di conferma all&apos;indirizzo{' '}
                <span className="font-medium">{orderDetails.email}</span>
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground mb-8 text-sm">
              Il tuo ordine è stato completato con successo. Riceverai presto una email di conferma.
            </p>
          )}

          {/* Next Steps */}
          <div className="bg-neutral-grey border border-pure-black/10 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6 text-pure-black" />
              <h3 className="text-label-caps text-[10px]">PROSSIMI PASSI</h3>
            </div>
            <ul className="text-sm text-left space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-pure-black font-bold">1.</span>
                Riceverai un&apos;email di conferma con i dettagli dell&apos;ordine
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pure-black font-bold">2.</span>
                Prepareremo il tuo pacco con cura
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pure-black font-bold">3.</span>
                Ti invieremo il tracking quando spediremo
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-filled">
              <Link href="/products">
                CONTINUA LO SHOPPING
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="btn-outline text-xs">
              <Link href="/account/ordini">
                I MIEI ORDINI
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pure-black" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}