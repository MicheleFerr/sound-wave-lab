/**
 * Typed environment variable access
 * Provides type-safe access to environment variables with runtime validation
 */

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
} as const

// Server-only environment variables (never exposed to client)
export const serverEnv = {
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
} as const

/**
 * Validates that all required environment variables are set
 * Call this at application startup in development
 */
export function validateEnv(): void {
  const requiredClientVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ] as const

  const requiredServerVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ] as const

  const missingVars: string[] = []

  for (const varName of requiredClientVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  // Only check server vars on server-side
  if (typeof window === 'undefined') {
    for (const varName of requiredServerVars) {
      if (!process.env[varName]) {
        missingVars.push(varName)
      }
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env.local file.`
    )
  }
}
