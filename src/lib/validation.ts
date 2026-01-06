// src/lib/validation.ts
// SECURITY: Centralized validation utilities using Zod
import { z } from 'zod'

// Password validation schema - stronger policy
export const passwordSchema = z
  .string()
  .min(8, 'La password deve essere di almeno 8 caratteri')
  .regex(/[a-zA-Z]/, 'La password deve contenere almeno una lettera')
  .regex(/[0-9]/, 'La password deve contenere almeno un numero')
  .regex(/[^a-zA-Z0-9]/, 'La password deve contenere almeno un carattere speciale (!@#$%^&*)')

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

// Helper function for password validation
export function validatePassword(password: string): { valid: boolean; error?: string } {
  const result = passwordSchema.safeParse(password)
  return result.success
    ? { valid: true }
    : { valid: false, error: result.error.issues[0]?.message }
}

// Helper function to get password strength hints
export function getPasswordStrengthHints(password: string): string[] {
  const hints: string[] = []
  if (password.length < 8) hints.push('Almeno 8 caratteri')
  if (!/[a-zA-Z]/.test(password)) hints.push('Almeno una lettera')
  if (!/[0-9]/.test(password)) hints.push('Almeno un numero')
  if (!/[^a-zA-Z0-9]/.test(password)) hints.push('Almeno un carattere speciale')
  return hints
}

// SECURITY: Sanitize user input - remove HTML and dangerous characters
export function sanitizeInput(value: string): string {
  if (!value || typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .replace(/[<>]/g, '')      // Remove angle brackets
    .trim()
}

// Sanitize phone number - keep only valid characters
export function sanitizePhone(value: string): string {
  if (!value || typeof value !== 'string') return ''
  return value.replace(/[^\d+\-\s()]/g, '').trim()
}
