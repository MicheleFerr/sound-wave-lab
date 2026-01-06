// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { checkoutRateLimiter, checkRateLimit } from '@/lib/rate-limit'

// Lazy load stripe only when needed (for paid orders)
const getStripe = async () => {
  const { stripe } = await import('@/lib/stripe/server')
  return stripe
}

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

// SECURITY: Generate cryptographically secure access token for guest orders
function generateAccessToken(): string {
  return randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  // SECURITY: Rate limiting check
  const rateLimitResponse = await checkRateLimit(request, checkoutRateLimiter)
  if (rateLimitResponse) return rateLimitResponse

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

    // Get current user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // SECURITY: Validate prices server-side against database
    const variantIds = items.map(item => item.variantId)
    const { data: variants, error: variantError } = await supabase
      .from('product_variants')
      .select('id, price, stock_quantity, is_active')
      .in('id', variantIds)

    if (variantError || !variants || variants.length !== items.length) {
      return NextResponse.json(
        { error: 'Alcuni prodotti non sono più disponibili' },
        { status: 400 }
      )
    }

    // Create price map from database
    const priceMap = new Map(
      variants.map(v => [v.id, { price: Number(v.price), stock: v.stock_quantity, active: v.is_active }])
    )

    // Validate all items are available
    for (const item of items) {
      const dbVariant = priceMap.get(item.variantId)
      if (!dbVariant) {
        return NextResponse.json(
          { error: `Prodotto non trovato: ${item.productName}` },
          { status: 400 }
        )
      }
      if (!dbVariant.active) {
        return NextResponse.json(
          { error: `Prodotto non disponibile: ${item.productName}` },
          { status: 400 }
        )
      }
      if (dbVariant.stock !== null && dbVariant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Quantità insufficiente per: ${item.productName}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals using SERVER-SIDE prices (not client-provided)
    const subtotalCents = items.reduce(
      (sum, item) => {
        const serverPrice = priceMap.get(item.variantId)!.price
        return sum + Math.round(serverPrice * 100) * item.quantity
      },
      0
    )
    const shippingCost = subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const discountCents = coupon ? Math.round(coupon.discount_amount * 100) : 0
    const totalCents = Math.max(0, subtotalCents + shippingCost - discountCents)
    const isFreeOrder = totalCents === 0

    // Generate order number and access token for guest orders
    const orderNumber = generateOrderNumber()
    const accessToken = user ? null : generateAccessToken() // Only for guest orders

    // Helper function to create order and order items
    // Uses admin client to bypass RLS for order creation
    const createOrderInDatabase = async (status: string, stripeSessionId: string | null) => {
      const { error: orderError } = await supabaseAdmin.from('orders').insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        access_token: accessToken, // SECURITY: Token for guest order verification
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
        console.error('Error creating order:', JSON.stringify(orderError, null, 2))
        console.error('Order data attempted:', {
          order_number: orderNumber,
          user_id: user?.id || null,
          has_access_token: !!accessToken,
          coupon_id: coupon?.id || null,
          coupon_code: coupon?.code || null,
        })
        return null
      }

      // Get the created order ID for order items
      const { data: orderData } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .single()

      if (orderData) {
        // Create order items with SERVER-SIDE prices
        const orderItems = items.map((item) => {
          const serverPrice = priceMap.get(item.variantId)!.price
          return {
            order_id: orderData.id,
            variant_id: item.variantId,
            product_name: item.productName,
            variant_sku: item.variantSku,
            variant_attributes: item.attributes,
            unit_price: serverPrice,
            quantity: item.quantity,
            total_price: serverPrice * item.quantity,
          }
        })

        await supabaseAdmin.from('order_items').insert(orderItems)
      }

      return orderData
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

      // SECURITY: Update coupon usage atomically to prevent race conditions
      if (coupon?.id) {
        await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id_param: coupon.id })
      }

      // Redirect directly to success page with order number (and token for guests)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || ''
      const successUrl = accessToken
        ? `${appUrl}/checkout/success?order=${orderNumber}&token=${accessToken}`
        : `${appUrl}/checkout/success?order=${orderNumber}`

      return NextResponse.json({
        sessionId: null,
        url: successUrl,
        freeOrder: true,
      })
    }

    // For PAID orders, create Stripe Checkout Session
    const stripe = await getStripe()

    const lineItems: any[] = items.map((item) => {
      // Use server-side price from database, not client-provided
      const serverPrice = priceMap.get(item.variantId)!.price
      return {
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
          unit_amount: Math.round(serverPrice * 100),
        },
        quantity: item.quantity,
      }
    })

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
        access_token: accessToken || '', // SECURITY: For guest order verification
        coupon_id: coupon?.id || '',
        coupon_code: coupon?.code || '',
        shipping_address: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map(item => ({
          variantId: item.variantId,
          productName: item.productName,
          variantSku: item.variantSku,
          attributes: item.attributes,
          price: priceMap.get(item.variantId)!.price, // Use server-side price
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
