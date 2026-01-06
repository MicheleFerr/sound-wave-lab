// src/lib/rate-limit.ts
// SECURITY: Rate limiting utility using Upstash Redis
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
  if (!limiter) return null // Rate limiting disabled (no Redis configured)

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
