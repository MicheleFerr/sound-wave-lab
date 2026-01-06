// src/components/account/ChangePasswordForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { validatePassword, getPasswordStrengthHints } from '@/lib/validation'

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordHints, setPasswordHints] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Le nuove password non corrispondono')
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Password non valida')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // First verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        setError('Sessione non valida')
        setLoading(false)
        return
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        setError('Password attuale non corretta')
        setLoading(false)
        return
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordHints([])

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      setError('Errore durante l\'aggiornamento della password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Password aggiornata con successo!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Password attuale</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nuova password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setPasswordHints(getPasswordStrengthHints(e.target.value))
            }}
            className="pl-10"
            required
          />
        </div>
        {newPassword && passwordHints.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">La password deve avere:</p>
            <ul className="list-disc list-inside">
              {passwordHints.map((hint, i) => (
                <li key={i} className="text-amber-600">{hint}</li>
              ))}
            </ul>
          </div>
        )}
        {newPassword && passwordHints.length === 0 && (
          <p className="text-xs text-green-600">Password valida</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma nuova password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="bg-brand-gradient bg-brand-gradient-hover !text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aggiornamento...
          </>
        ) : (
          'Cambia password'
        )}
      </Button>
    </form>
  )
}
