// src/components/admin/CouponList.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2, Tag, Percent, Euro, Megaphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  is_active: boolean
  valid_from: string
  valid_until: string | null
  created_at: string
  banner_enabled: boolean
}

interface CouponListProps {
  coupons: Coupon[]
}

export function CouponList({ coupons }: CouponListProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: '',
    min_order_amount: '0',
    max_uses: '',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('coupons').insert({
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_active: true,
      })

      if (error) throw error

      setForm({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '0',
        max_uses: '',
      })
      setDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating coupon:', error)
      alert('Errore durante la creazione del coupon')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo coupon?')) return

    setDeleting(id)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('coupons').delete().eq('id', id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      alert('Errore durante l\'eliminazione del coupon')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', coupon.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error updating coupon:', error)
    }
  }

  const handleToggleBanner = async (coupon: Coupon) => {
    // Can only enable banner if coupon is active
    if (!coupon.is_active && !coupon.banner_enabled) {
      alert('Il coupon deve essere attivo per mostrarlo nel banner')
      return
    }

    try {
      const supabase = createClient()

      // If enabling this banner, first disable all others
      if (!coupon.banner_enabled) {
        await supabase
          .from('coupons')
          .update({ banner_enabled: false })
          .neq('id', coupon.id)
      }

      const { error } = await supabase
        .from('coupons')
        .update({ banner_enabled: !coupon.banner_enabled })
        .eq('id', coupon.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error updating banner:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-gradient hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Coupon</DialogTitle>
              <DialogDescription>
                Crea un nuovo codice sconto per i tuoi clienti
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Codice *</Label>
                <Input
                  id="code"
                  placeholder="ES: WELCOME10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Input
                  id="description"
                  placeholder="ES: Sconto benvenuto 10%"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo Sconto</Label>
                  <Select
                    value={form.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed_amount') =>
                      setForm({ ...form, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentuale (%)</SelectItem>
                      <SelectItem value="fixed_amount">Importo Fisso (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Valore {form.discount_type === 'percentage' ? '(%)' : '(€)'} *
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    max={form.discount_type === 'percentage' ? '100' : undefined}
                    placeholder={form.discount_type === 'percentage' ? '10' : '5.00'}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Ordine Minimo (€)</Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_uses">Utilizzi Massimi</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    placeholder="Illimitati"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={saving} className="bg-brand-gradient hover:opacity-90">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    'Crea Coupon'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessun coupon ancora creato</p>
          <p className="text-sm">Crea il tuo primo coupon per offrire sconti ai clienti</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codice</TableHead>
              <TableHead>Sconto</TableHead>
              <TableHead>Utilizzi</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead className="w-[100px]">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div>
                    <span className="font-mono font-semibold">{coupon.code}</span>
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground">{coupon.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {coupon.discount_type === 'percentage' ? (
                      <>
                        <Percent className="h-3 w-3" />
                        {coupon.discount_value}%
                      </>
                    ) : (
                      <>
                        <Euro className="h-3 w-3" />
                        {coupon.discount_value.toFixed(2)}
                      </>
                    )}
                  </div>
                  {coupon.min_order_amount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Min. €{coupon.min_order_amount.toFixed(2)}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {coupon.current_uses}
                  {coupon.max_uses && ` / ${coupon.max_uses}`}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={coupon.is_active ? 'default' : 'secondary'}
                    className={coupon.is_active ? 'bg-green-600' : ''}
                    onClick={() => handleToggleActive(coupon)}
                    style={{ cursor: 'pointer' }}
                  >
                    {coupon.is_active ? 'Attivo' : 'Disattivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleBanner(coupon)}
                    className={`p-2 rounded-md transition-colors ${
                      coupon.banner_enabled
                        ? 'bg-black text-white hover:bg-zinc-800'
                        : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600'
                    } ${!coupon.is_active ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!coupon.is_active && !coupon.banner_enabled}
                    title={coupon.banner_enabled ? 'Rimuovi dal banner' : 'Mostra nel banner'}
                  >
                    <Megaphone className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(coupon.id)}
                    disabled={deleting === coupon.id}
                  >
                    {deleting === coupon.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
