// src/app/api/admin/stripe/status/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// SECURITY: Only expose safe, non-sensitive information about Stripe configuration
export async function GET() {
  try {
    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check environment variables (without exposing values)
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY &&
                         process.env.STRIPE_SECRET_KEY.length > 10 &&
                         process.env.STRIPE_SECRET_KEY.startsWith('sk_')

    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
                              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 10 &&
                              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')

    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET &&
                             process.env.STRIPE_WEBHOOK_SECRET.length > 10

    // Safe to expose: publishable key prefix and mode
    const publishableKeyPrefix = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 12) || null
    const isTestMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ?? true
    const isLiveMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') ?? false

    // Test Stripe connection if keys are configured
    let connectionStatus: 'connected' | 'error' | 'not_configured' = 'not_configured'
    let accountName: string | null = null
    let errorMessage: string | null = null

    if (hasSecretKey) {
      try {
        // Dynamically import Stripe only when needed
        const { stripe } = await import('@/lib/stripe/server')
        const account = await stripe.accounts.retrieve()
        connectionStatus = 'connected'
        accountName = account.business_profile?.name || account.email || 'Account Stripe'
      } catch (error) {
        connectionStatus = 'error'
        errorMessage = error instanceof Error ? error.message : 'Errore di connessione'
      }
    }

    return NextResponse.json({
      configuration: {
        hasSecretKey,
        hasPublishableKey,
        hasWebhookSecret,
        publishableKeyPrefix,
        isTestMode,
        isLiveMode,
      },
      connection: {
        status: connectionStatus,
        accountName,
        errorMessage,
      },
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error('Error checking Stripe status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
