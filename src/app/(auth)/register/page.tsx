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
    <div className="min-h-screen flex items-center justify-center bg-pure-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-pure-black/10 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-heading-minimal text-xl">
                SOUND WAVE LAB
              </h1>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
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
              className="text-pure-black hover:underline font-medium"
            >
              Accedi
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            ← Torna al sito
          </Link>
        </div>
      </div>
    </div>
  )
}
