// src/app/api/admin/orders/[id]/refund/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/server'
import { sendOrderRefundedEmail } from '@/lib/email/send'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { reason, amount, notifyCustomer = true } = body as {
      reason?: string
      amount?: number // If partial refund
      notifyCustomer?: boolean
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, status, total, stripe_payment_intent, shipping_address')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    // Validate order can be refunded
    if (!['paid', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      return NextResponse.json(
        { error: 'L\'ordine non può essere rimborsato in questo stato' },
        { status: 400 }
      )
    }

    if (!order.stripe_payment_intent) {
      return NextResponse.json(
        { error: 'Payment intent non trovato. L\'ordine potrebbe non essere stato pagato.' },
        { status: 400 }
      )
    }

    // Calculate refund amount (full or partial)
    const refundAmount = amount || order.total
    if (refundAmount > order.total) {
      return NextResponse.json(
        { error: 'L\'importo del rimborso non può superare il totale dell\'ordine' },
        { status: 400 }
      )
    }

    // Create refund in Stripe
    let stripeRefund
    try {
      stripeRefund = await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          admin_user_id: user.id,
          refund_reason: reason || 'No reason provided',
        },
      })
    } catch (stripeError: any) {
      console.error('Stripe refund error:', stripeError)
      return NextResponse.json(
        { error: `Errore Stripe: ${stripeError.message}` },
        { status: 400 }
      )
    }

    // Update order status to refunded
    const newStatus = refundAmount === order.total ? 'refunded' : order.status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating order:', updateError)
      // Don't fail the request - refund was created in Stripe
    }

    // Log activity with full refund details
    await supabaseAdmin
      .from('order_activity_log')
      .insert({
        order_id: id,
        performed_by: user.id,
        action_type: 'refund',
        previous_value: { status: order.status, amount_refunded: 0 },
        new_value: {
          status: newStatus,
          amount_refunded: refundAmount,
          is_partial: refundAmount < order.total
        },
        metadata: {
          order_number: order.order_number,
          stripe_refund_id: stripeRefund.id,
          refund_status: stripeRefund.status,
          reason: reason || 'No reason provided',
          refund_amount: refundAmount,
          refund_currency: 'eur',
        },
      })

    // Send refund email to customer
    const shippingAddress = order.shipping_address as {
      fullName?: string
      email?: string
    }

    if (notifyCustomer && shippingAddress?.email) {
      await sendOrderRefundedEmail({
        orderNumber: order.order_number,
        customerName: shippingAddress.fullName || '',
        customerEmail: shippingAddress.email,
        refundAmount: refundAmount,
        refundReason: reason || 'Su tua richiesta',
        isPartial: refundAmount < order.total,
        estimatedDays: '5-10 giorni lavorativi',
      }).catch(err => console.error('Failed to send refund email:', err))
    }

    return NextResponse.json({
      success: true,
      refund: {
        id: stripeRefund.id,
        amount: refundAmount,
        status: stripeRefund.status,
        created: stripeRefund.created,
      },
      order_status: newStatus,
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    return NextResponse.json(
      { error: 'Errore durante il rimborso' },
      { status: 500 }
    )
  }
}
