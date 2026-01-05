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
    const { items, shippingAddress, email } = body

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
    const totalCents = subtotalCents + shippingCost

    // Get current user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create line items for Stripe
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
            images: undefined,
            metadata: {},
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: {
        order_number: orderNumber,
        user_id: user?.id || '',
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
    })

    // Create pending order in database
    const { error: orderError } = await supabase.from('orders').insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      stripe_session_id: session.id,
      status: 'pending',
      subtotal: subtotalCents / 100,
      shipping_cost: shippingCost / 100,
      total: totalCents / 100,
      shipping_address: {
        ...shippingAddress,
        email,
      },
    })

    if (orderError) {
      console.error('Error creating order:', orderError)
      // Don't fail the checkout, we'll create the order in webhook if needed
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
