// src/lib/email/send.ts
import { getResend, EMAIL_FROM } from './resend'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation'
import { OrderShippedEmail } from '@/emails/OrderShipped'
import { WelcomeEmail } from '@/emails/Welcome'

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: {
    name: string
    quantity: number
    price: number
    attributes?: Record<string, string>
  }[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  total: number
  shippingAddress: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
}

export interface ShippingEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  trackingNumber: string
  carrier: string
}

export interface WelcomeEmailData {
  customerName: string
  customerEmail: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const resend = getResend()
  if (!resend) {
    console.log('Skipping email - RESEND_API_KEY not set')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `Conferma ordine #${data.orderNumber} - Sound Wave Lab`,
      react: OrderConfirmationEmail(data),
    })

    console.log('Order confirmation email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendOrderShippedEmail(data: ShippingEmailData) {
  const resend = getResend()
  if (!resend) {
    console.log('Skipping email - RESEND_API_KEY not set')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `Il tuo ordine #${data.orderNumber} è stato spedito! - Sound Wave Lab`,
      react: OrderShippedEmail(data),
    })

    console.log('Order shipped email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send order shipped email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const resend = getResend()
  if (!resend) {
    console.log('Skipping email - RESEND_API_KEY not set')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `Benvenuto in Sound Wave Lab!`,
      react: WelcomeEmail(data),
    })

    console.log('Welcome email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}
