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
      if (!sessionId) {
        setLoading(false)
        return
      }

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
    }

    fetchOrderDetails()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Grazie per il tuo ordine!
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-teal" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Il tuo ordine è stato completato con successo.
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Numero ordine:</span>
                    <span className="font-mono font-semibold">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{orderDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Totale:</span>
                    <span className="font-bold text-brand-teal">
                      €{orderDetails.total.toFixed(2)}
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
            <p className="text-muted-foreground mb-8">
              Il tuo ordine è stato completato con successo. Riceverai presto una email di conferma.
            </p>
          )}

          {/* Next Steps */}
          <div className="bg-brand-gradient-light rounded-lg border border-brand-teal/30 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6 text-brand-teal" />
              <h3 className="font-semibold">Prossimi passi</h3>
            </div>
            <ul className="text-sm text-left space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">1.</span>
                Riceverai un&apos;email di conferma con i dettagli dell&apos;ordine
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">2.</span>
                Prepareremo il tuo pacco con cura
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal font-bold">3.</span>
                Ti invieremo il tracking quando spediremo
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-brand-gradient hover:opacity-90 text-white">
              <Link href="/products">
                Continua lo shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/ordini">
                I miei ordini
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
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}