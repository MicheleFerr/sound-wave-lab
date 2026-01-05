'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/stores/cart-store'
import { getStripe } from '@/lib/stripe/client'
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  CreditCard,
  Truck,
  ShieldCheck,
  AlertCircle,
  Tag,
  X,
  Check,
} from 'lucide-react'

const SHIPPING_COST = 4.99
const FREE_SHIPPING_THRESHOLD = 50

interface ShippingForm {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

interface AppliedCoupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  discount_amount: number
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  const { items, subtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Italia',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartSubtotal = subtotal()
  const shippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const discountAmount = appliedCoupon?.discount_amount || 0
  const total = Math.max(0, cartSubtotal + shippingCost - discountAmount)

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-gradient-light flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-brand-teal" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Il carrello è vuoto</h1>
            <p className="text-muted-foreground mb-8">
              Aggiungi qualche prodotto prima di procedere al checkout!
            </p>
            <Button asChild className="bg-brand-gradient hover:opacity-90 !text-white">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna al negozio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError(null)
  }

  const validateForm = (): boolean => {
    if (!form.fullName.trim()) {
      setError('Inserisci il tuo nome completo')
      return false
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Inserisci un indirizzo email valido')
      return false
    }
    if (!form.phone.trim()) {
      setError('Inserisci il tuo numero di telefono')
      return false
    }
    if (!form.street.trim()) {
      setError('Inserisci l\'indirizzo')
      return false
    }
    if (!form.city.trim()) {
      setError('Inserisci la città')
      return false
    }
    if (!form.province.trim()) {
      setError('Inserisci la provincia')
      return false
    }
    if (!form.postalCode.trim() || !/^\d{5}$/.test(form.postalCode)) {
      setError('Inserisci un CAP valido (5 cifre)')
      return false
    }
    return true
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Inserisci un codice coupon')
      return
    }

    setCouponLoading(true)
    setCouponError(null)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal: cartSubtotal,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error || 'Codice coupon non valido')
        return
      }

      setAppliedCoupon({
        id: data.coupon.id,
        code: data.coupon.code,
        description: data.coupon.description,
        discount_type: data.coupon.discount_type,
        discount_value: data.coupon.discount_value,
        discount_amount: data.discount_amount,
      })
      setCouponCode('')
    } catch (err) {
      setCouponError('Errore durante la validazione del coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: {
            fullName: form.fullName,
            street: form.street,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
            country: form.country,
            phone: form.phone,
          },
          email: form.email,
          coupon: appliedCoupon ? {
            id: appliedCoupon.id,
            code: appliedCoupon.code,
            discount_amount: appliedCoupon.discount_amount,
          } : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il checkout')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL di reindirizzamento non disponibile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            <span className="text-brand-gradient">Checkout</span>
          </h1>
          <p className="text-zinc-300 text-center mt-3">
            Completa il tuo ordine in sicurezza
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-8">
          {/* Canceled Banner */}
          {canceled && (
            <div className="mb-8 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Pagamento annullato. Puoi riprovare quando vuoi.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Shipping Form */}
              <div className="space-y-8">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-brand-teal" />
                    Indirizzo di Spedizione
                  </h2>

                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome completo *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleInputChange}
                          placeholder="Mario Rossi"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="mario@esempio.it"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="+39 333 1234567"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Indirizzo *</Label>
                      <Input
                        id="street"
                        name="street"
                        value={form.street}
                        onChange={handleInputChange}
                        placeholder="Via Roma 123"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Città *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          placeholder="Milano"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Provincia *</Label>
                        <Input
                          id="province"
                          name="province"
                          value={form.province}
                          onChange={handleInputChange}
                          placeholder="MI"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">CAP *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={form.postalCode}
                          onChange={handleInputChange}
                          placeholder="20100"
                          maxLength={5}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Paese</Label>
                      <Input
                        id="country"
                        name="country"
                        value={form.country}
                        onChange={handleInputChange}
                        disabled
                        className="bg-zinc-100 dark:bg-zinc-800"
                      />
                      <p className="text-xs text-muted-foreground">
                        Attualmente spediamo solo in Italia
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center gap-3 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <ShieldCheck className="h-8 w-8 text-brand-teal" />
                    <div>
                      <p className="font-medium text-sm">Pagamento Sicuro</p>
                      <p className="text-xs text-muted-foreground">Protetto da Stripe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <CreditCard className="h-8 w-8 text-brand-teal" />
                    <div>
                      <p className="font-medium text-sm">Carte Accettate</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-4 h-fit">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                  <h2 className="text-lg font-bold mb-6">Riepilogo Ordine</h2>

                  {/* Coupon Input */}
                  <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-brand-teal" />
                      <span className="text-sm font-medium">Codice Sconto</span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {appliedCoupon.discount_type === 'percentage'
                              ? `-${appliedCoupon.discount_value}%`
                              : `-€${appliedCoupon.discount_value.toFixed(2)}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-800/30 rounded"
                        >
                          <X className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Inserisci codice"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setCouponError(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleApplyCoupon()
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Applica'
                          )}
                        </Button>
                      </div>
                    )}

                    {couponError && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-8">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-teal text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                          {Object.keys(item.attributes).length > 0 && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {Object.entries(item.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-sm">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotale</span>
                      <span>€{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spedizione</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                        {shippingCost === 0 ? 'Gratuita' : `€${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {appliedCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          Sconto ({appliedCoupon.code})
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          -€{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <span>Totale</span>
                      <span className="text-brand-teal">
                        {total === 0 ? 'Gratuito!' : `€${total.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">IVA inclusa</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-6 bg-brand-gradient hover:opacity-90 !text-white"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Elaborazione...
                      </>
                    ) : total === 0 ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Completa Ordine Gratuito
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Paga €{total.toFixed(2)}
                      </>
                    )}
                  </Button>

                  {/* Back to Cart */}
                  <Button variant="ghost" asChild className="w-full mt-2">
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Torna al carrello
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}