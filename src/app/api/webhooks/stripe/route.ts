// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail, sendOrderRefundedEmail } from '@/lib/email/send'

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
    // Handle refund events with type assertion since they may not be in older Stripe type definitions
    const eventType = event.type as string

    switch (eventType) {
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

        // Send order confirmation email
        if (session.metadata) {
          const shippingAddress = JSON.parse(session.metadata.shipping_address || '{}')
          const items = JSON.parse(session.metadata.items || '[]')

          sendOrderConfirmationEmail({
            orderNumber: session.metadata.order_number || '',
            customerName: shippingAddress.fullName || '',
            customerEmail: session.customer_email || '',
            items: items.map((item: { productName: string; quantity: number; price: number; attributes?: Record<string, string> }) => ({
              name: item.productName,
              quantity: item.quantity,
              price: item.price,
              attributes: item.attributes,
            })),
            subtotal: (session.amount_subtotal || 0) / 100,
            shippingCost: ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100,
            discountAmount: (session.total_details?.amount_discount || 0) / 100,
            total: (session.amount_total || 0) / 100,
            shippingAddress: {
              street: shippingAddress.street || '',
              city: shippingAddress.city || '',
              province: shippingAddress.province || '',
              postalCode: shippingAddress.postalCode || '',
              country: shippingAddress.country || 'Italia',
            },
          }).catch(err => console.error('Failed to send order confirmation email:', err))
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

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        // Find order by payment_intent
        const { data: order } = await supabase
          .from('orders')
          .select('id, order_number, total, shipping_address, status')
          .eq('stripe_payment_intent', charge.payment_intent)
          .single()

        if (!order) {
          console.error('Order not found for payment_intent:', charge.payment_intent)
          break
        }

        // Check if refund amount equals total (full refund)
        const refundedAmount = charge.amount_refunded / 100
        const isFullRefund = refundedAmount >= order.total

        // Update order status to refunded if fully refunded
        if (isFullRefund && order.status !== 'refunded') {
          await supabase
            .from('orders')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)

          console.log(`Order ${order.order_number} marked as refunded (full refund)`)
        }

        // Log activity
        await supabase
          .from('order_activity_log')
          .insert({
            order_id: order.id,
            action_type: 'refund',
            performed_by: null, // Webhook = system action
            previous_value: { status: order.status, amount_refunded: 0 },
            new_value: { status: isFullRefund ? 'refunded' : order.status, amount_refunded: refundedAmount },
            metadata: {
              stripe_charge_id: charge.id,
              refund_amount: refundedAmount,
              refund_currency: 'EUR',
              is_full_refund: isFullRefund,
              order_number: order.order_number,
              webhook_event: 'charge.refunded',
            },
          })

        console.log('Charge refunded:', charge.id, `Amount: €${refundedAmount}`)
        break
      }

      case 'refund.succeeded': {
        const refund = event.data.object as Stripe.Refund

        // Find order by payment_intent (from charge)
        const charge = await stripe.charges.retrieve(refund.charge as string)

        const { data: order } = await supabase
          .from('orders')
          .select('id, order_number, total, shipping_address, status')
          .eq('stripe_payment_intent', charge.payment_intent)
          .single()

        if (!order) {
          console.error('Order not found for charge:', refund.charge)
          break
        }

        const refundedAmount = refund.amount / 100
        const isFullRefund = refundedAmount >= order.total

        // Update order status if full refund
        if (isFullRefund && order.status !== 'refunded') {
          await supabase
            .from('orders')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)
        }

        // Log activity
        await supabase
          .from('order_activity_log')
          .insert({
            order_id: order.id,
            action_type: 'refund',
            performed_by: null,
            previous_value: { status: order.status },
            new_value: { status: isFullRefund ? 'refunded' : order.status },
            metadata: {
              stripe_refund_id: refund.id,
              refund_amount: refundedAmount,
              refund_currency: refund.currency.toUpperCase(),
              refund_reason: refund.reason || 'No reason provided',
              is_full_refund: isFullRefund,
              order_number: order.order_number,
              webhook_event: 'refund.succeeded',
            },
          })

        // Send refund confirmation email to customer
        const shippingAddress = order.shipping_address as { fullName?: string; email?: string }
        if (shippingAddress?.email) {
          await sendOrderRefundedEmail({
            orderNumber: order.order_number,
            customerName: shippingAddress.fullName || 'Cliente',
            customerEmail: shippingAddress.email,
            refundAmount: refundedAmount,
            refundReason: refund.reason || undefined,
            isPartial: !isFullRefund,
            estimatedDays: '5-10',
          }).catch(err => console.error('Failed to send refund email:', err))
        }

        console.log(`Refund succeeded: ${refund.id}, Order: ${order.order_number}`)
        break
      }

      case 'refund.failed': {
        const refund = event.data.object as Stripe.Refund

        // Find order by charge
        const charge = await stripe.charges.retrieve(refund.charge as string)

        const { data: order } = await supabase
          .from('orders')
          .select('id, order_number')
          .eq('stripe_payment_intent', charge.payment_intent)
          .single()

        if (!order) {
          console.error('Order not found for failed refund charge:', refund.charge)
          break
        }

        // Log failed refund
        await supabase
          .from('order_activity_log')
          .insert({
            order_id: order.id,
            action_type: 'refund',
            performed_by: null,
            previous_value: { status: 'refund_attempted' },
            new_value: { status: 'refund_failed' },
            metadata: {
              stripe_refund_id: refund.id,
              refund_amount: refund.amount / 100,
              refund_currency: refund.currency.toUpperCase(),
              failure_reason: refund.failure_reason || 'Unknown failure',
              order_number: order.order_number,
              webhook_event: 'refund.failed',
              alert_admin: true,
            },
          })

        // TODO: Send alert to admin about failed refund
        console.error(`⚠️ REFUND FAILED - Order: ${order.order_number}, Refund: ${refund.id}, Reason: ${refund.failure_reason}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${eventType}`)
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
