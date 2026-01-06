// src/app/api/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { orderRateLimiter, checkRateLimit } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  // SECURITY: Rate limiting check
  const rateLimitResponse = await checkRateLimit(request, orderRateLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { orderNumber } = await params
    const accessToken = request.nextUrl.searchParams.get('token')

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

    // SECURITY: Verify access based on order ownership
    if (order.user_id) {
      // Logged-in user's order - verify ownership or admin role
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
    } else {
      // SECURITY: Guest order - require valid access token to prevent enumeration
      if (order.access_token) {
        // Order has an access token, must match
        if (!accessToken || order.access_token !== accessToken) {
          return NextResponse.json(
            { error: 'Token di accesso non valido' },
            { status: 403 }
          )
        }
      }
      // Legacy orders without access_token remain accessible (backwards compatibility)
      // New guest orders will always have an access_token
    }

    // Remove access_token from response for security
    const { access_token: _, ...safeOrder } = order

    return NextResponse.json(safeOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'ordine' },
      { status: 500 }
    )
  }
}
