// src/app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ValidateCouponRequest {
  code: string
  subtotal: number // in euros
}

interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  is_active: boolean
  valid_from: string
  valid_until: string | null
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateCouponRequest = await request.json()
    const { code, subtotal } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Codice coupon richiesto' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find the coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json(
        { error: 'Codice coupon non valido' },
        { status: 404 }
      )
    }

    const c = coupon as Coupon

    // Check validity dates
    const now = new Date()
    if (new Date(c.valid_from) > now) {
      return NextResponse.json(
        { error: 'Questo coupon non è ancora attivo' },
        { status: 400 }
      )
    }

    if (c.valid_until && new Date(c.valid_until) < now) {
      return NextResponse.json(
        { error: 'Questo coupon è scaduto' },
        { status: 400 }
      )
    }

    // Check usage limits
    if (c.max_uses !== null && c.current_uses >= c.max_uses) {
      return NextResponse.json(
        { error: 'Questo coupon ha raggiunto il limite di utilizzi' },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (subtotal < c.min_order_amount) {
      return NextResponse.json(
        { error: `Ordine minimo di €${c.min_order_amount.toFixed(2)} richiesto per questo coupon` },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount: number
    if (c.discount_type === 'percentage') {
      discountAmount = (subtotal * c.discount_value) / 100
      // Cap at 100%
      if (c.discount_value >= 100) {
        discountAmount = subtotal
      }
    } else {
      // Fixed amount
      discountAmount = Math.min(c.discount_value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: c.id,
        code: c.code,
        description: c.description,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
      },
      discount_amount: discountAmount,
      new_total: Math.max(0, subtotal - discountAmount),
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Errore durante la validazione del coupon' },
      { status: 500 }
    )
  }
}
