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

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'ordine' },
      { status: 500 }
    )
  }
}
