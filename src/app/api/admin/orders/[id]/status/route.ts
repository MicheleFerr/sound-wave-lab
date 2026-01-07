// src/app/api/admin/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { OrderStatus } from '@/types/order'

export async function PATCH(
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
    const { status } = body as { status: OrderStatus }

    if (!status) {
      return NextResponse.json(
        { error: 'Status è obbligatorio' },
        { status: 400 }
      )
    }

    // Valid statuses
    const validStatuses: OrderStatus[] = [
      'pending',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status non valido' },
        { status: 400 }
      )
    }

    // Get current order status
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('status, order_number')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    const previousStatus = order.status

    // Don't update if status is the same
    if (previousStatus === status) {
      return NextResponse.json({
        success: true,
        message: 'Status già impostato'
      })
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating order status:', updateError)
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento dello status' },
        { status: 500 }
      )
    }

    // Log activity
    const { error: logError } = await supabaseAdmin
      .from('order_activity_log')
      .insert({
        order_id: id,
        performed_by: user.id,
        action_type: 'status_change',
        previous_value: { status: previousStatus },
        new_value: { status: status },
        metadata: {
          order_number: order.order_number,
        },
      })

    if (logError) {
      console.error('Error logging activity:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      previousStatus,
      newStatus: status
    })
  } catch (error) {
    console.error('Error changing order status:', error)
    return NextResponse.json(
      { error: 'Errore durante il cambio di status' },
      { status: 500 }
    )
  }
}
