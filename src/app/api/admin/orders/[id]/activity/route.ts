// src/app/api/admin/orders/[id]/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Check if user is admin or order owner
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // Verify order access
    if (!isAdmin) {
      const { data: order } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', id)
        .single()

      if (!order || order.user_id !== user.id) {
        return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
      }
    }

    // Fetch activity log with performer details
    const { data: activities, error } = await supabaseAdmin
      .from('order_activity_log')
      .select(`
        *,
        performed_by_profile:profiles!performed_by(
          id,
          full_name,
          email
        )
      `)
      .eq('order_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching activity log:', error)
      return NextResponse.json(
        { error: 'Errore durante il recupero del log attività' },
        { status: 500 }
      )
    }

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Error in GET /api/admin/orders/[id]/activity:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero del log attività' },
      { status: 500 }
    )
  }
}
