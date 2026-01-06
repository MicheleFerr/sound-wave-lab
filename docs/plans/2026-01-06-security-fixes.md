# Security Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all security vulnerabilities identified in the security audit (CRITICAL, HIGH, MEDIUM, LOW severity).

**Architecture:** Server-side validation for all sensitive operations, rate limiting via Upstash Redis, security headers via Next.js config, input sanitization with regex validation, atomic database operations via Supabase RPC.

**Tech Stack:** Next.js 15, Supabase, Stripe, @upstash/ratelimit, Zod validation

**Sources:**
- [Upstash Rate Limiting](https://upstash.com/blog/nextjs-ratelimiting)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [CSS Injection Prevention](https://www.getastra.com/blog/knowledge-base/guide-on-css-injection-prevention/)
- [E-commerce Price Manipulation Prevention](https://www.sourcery.ai/vulnerabilities/price-manipulation-ecommerce)
- [Supabase RPC Increment](https://medium.com/geekculture/using-stored-procedures-rpc-in-supabase-to-increment-a-like-counter-9c5b2293a65b)

---

## Task 1: CRITICAL - Server-Side Price Validation in Checkout API

**Files:**
- Modify: `src/app/api/checkout/route.ts:54-100`

**Step 1: Add price validation against database**

Replace client-provided prices with server-fetched prices:

```typescript
// After line 56, add price validation
const variantIds = items.map(item => item.variantId)

// Fetch actual prices from database
const { data: variants, error: variantError } = await supabase
  .from('product_variants')
  .select('id, price, stock_quantity, is_active')
  .in('id', variantIds)

if (variantError || !variants || variants.length !== items.length) {
  return NextResponse.json(
    { error: 'Alcuni prodotti non sono più disponibili' },
    { status: 400 }
  )
}

// Create price map from database
const priceMap = new Map(variants.map(v => [v.id, { price: v.price, stock: v.stock_quantity, active: v.is_active }]))

// Validate all items are available and have correct prices
for (const item of items) {
  const dbVariant = priceMap.get(item.variantId)
  if (!dbVariant) {
    return NextResponse.json(
      { error: `Prodotto non trovato: ${item.productName}` },
      { status: 400 }
    )
  }
  if (!dbVariant.active) {
    return NextResponse.json(
      { error: `Prodotto non disponibile: ${item.productName}` },
      { status: 400 }
    )
  }
  if (dbVariant.stock < item.quantity) {
    return NextResponse.json(
      { error: `Quantità insufficiente per: ${item.productName}` },
      { status: 400 }
    )
  }
}

// Calculate totals using SERVER-SIDE prices (not client-provided)
const subtotalCents = items.reduce(
  (sum, item) => {
    const serverPrice = priceMap.get(item.variantId)!.price
    return sum + Math.round(serverPrice * 100) * item.quantity
  },
  0
)
```

**Step 2: Verify the checkout still works**

Run: `npm run build && npm run dev`
Test: Add items to cart, proceed to checkout, verify prices match database

**Step 3: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "fix(security): validate prices server-side to prevent manipulation"
```

---

## Task 2: CRITICAL - CSS Injection Sanitization in Theme Provider

**Files:**
- Modify: `src/components/theme/ThemeProvider.tsx`

**Step 1: Add validation functions and sanitize theme values**

Add at the top of the file (after imports):

```typescript
// Validation patterns for CSS values
const VALID_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/
const VALID_FONT_REGEX = /^[a-zA-Z0-9\s,'-]+$/
const VALID_TEXT_TRANSFORM = ['none', 'uppercase', 'lowercase', 'capitalize']

function sanitizeColor(value: string, fallback: string): string {
  return VALID_COLOR_REGEX.test(value) ? value : fallback
}

function sanitizeFont(value: string, fallback: string): string {
  return VALID_FONT_REGEX.test(value) ? value : fallback
}

function sanitizeTextTransform(value: string): string {
  return VALID_TEXT_TRANSFORM.includes(value) ? value : 'none'
}

function sanitizeNumber(value: number, min: number, max: number, fallback: number): number {
  const num = Number(value)
  if (isNaN(num) || num < min || num > max) return fallback
  return num
}
```

**Step 2: Apply sanitization to theme values**

Replace the `themeVars` assignment with sanitized values:

```typescript
const defaults = {
  font_primary: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_heading: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_mono: 'SF Mono, Monaco, Courier New, monospace',
  color_brand_primary: '#000000',
  color_brand_accent: '#FFFF00',
  color_brand_secondary: '#FF0000',
  color_background: '#FFFFFF',
  color_text: '#000000',
  text_transform: 'uppercase',
  letter_spacing_base: 0.02,
  letter_spacing_heading: 0.08,
  letter_spacing_button: 0.05,
  font_weight_heading: 700,
  font_weight_button: 600,
  border_radius: 2,
  border_width: 1,
}

// Sanitize all values from database
const themeVars = {
  font_primary: sanitizeFont(theme?.font_primary || '', defaults.font_primary),
  font_heading: sanitizeFont(theme?.font_heading || '', defaults.font_heading),
  font_mono: sanitizeFont(theme?.font_mono || '', defaults.font_mono),
  color_brand_primary: sanitizeColor(theme?.color_brand_primary || '', defaults.color_brand_primary),
  color_brand_accent: sanitizeColor(theme?.color_brand_accent || '', defaults.color_brand_accent),
  color_brand_secondary: sanitizeColor(theme?.color_brand_secondary || '', defaults.color_brand_secondary),
  color_background: sanitizeColor(theme?.color_background || '', defaults.color_background),
  color_text: sanitizeColor(theme?.color_text || '', defaults.color_text),
  text_transform: sanitizeTextTransform(theme?.text_transform || ''),
  letter_spacing_base: sanitizeNumber(theme?.letter_spacing_base ?? defaults.letter_spacing_base, 0, 1, defaults.letter_spacing_base),
  letter_spacing_heading: sanitizeNumber(theme?.letter_spacing_heading ?? defaults.letter_spacing_heading, 0, 1, defaults.letter_spacing_heading),
  letter_spacing_button: sanitizeNumber(theme?.letter_spacing_button ?? defaults.letter_spacing_button, 0, 1, defaults.letter_spacing_button),
  font_weight_heading: sanitizeNumber(theme?.font_weight_heading ?? defaults.font_weight_heading, 100, 900, defaults.font_weight_heading),
  font_weight_button: sanitizeNumber(theme?.font_weight_button ?? defaults.font_weight_button, 100, 900, defaults.font_weight_button),
  border_radius: sanitizeNumber(theme?.border_radius ?? defaults.border_radius, 0, 50, defaults.border_radius),
  border_width: sanitizeNumber(theme?.border_width ?? defaults.border_width, 0, 10, defaults.border_width),
}
```

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
git add src/components/theme/ThemeProvider.tsx
git commit -m "fix(security): sanitize theme CSS values to prevent injection"
```

---

## Task 3: HIGH - Add Rate Limiting to API Routes

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/api/coupons/validate/route.ts`
- Modify: `src/app/api/orders/[orderNumber]/route.ts`

**Step 1: Install Upstash Rate Limit package**

Run: `npm install @upstash/ratelimit @upstash/redis`

**Step 2: Create rate limit utility**

Create `src/lib/rate-limit.ts`:

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Use environment variables for Upstash Redis
// If not configured, rate limiting is disabled (for development)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Different rate limiters for different endpoints
export const checkoutRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 checkouts per minute
      analytics: true,
      prefix: 'ratelimit:checkout',
    })
  : null

export const couponRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 coupon validations per minute
      analytics: true,
      prefix: 'ratelimit:coupon',
    })
  : null

export const orderRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 order lookups per minute
      analytics: true,
      prefix: 'ratelimit:order',
    })
  : null

export async function checkRateLimit(
  request: NextRequest,
  limiter: Ratelimit | null
): Promise<NextResponse | null> {
  if (!limiter) return null // Rate limiting disabled

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ??
             request.headers.get('x-real-ip') ??
             '127.0.0.1'

  const { success, limit, remaining, reset } = await limiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Troppe richieste. Riprova tra qualche minuto.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  return null
}
```

**Step 3: Add rate limiting to checkout route**

Add at the beginning of the POST function in `src/app/api/checkout/route.ts`:

```typescript
import { checkoutRateLimiter, checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting check
  const rateLimitResponse = await checkRateLimit(request, checkoutRateLimiter)
  if (rateLimitResponse) return rateLimitResponse

  // ... rest of the function
}
```

**Step 4: Add rate limiting to coupon validation route**

Add to `src/app/api/coupons/validate/route.ts`:

```typescript
import { couponRateLimiter, checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting check
  const rateLimitResponse = await checkRateLimit(request, couponRateLimiter)
  if (rateLimitResponse) return rateLimitResponse

  // ... rest of the function
}
```

**Step 5: Add rate limiting to order route**

Add to `src/app/api/orders/[orderNumber]/route.ts`:

```typescript
import { orderRateLimiter, checkRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest, ...) {
  // Rate limiting check
  const rateLimitResponse = await checkRateLimit(request, orderRateLimiter)
  if (rateLimitResponse) return rateLimitResponse

  // ... rest of the function
}
```

**Step 6: Update .env.example**

Add to `.env.example`:
```
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

**Step 7: Verify build passes**

Run: `npm run build`

**Step 8: Commit**

```bash
git add src/lib/rate-limit.ts src/app/api/checkout/route.ts src/app/api/coupons/validate/route.ts src/app/api/orders/\[orderNumber\]/route.ts .env.example
git commit -m "feat(security): add rate limiting to API routes"
```

---

## Task 4: HIGH - Add Access Token for Guest Orders

**Files:**
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/api/orders/[orderNumber]/route.ts`
- Modify: `supabase/schema.sql` (or create migration)

**Step 1: Create migration for order access token**

Create `supabase/migrations/20260106_order_access_token.sql`:

```sql
-- Add access_token column for guest order verification
ALTER TABLE orders ADD COLUMN access_token TEXT;
CREATE INDEX idx_orders_access_token ON orders(access_token);
```

**Step 2: Generate access token in checkout**

Add to `src/app/api/checkout/route.ts` (add import and helper function):

```typescript
import { randomBytes } from 'crypto'

function generateAccessToken(): string {
  return randomBytes(32).toString('hex')
}
```

Then in the `createOrderInDatabase` function, add `access_token`:

```typescript
const accessToken = user ? null : generateAccessToken() // Only for guest orders

const { error: orderError } = await supabase.from('orders').insert({
  order_number: orderNumber,
  user_id: user?.id || null,
  access_token: accessToken, // Add this line
  // ... rest of fields
})
```

**Step 3: Include access token in success URL for guests**

For free orders, modify the redirect URL:

```typescript
// For guest free orders, include access token
const successUrl = user
  ? `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`
  : `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}&token=${accessToken}`
```

For Stripe sessions, add to metadata:

```typescript
metadata: {
  // ... existing metadata
  access_token: accessToken || '',
}
```

**Step 4: Verify access token in order API**

Modify `src/app/api/orders/[orderNumber]/route.ts`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const accessToken = request.nextUrl.searchParams.get('token')

    const supabase = await createClient()
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

    // Security: Verify access
    if (order.user_id) {
      // Logged-in user's order - verify ownership or admin
      if (!user) {
        return NextResponse.json(
          { error: 'Autenticazione richiesta' },
          { status: 401 }
        )
      }
      if (order.user_id !== user.id) {
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
      // Guest order - require valid access token
      if (!accessToken || order.access_token !== accessToken) {
        return NextResponse.json(
          { error: 'Token di accesso non valido' },
          { status: 403 }
        )
      }
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
```

**Step 5: Commit**

```bash
git add supabase/migrations/20260106_order_access_token.sql src/app/api/checkout/route.ts src/app/api/orders/\[orderNumber\]/route.ts
git commit -m "feat(security): add access token verification for guest orders"
```

---

## Task 5: MEDIUM - Add Security Headers

**Files:**
- Modify: `next.config.ts`

**Step 1: Add security headers configuration**

Replace content of `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    // Remove dangerouslyAllowSVG for security
    localPatterns: [
      {
        pathname: '/api/placeholder/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'fcfzxgvttqsslhijwjoy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(security): add security headers and remove dangerouslyAllowSVG"
```

---

## Task 6: MEDIUM - Stronger Password Validation

**Files:**
- Create: `src/lib/validation.ts`
- Modify: `src/components/auth/RegisterForm.tsx`

**Step 1: Create validation utilities with Zod**

Run: `npm install zod`

Create `src/lib/validation.ts`:

```typescript
// src/lib/validation.ts
import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'La password deve essere di almeno 8 caratteri')
  .regex(/[a-zA-Z]/, 'La password deve contenere almeno una lettera')
  .regex(/[0-9]/, 'La password deve contenere almeno un numero')
  .regex(/[^a-zA-Z0-9]/, 'La password deve contenere almeno un carattere speciale')

export const emailSchema = z
  .string()
  .email('Inserisci un indirizzo email valido')

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s-]{8,}$/, 'Inserisci un numero di telefono valido')

export const nameSchema = z
  .string()
  .min(2, 'Il nome deve essere di almeno 2 caratteri')
  .max(100, 'Il nome non può superare 100 caratteri')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Il nome contiene caratteri non validi')

export function validatePassword(password: string): { valid: boolean; error?: string } {
  const result = passwordSchema.safeParse(password)
  return result.success
    ? { valid: true }
    : { valid: false, error: result.error.errors[0]?.message }
}
```

**Step 2: Update RegisterForm to use Zod validation**

Modify `src/components/auth/RegisterForm.tsx`:

```typescript
import { validatePassword } from '@/lib/validation'

// In handleSubmit, replace password validation:
const passwordValidation = validatePassword(password)
if (!passwordValidation.valid) {
  setError(passwordValidation.error || 'Password non valida')
  setLoading(false)
  return
}
```

**Step 3: Add real-time password strength indicator (optional enhancement)**

Add to RegisterForm component:

```typescript
const [passwordStrength, setPasswordStrength] = useState<string[]>([])

const checkPasswordStrength = (pwd: string) => {
  const issues: string[] = []
  if (pwd.length < 8) issues.push('Almeno 8 caratteri')
  if (!/[a-zA-Z]/.test(pwd)) issues.push('Almeno una lettera')
  if (!/[0-9]/.test(pwd)) issues.push('Almeno un numero')
  if (!/[^a-zA-Z0-9]/.test(pwd)) issues.push('Almeno un carattere speciale')
  setPasswordStrength(issues)
}

// Call on password change:
onChange={(e) => {
  setPassword(e.target.value)
  checkPasswordStrength(e.target.value)
}}
```

**Step 4: Commit**

```bash
git add src/lib/validation.ts src/components/auth/RegisterForm.tsx package.json package-lock.json
git commit -m "feat(security): implement stronger password validation with Zod"
```

---

## Task 7: LOW - Atomic Coupon Increment with Supabase RPC

**Files:**
- Create: `supabase/migrations/20260106_atomic_coupon_increment.sql`
- Modify: `src/app/api/checkout/route.ts`

**Step 1: Create PostgreSQL function for atomic increment**

Create `supabase/migrations/20260106_atomic_coupon_increment.sql`:

```sql
-- Atomic increment function for coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = coupon_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO anon;
```

**Step 2: Use atomic increment in checkout**

Replace the coupon increment code in `src/app/api/checkout/route.ts`:

```typescript
// Update coupon usage atomically
if (coupon?.id) {
  await supabase.rpc('increment_coupon_usage', { coupon_id_param: coupon.id })
}
```

Remove the old non-atomic code:
```typescript
// DELETE THIS:
// const { data: currentCoupon } = await supabase
//   .from('coupons')
//   .select('current_uses')
//   .eq('id', coupon.id)
//   .single()
// if (currentCoupon) {
//   await supabase
//     .from('coupons')
//     .update({ current_uses: (currentCoupon.current_uses || 0) + 1 })
//     .eq('id', coupon.id)
// }
```

**Step 3: Commit**

```bash
git add supabase/migrations/20260106_atomic_coupon_increment.sql src/app/api/checkout/route.ts
git commit -m "fix(security): use atomic increment for coupon usage to prevent race conditions"
```

---

## Task 8: LOW - Input Sanitization on Profile

**Files:**
- Modify: `src/components/account/ProfileForm.tsx`
- Modify: `src/lib/validation.ts`

**Step 1: Add sanitization function**

Add to `src/lib/validation.ts`:

```typescript
// Sanitize user input - remove HTML and trim
export function sanitizeInput(value: string): string {
  return value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '')     // Remove angle brackets
    .trim()
}

export function sanitizePhone(value: string): string {
  // Keep only digits, +, -, spaces
  return value.replace(/[^\d+\-\s]/g, '').trim()
}
```

**Step 2: Apply sanitization in ProfileForm**

Modify `src/components/account/ProfileForm.tsx`:

```typescript
import { sanitizeInput, sanitizePhone } from '@/lib/validation'

// In handleSubmit:
const { error } = await supabase
  .from('profiles')
  .update({
    full_name: sanitizeInput(fullName),
    phone: sanitizePhone(phone),
    updated_at: new Date().toISOString(),
  })
  .eq('id', profile.id)
```

**Step 3: Commit**

```bash
git add src/lib/validation.ts src/components/account/ProfileForm.tsx
git commit -m "fix(security): sanitize user input in profile form"
```

---

## Summary

| Task | Severity | Description |
|------|----------|-------------|
| 1 | CRITICAL | Server-side price validation |
| 2 | CRITICAL | CSS injection sanitization |
| 3 | HIGH | Rate limiting on APIs |
| 4 | HIGH | Guest order access tokens |
| 5 | MEDIUM | Security headers |
| 6 | MEDIUM | Stronger password validation |
| 7 | LOW | Atomic coupon increment |
| 8 | LOW | Input sanitization |

**Total estimated tasks:** 8 main tasks with ~25 sub-steps

**Dependencies to install:**
- `@upstash/ratelimit`
- `@upstash/redis`
- `zod`

**Database migrations:**
- `20260106_order_access_token.sql`
- `20260106_atomic_coupon_increment.sql`
