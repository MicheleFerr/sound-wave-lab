// src/components/admin/OrderFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Filter } from 'lucide-react'
import { OrderStatus } from '@/types/order'
import { useState, useEffect } from 'react'

const statusOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'pending', label: 'In attesa di pagamento' },
  { value: 'paid', label: 'Pagato' },
  { value: 'processing', label: 'In lavorazione' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
  { value: 'refunded', label: 'Rimborsato' },
]

export function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '')

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (status && status !== 'all') params.set('status', status)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)

    const queryString = params.toString()
    router.push(`/admin/ordini${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setDateFrom('')
    setDateTo('')
    router.push('/admin/ordini')
  }

  const hasActiveFilters = search || (status && status !== 'all') || dateFrom || dateTo

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filtri</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Cancella filtri
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Cerca</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Numero ordine, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
              className="pl-8"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Data da</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Data a</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={updateFilters} size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Applica filtri
        </Button>
      </div>
    </div>
  )
}
