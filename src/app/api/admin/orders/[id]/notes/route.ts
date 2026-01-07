// src/app/api/admin/orders/[id]/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { OrderNoteType } from '@/types/order'

// GET - Fetch all notes for an order
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch notes - admins see all, customers only see customer-facing notes
    const query = supabaseAdmin
      .from('order_notes')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false })

    if (!isAdmin) {
      query.eq('note_type', 'customer')
    }

    const { data: notes, error } = await query

    if (error) {
      console.error('Error fetching notes:', error)
      return NextResponse.json(
        { error: 'Errore durante il recupero delle note' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Error in GET /api/admin/orders/[id]/notes:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero delle note' },
      { status: 500 }
    )
  }
}

// POST - Create a new note
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
    const { content, noteType, notifyCustomer } = body as {
      content: string
      noteType: OrderNoteType
      notifyCustomer?: boolean
    }

    if (!content || !noteType) {
      return NextResponse.json(
        { error: 'Content e noteType sono obbligatori' },
        { status: 400 }
      )
    }

    if (noteType !== 'internal' && noteType !== 'customer') {
      return NextResponse.json(
        { error: 'noteType deve essere "internal" o "customer"' },
        { status: 400 }
      )
    }

    // Get order details for activity log
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .eq('id', id)
      .single()

    // Create note
    const { data: note, error: noteError } = await supabaseAdmin
      .from('order_notes')
      .insert({
        order_id: id,
        created_by: user.id,
        note_type: noteType,
        content: content,
      })
      .select()
      .single()

    if (noteError) {
      console.error('Error creating note:', noteError)
      return NextResponse.json(
        { error: 'Errore durante la creazione della nota' },
        { status: 500 }
      )
    }

    // Log activity
    await supabaseAdmin
      .from('order_activity_log')
      .insert({
        order_id: id,
        performed_by: user.id,
        action_type: 'note_added',
        new_value: { note_type: noteType, content_preview: content.substring(0, 100) },
        metadata: {
          order_number: order?.order_number,
          note_id: note.id,
        },
      })

    // TODO: If noteType is 'customer' and notifyCustomer is true, send email
    if (noteType === 'customer' && notifyCustomer) {
      // Implementation for sending email notification
      console.log('TODO: Send email notification to customer')
    }

    return NextResponse.json({
      success: true,
      note
    })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione della nota' },
      { status: 500 }
    )
  }
}
