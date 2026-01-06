// src/app/(auth)/reset-password/page.tsx
import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reimposta password | Sound Wave Lab',
  description: 'Crea una nuova password per il tuo account',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-grey flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Crea nuova password</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Inserisci la tua nuova password. Assicurati che sia sicura.
          </p>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
