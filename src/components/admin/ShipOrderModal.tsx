'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Truck } from 'lucide-react'

interface ShipOrderModalProps {
  orderId: string
  orderNumber: string
  onShipped?: () => void
}

const CARRIERS = [
  { value: 'SDA', label: 'SDA / Poste Italiane' },
  { value: 'DHL', label: 'DHL' },
  { value: 'UPS', label: 'UPS' },
  { value: 'GLS', label: 'GLS' },
  { value: 'BRT', label: 'BRT / Bartolini' },
  { value: 'Altro', label: 'Altro' },
]

export function ShipOrderModal({
  orderId,
  orderNumber,
  onShipped,
}: ShipOrderModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!carrier || !trackingNumber) {
      setError('Compila tutti i campi obbligatori')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          trackingNumber,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Errore durante la spedizione')
      }

      setOpen(false)
      setCarrier('')
      setTrackingNumber('')
      onShipped?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante la spedizione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Truck className="h-4 w-4" />
        Spedisci
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Spedisci Ordine #{orderNumber}</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli della spedizione
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-950 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="carrier">Corriere *</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Seleziona corriere" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Numero Tracking *</Label>
              <Input
                id="trackingNumber"
                placeholder="Es: 123456789"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Il link di tracciamento verrà generato automaticamente in base al corriere
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Spedizione in corso...' : 'Conferma Spedizione'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
