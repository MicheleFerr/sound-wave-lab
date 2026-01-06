'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Shield,
  Key,
  Webhook,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'

interface StripeStatus {
  configuration: {
    hasSecretKey: boolean
    hasPublishableKey: boolean
    hasWebhookSecret: boolean
    publishableKeyPrefix: string | null
    isTestMode: boolean
    isLiveMode: boolean
  }
  connection: {
    status: 'connected' | 'error' | 'not_configured'
    accountName: string | null
    errorMessage: string | null
  }
  environment: string
}

export default function AdminStripePage() {
  const [status, setStatus] = useState<StripeStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/stripe/status')
      if (!response.ok) {
        throw new Error('Errore nel recupero dello stato')
      }
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusIcon = (configured: boolean) => {
    return configured ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getConnectionBadge = () => {
    if (!status) return null

    switch (status.connection.status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Connesso</Badge>
      case 'error':
        return <Badge variant="destructive">Errore</Badge>
      case 'not_configured':
        return <Badge variant="secondary">Non configurato</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Stripe</h1>
          <p className="text-muted-foreground">Configurazione pagamenti</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const allConfigured = status?.configuration.hasSecretKey &&
                        status?.configuration.hasPublishableKey

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stripe</h1>
          <p className="text-muted-foreground">
            Stato della configurazione pagamenti
          </p>
        </div>
        <Button variant="outline" onClick={fetchStatus} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Aggiorna
        </Button>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                status?.connection.status === 'connected'
                  ? 'bg-green-100'
                  : status?.connection.status === 'error'
                  ? 'bg-red-100'
                  : 'bg-zinc-100'
              }`}>
                <CreditCard className={`h-6 w-6 ${
                  status?.connection.status === 'connected'
                    ? 'text-green-600'
                    : status?.connection.status === 'error'
                    ? 'text-red-600'
                    : 'text-zinc-500'
                }`} />
              </div>
              <div>
                <CardTitle>Stato Connessione</CardTitle>
                <CardDescription>
                  {status?.connection.accountName || 'Account Stripe'}
                </CardDescription>
              </div>
            </div>
            {getConnectionBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {status?.connection.status === 'connected' && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>Stripe è configurato correttamente e pronto per accettare pagamenti</span>
            </div>
          )}
          {status?.connection.status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{status.connection.errorMessage}</span>
            </div>
          )}
          {status?.connection.status === 'not_configured' && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>Le chiavi Stripe non sono configurate. Configura le variabili d&apos;ambiente per abilitare i pagamenti.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configurazione Chiavi
          </CardTitle>
          <CardDescription>
            Stato delle variabili d&apos;ambiente Stripe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {/* Secret Key */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status?.configuration.hasSecretKey ?? false)}
                <div>
                  <p className="font-medium text-sm">STRIPE_SECRET_KEY</p>
                  <p className="text-xs text-muted-foreground">Chiave segreta (server-side)</p>
                </div>
              </div>
              <Badge variant={status?.configuration.hasSecretKey ? 'default' : 'secondary'}>
                {status?.configuration.hasSecretKey ? 'Configurata' : 'Mancante'}
              </Badge>
            </div>

            {/* Publishable Key */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status?.configuration.hasPublishableKey ?? false)}
                <div>
                  <p className="font-medium text-sm">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</p>
                  <p className="text-xs text-muted-foreground">
                    Chiave pubblica: {status?.configuration.publishableKeyPrefix || 'N/A'}...
                  </p>
                </div>
              </div>
              <Badge variant={status?.configuration.hasPublishableKey ? 'default' : 'secondary'}>
                {status?.configuration.hasPublishableKey ? 'Configurata' : 'Mancante'}
              </Badge>
            </div>

            {/* Webhook Secret */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center gap-3">
                {status?.configuration.hasWebhookSecret ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="font-medium text-sm">STRIPE_WEBHOOK_SECRET</p>
                  <p className="text-xs text-muted-foreground">Per verificare webhook (opzionale in dev)</p>
                </div>
              </div>
              <Badge variant={status?.configuration.hasWebhookSecret ? 'default' : 'outline'}>
                {status?.configuration.hasWebhookSecret ? 'Configurata' : 'Opzionale'}
              </Badge>
            </div>
          </div>

          {/* Mode Badge */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Modalità:</span>
            {status?.configuration.isTestMode && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Test Mode
              </Badge>
            )}
            {status?.configuration.isLiveMode && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live Mode
              </Badge>
            )}
            {!status?.configuration.hasPublishableKey && (
              <Badge variant="secondary">Non configurata</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Sicurezza
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-3">
          <p>
            Le chiavi Stripe sono gestite in modo sicuro tramite variabili d&apos;ambiente.
            Per motivi di sicurezza, le chiavi non possono essere modificate da questa interfaccia.
          </p>
          <p>
            <strong>Per configurare o modificare le chiavi:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>In locale: modifica il file <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
            <li>Su Vercel: usa la dashboard nelle impostazioni del progetto</li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Link Utili</CardTitle>
          <CardDescription>Accedi rapidamente alle risorse Stripe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            <Button variant="outline" asChild className="justify-start">
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Key className="h-4 w-4 mr-2" />
                API Keys
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a
                href="https://dashboard.stripe.com/webhooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Webhook className="h-4 w-4 mr-2" />
                Webhooks
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a
                href="https://dashboard.stripe.com/payments"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagamenti
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a
                href="https://dashboard.stripe.com/test/logs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Logs
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Template */}
      {!allConfigured && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="h-5 w-5" />
              Configurazione Richiesta
            </CardTitle>
            <CardDescription className="text-amber-800">
              Aggiungi queste variabili al tuo file .env.local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg text-sm overflow-x-auto">
{`# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Opzionale in dev`}
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(`# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."`)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
