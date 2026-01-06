// src/components/layout/PromoBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

interface BannerCoupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount: number
}

export function PromoBanner() {
  const [coupon, setCoupon] = useState<BannerCoupon | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBannerCoupon() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('coupons')
          .select('id, code, discount_type, discount_value, min_order_amount')
          .eq('banner_enabled', true)
          .eq('is_active', true)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine
          console.error('Error fetching banner coupon:', error)
        }

        if (data) {
          setCoupon(data)
        }
      } catch (error) {
        console.error('Error fetching banner coupon:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBannerCoupon()
  }, [])

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (coupon) {
      try {
        await navigator.clipboard.writeText(coupon.code)
        toast.success('Codice copiato!')
      } catch {
        toast.error('Impossibile copiare il codice')
      }
    }
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDismissed(true)
  }

  // Don't render if loading, no coupon, or dismissed
  if (loading || !coupon || dismissed) {
    return null
  }

  // Build the discount text
  const discountText = coupon.discount_type === 'percentage'
    ? `${coupon.discount_value}% di sconto`
    : `€${coupon.discount_value.toFixed(2)} di sconto`

  const minOrderText = coupon.min_order_amount > 0
    ? ` su ordini superiori a €${coupon.min_order_amount.toFixed(2)}`
    : ''

  return (
    <Link
      href="/catalogo"
      className="block bg-black text-white text-sm py-2.5 px-4 text-center relative hover:bg-zinc-900 transition-colors"
    >
      <span>
        Usa il codice{' '}
        <button
          onClick={handleCopyCode}
          className="font-semibold underline underline-offset-2 hover:text-zinc-300 transition-colors"
        >
          {coupon.code}
        </button>
        {' '}per {discountText}{minOrderText}
      </span>

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Chiudi banner"
      >
        <X className="h-4 w-4" />
      </button>
    </Link>
  )
}
