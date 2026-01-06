// src/components/products/ProductFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  currentCategory?: string
  currentSort?: string
  currentSearch?: string
  productCount: number
}

const sortOptions = [
  { value: 'featured', label: 'IN EVIDENZA' },
  { value: 'newest', label: 'PIÙ RECENTI' },
  { value: 'name', label: 'NOME A-Z' },
  { value: 'price-asc', label: 'PREZZO CRESCENTE' },
  { value: 'price-desc', label: 'PREZZO DECRESCENTE' },
]

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
  productCount,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch || '')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleCategoryChange = (slug: string) => {
    router.push(`/products?${createQueryString('category', slug === 'all' ? '' : slug)}`)
    setMobileFiltersOpen(false)
  }

  const handleSortChange = (value: string) => {
    router.push(`/products?${createQueryString('sort', value === 'featured' ? '' : value)}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/products?${createQueryString('search', searchValue)}`)
  }

  const clearFilters = () => {
    router.push('/products')
    setSearchValue('')
  }

  const hasActiveFilters = currentCategory || currentSort || currentSearch

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-label-caps text-[10px] tracking-wider mb-3">CATEGORIE</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('all')}
            className={`text-xs font-bold uppercase tracking-wider ${!currentCategory ? 'bg-brand-gradient border-0' : ''}`}
          >
            TUTTE
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={currentCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`text-xs font-bold uppercase tracking-wider ${currentCategory === cat.slug ? 'bg-brand-gradient border-0' : ''}`}
            >
              {cat.name.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="CERCA PRODOTTI..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 text-xs tracking-wide uppercase"
            />
          </form>

          {/* Category Buttons */}
          <div className="flex gap-2">
            <Button
              variant={!currentCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className={`text-xs font-bold uppercase tracking-wider ${!currentCategory ? 'bg-brand-gradient border-0' : ''}`}
            >
              TUTTE
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={currentCategory === cat.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`text-xs font-bold uppercase tracking-wider ${currentCategory === cat.slug ? 'bg-brand-gradient border-0' : ''}`}
              >
                {cat.name.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <Select value={currentSort || 'featured'} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordina per" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden space-y-4">
        <div className="flex gap-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="CERCA..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 text-xs tracking-wide uppercase"
            />
          </form>

          {/* Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-heading-minimal text-base tracking-wider">FILTRI</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Sort */}
          <Select value={currentSort || 'featured'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordina" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <>
              {currentCategory && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.slug === currentCategory)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategoryChange('all')}
                  />
                </Badge>
              )}
              {currentSearch && (
                <Badge variant="secondary" className="gap-1">
                  &quot;{currentSearch}&quot;
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchValue('')
                      router.push(`/products?${createQueryString('search', '')}`)
                    }}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs font-bold uppercase tracking-wider opacity-70"
              >
                CANCELLA FILTRI
              </Button>
            </>
          )}
        </div>
        <p className="text-xs tracking-wide opacity-70 uppercase">
          {productCount} {productCount === 1 ? 'PRODOTTO' : 'PRODOTTI'}
        </p>
      </div>
    </div>
  )
}
