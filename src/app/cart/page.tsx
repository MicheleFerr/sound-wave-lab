// src/app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/stores/cart-store'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck } from 'lucide-react'

const SHIPPING_COST = 4.99
const FREE_SHIPPING_THRESHOLD = 50

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartSubtotal = subtotal()
  const shippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = cartSubtotal + shippingCost
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartSubtotal

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-gradient-light flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-brand-teal" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Il tuo carrello è vuoto</h1>
            <p className="text-muted-foreground mb-8">
              Esplora il nostro catalogo e aggiungi i prodotti che ti piacciono!
            </p>
            <Button asChild className="bg-brand-gradient hover:opacity-90">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Scopri i prodotti
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            <span className="text-brand-gradient">Carrello</span>
          </h1>
          <p className="text-zinc-300 text-center mt-2">
            {items.length} {items.length === 1 ? 'articolo' : 'articoli'} nel carrello
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Banner */}
              {remainingForFreeShipping > 0 && (
                <div className="bg-brand-gradient-light border border-brand-teal/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-brand-teal flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        Aggiungi ancora{' '}
                        <span className="text-brand-teal font-bold">
                          €{remainingForFreeShipping.toFixed(2)}
                        </span>{' '}
                        per ottenere la spedizione gratuita!
                      </p>
                      <div className="mt-2 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-gradient transition-all duration-300"
                          style={{
                            width: `${Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-semibold hover:text-brand-teal transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>

                    {/* Variant Attributes */}
                    {Object.keys(item.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-1">SKU: {item.variantSku}</p>

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.variantId, parseInt(e.target.value) || 1)
                          }
                          className="w-16 h-8 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-brand-teal">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            €{item.price.toFixed(2)} cad.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => removeItem(item.variantId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continua lo shopping
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => clearCart()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Svuota carrello
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-bold mb-4">Riepilogo ordine</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotale</span>
                    <span>€{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spedizione</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingCost === 0 ? 'Gratuita' : `€${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Totale</span>
                      <span className="text-brand-teal">€{total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">IVA inclusa</p>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-brand-gradient hover:opacity-90"
                  size="lg"
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Procedi al checkout
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-gradient-light flex items-center justify-center">
                        <Truck className="w-4 h-4 text-brand-teal" />
                      </div>
                      <span>Spedizione veloce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-gradient-light flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-brand-teal" />
                      </div>
                      <span>Pagamento sicuro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
