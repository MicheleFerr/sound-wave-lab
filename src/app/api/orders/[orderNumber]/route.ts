// src/app/api/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Ordine non trovato' },
        { status: 404 }
      )
    }

    // Security: Verify ownership or admin role
    // If order has a user_id, only that user or admin can view it
    if (order.user_id) {
      if (!user) {
        return NextResponse.json(
          { error: 'Autenticazione richiesta' },
          { status: 401 }
        )
      }

      // Check if user owns the order
      if (order.user_id !== user.id) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          return NextResponse.json(
            { error: 'Accesso non autorizzato' },
            { status: 403 }
          )
        }
      }
    }
    // Note: Guest orders (user_id = null) remain accessible by order number
    // This is intentional for order confirmation pages

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'ordine' },
      { status: 500 }
    )
  }
}
