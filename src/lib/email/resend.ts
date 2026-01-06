// src/lib/email/resend.ts
import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set - emails will not be sent')
    return null
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }

  return resendInstance
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Sound Wave Lab <noreply@soundwavelab.it>'
