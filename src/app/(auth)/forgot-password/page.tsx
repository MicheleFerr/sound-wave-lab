// src/app/(auth)/forgot-password/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Password dimenticata | Sound Wave Lab',
  description: 'Recupera la password del tuo account',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-grey flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-sm">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna al login
          </Link>

          <h1 className="text-2xl font-bold mb-2">Password dimenticata?</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Inserisci la tua email e ti invieremo un link per reimpostare la password.
          </p>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
