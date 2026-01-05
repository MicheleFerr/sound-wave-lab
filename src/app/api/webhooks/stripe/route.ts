// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role client for webhook operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status to paid
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Error updating order:', updateError)

          // If order doesn't exist, create it from session metadata
          if (session.metadata) {
            const shippingAddress = JSON.parse(session.metadata.shipping_address || '{}')
            const items = JSON.parse(session.metadata.items || '[]')

            const { data: newOrder, error: createError } = await supabase
              .from('orders')
              .insert({
                order_number: session.metadata.order_number,
                user_id: session.metadata.user_id || null,
                stripe_session_id: session.id,
                stripe_payment_intent: session.payment_intent as string,
                status: 'paid',
                subtotal: (session.amount_subtotal || 0) / 100,
                shipping_cost: ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100,
                total: (session.amount_total || 0) / 100,
                shipping_address: {
                  ...shippingAddress,
                  email: session.customer_email,
                },
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating order:', createError)
            } else if (newOrder && items.length > 0) {
              // Create order items
              const orderItems = items.map((item: {
                variantId: string
                productName: string
                variantSku: string
                attributes: Record<string, string>
                price: number
                quantity: number
              }) => ({
                order_id: newOrder.id,
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
          }
        }

        // Decrease stock for purchased items
        if (session.metadata?.items) {
          const items = JSON.parse(session.metadata.items)
          for (const item of items) {
            // Get current stock
            const { data: variant } = await supabase
              .from('product_variants')
              .select('stock_quantity')
              .eq('id', item.variantId)
              .single()

            if (variant && variant.stock_quantity !== null) {
              const newStock = Math.max(0, variant.stock_quantity - item.quantity)
              await supabase
                .from('product_variants')
                .update({ stock_quantity: newStock })
                .eq('id', item.variantId)
            }
          }
        }

        console.log('Order completed:', session.metadata?.order_number)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // Mark order as expired/canceled
        await supabase
          .from('orders')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        console.log('Session expired:', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
