// src/app/(auth)/register/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Registrati | Sound Wave Lab',
  description: 'Crea un account su Sound Wave Lab',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold">
                <span className="text-brand-gradient">
                  Sound Wave Lab
                </span>
              </h1>
            </Link>
            <p className="text-muted-foreground mt-2">
              Crea il tuo account
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Hai già un account? </span>
            <Link
              href="/login"
              className="text-brand-teal hover:text-brand-teal font-medium"
            >
              Accedi
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Torna al sito
          </Link>
        </div>
      </div>
    </div>
  )
}
