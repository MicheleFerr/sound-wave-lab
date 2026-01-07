// src/app/api/admin/orders/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
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

    // Fetch all orders with details
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        subtotal,
        shipping_cost,
        tax_amount,
        discount_amount,
        total,
        tracking_number,
        carrier,
        shipping_address,
        created_at,
        updated_at,
        user_id,
        profiles!orders_user_id_fkey (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Errore durante il recupero degli ordini' },
        { status: 500 }
      )
    }

    // Generate CSV
    const csvHeader = [
      'Numero Ordine',
      'Data',
      'Status',
      'Cliente',
      'Email',
      'Subtotale',
      'Spedizione',
      'Tasse',
      'Sconto',
      'Totale',
      'Indirizzo',
      'Città',
      'CAP',
      'Provincia',
      'Paese',
      'Corriere',
      'Tracking',
    ].join(',')

    const csvRows = orders.map((order) => {
      const shippingAddress = order.shipping_address as {
        street?: string
        city?: string
        postal_code?: string
        province?: string
        country?: string
      }

      const profiles = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles

      return [
        order.order_number,
        new Date(order.created_at).toLocaleDateString('it-IT'),
        order.status,
        profiles?.full_name || 'N/A',
        profiles?.email || 'N/A',
        order.subtotal.toFixed(2),
        order.shipping_cost.toFixed(2),
        order.tax_amount?.toFixed(2) || '0.00',
        order.discount_amount?.toFixed(2) || '0.00',
        order.total.toFixed(2),
        `"${shippingAddress?.street || 'N/A'}"`,
        shippingAddress?.city || 'N/A',
        shippingAddress?.postal_code || 'N/A',
        shippingAddress?.province || 'N/A',
        shippingAddress?.country || 'N/A',
        order.carrier || 'N/A',
        order.tracking_number || 'N/A',
      ].join(',')
    })

    const csv = [csvHeader, ...csvRows].join('\n')

    // Add UTF-8 BOM for Excel compatibility
    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ordini-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'export' },
      { status: 500 }
    )
  }
}
