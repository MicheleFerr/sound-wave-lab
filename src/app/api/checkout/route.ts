// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

interface CartItem {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  variantSku: string
  attributes: Record<string, string>
  price: number
  quantity: number
  imageUrl: string
}

interface CouponData {
  id: string
  code: string
  discount_amount: number
}

interface CheckoutRequest {
  items: CartItem[]
  shippingAddress: {
    fullName: string
    street: string
    city: string
    province: string
    postalCode: string
    country: string
    phone: string
  }
  email: string
  coupon?: CouponData | null
}

const SHIPPING_COST = 499 // 4.99€ in cents
const FREE_SHIPPING_THRESHOLD = 5000 // 50€ in cents

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SWL-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, shippingAddress, email, coupon } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Il carrello è vuoto' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !email) {
      return NextResponse.json(
        { error: 'Indirizzo di spedizione e email sono obbligatori' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotalCents = items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    )
    const shippingCost = subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const discountCents = coupon ? Math.round(coupon.discount_amount * 100) : 0
    const totalCents = Math.max(0, subtotalCents + shippingCost - discountCents)
    const isFreeOrder = totalCents === 0

    // Get current user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Helper function to create order and order items
    const createOrderInDatabase = async (status: string, stripeSessionId: string | null) => {
      const { error: orderError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        stripe_session_id: stripeSessionId,
        status,
        subtotal: subtotalCents / 100,
        shipping_cost: shippingCost / 100,
        discount_amount: discountCents / 100,
        total: totalCents / 100,
        coupon_id: coupon?.id || null,
        coupon_code: coupon?.code || null,
        shipping_address: {
          ...shippingAddress,
          email,
        },
      })

      if (orderError) {
        console.error('Error creating order:', orderError)
        return null
      }

      // Get the created order ID for order items
      const { data: orderData } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .single()

      if (orderData) {
        // Create order items
        const orderItems = items.map((item) => ({
          order_id: orderData.id,
          variant_id: item.variantId,
          product_name: item.productName,
          variant_sku: item.variantSku,
          variant_attributes: item.attributes,
          unit_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
        }))

        await supabase.from('order_items').insert(orderItems)
      }

      return orderData
    }

    // Update coupon usage count if coupon was used
    const updateCouponUsage = async () => {
      if (coupon?.id) {
        await supabase.rpc('increment_coupon_usage', { coupon_id: coupon.id }).catch(() => {
          // If RPC doesn't exist, do manual update
          supabase
            .from('coupons')
            .update({ current_uses: supabase.rpc('current_uses + 1') })
            .eq('id', coupon.id)
        })
      }
    }

    // Handle FREE orders (100% discount)
    if (isFreeOrder) {
      // Create order directly as paid
      const orderData = await createOrderInDatabase('paid', null)

      if (!orderData) {
        return NextResponse.json(
          { error: 'Errore durante la creazione dell\'ordine' },
          { status: 500 }
        )
      }

      // Update coupon usage - increment current_uses
      if (coupon?.id) {
        // First get current value, then increment
        const { data: currentCoupon } = await supabase
          .from('coupons')
          .select('current_uses')
          .eq('id', coupon.id)
          .single()

        if (currentCoupon) {
          await supabase
            .from('coupons')
            .update({ current_uses: (currentCoupon.current_uses || 0) + 1 })
            .eq('id', coupon.id)
        }
      }

      // Redirect directly to success page with order number
      return NextResponse.json({
        sessionId: null,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`,
        freeOrder: true,
      })
    }

    // For PAID orders, create Stripe Checkout Session
    const lineItems: any[] = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.productName,
          description: Object.entries(item.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ') || undefined,
          images: item.imageUrl ? [item.imageUrl] : undefined,
          metadata: {
            variant_id: item.variantId,
            product_id: item.productId,
            sku: item.variantSku,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Spedizione Standard',
            description: 'Consegna in 3-5 giorni lavorativi',
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session with discount if applicable
    const sessionConfig: any = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: {
        order_number: orderNumber,
        user_id: user?.id || '',
        coupon_id: coupon?.id || '',
        coupon_code: coupon?.code || '',
        shipping_address: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map(item => ({
          variantId: item.variantId,
          productName: item.productName,
          variantSku: item.variantSku,
          attributes: item.attributes,
          price: item.price,
          quantity: item.quantity,
        }))),
      },
      shipping_options: shippingCost === 0 ? [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Spedizione Gratuita',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ] : undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    }

    // Add discount as a coupon in Stripe if applicable
    if (discountCents > 0) {
      // Create a one-time coupon in Stripe for this checkout
      const stripeCoupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency: 'eur',
        name: coupon?.code || 'Discount',
        duration: 'once',
      })

      sessionConfig.discounts = [{ coupon: stripeCoupon.id }]
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    // Create pending order in database
    await createOrderInDatabase('pending', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Si è verificato un errore durante il checkout' },
      { status: 500 }
    )
  }
}
