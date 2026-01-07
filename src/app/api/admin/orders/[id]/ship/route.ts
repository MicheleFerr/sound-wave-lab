// src/app/api/admin/orders/[id]/ship/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendOrderShippedEmail } from '@/lib/email/send'

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
    const { trackingNumber, carrier, trackingUrl } = body

    if (!trackingNumber || !carrier) {
      return NextResponse.json(
        { error: 'Numero tracking e corriere sono obbligatori' },
        { status: 400 }
      )
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('order_number, shipping_address')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        carrier: carrier,
        tracking_url: trackingUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento' },
        { status: 500 }
      )
    }

    // Send shipped email
    const shippingAddress = order.shipping_address as { fullName?: string; email?: string }
    if (shippingAddress?.email) {
      sendOrderShippedEmail({
        orderNumber: order.order_number,
        customerName: shippingAddress.fullName || '',
        customerEmail: shippingAddress.email,
        trackingNumber,
        carrier,
        trackingUrl: trackingUrl || null,
      }).catch(err => console.error('Failed to send shipped email:', err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error shipping order:', error)
    return NextResponse.json(
      { error: 'Errore durante la spedizione' },
      { status: 500 }
    )
  }
}
