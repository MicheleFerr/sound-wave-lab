// src/app/(account)/account/page.tsx
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileForm } from '@/components/account/ProfileForm'

export const metadata: Metadata = {
  title: 'Il mio account | Sound Wave Lab',
  description: 'Gestisci il tuo profilo e le tue informazioni personali',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Il mio profilo</h1>
        <p className="text-muted-foreground">
          Gestisci le tue informazioni personali
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informazioni personali</CardTitle>
          <CardDescription>
            Aggiorna i tuoi dati personali
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={{
              id: user.id,
              email: user.email || '',
              full_name: profile?.full_name || '',
              phone: profile?.phone || '',
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sicurezza</CardTitle>
          <CardDescription>
            Gestisci la sicurezza del tuo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Per cambiare la password, usa la funzione &quot;Password dimenticata&quot; nella pagina di login.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
