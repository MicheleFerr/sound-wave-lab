// src/components/search/SearchForm.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface SearchFormProps {
  initialQuery?: string
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      } else {
        router.push('/search')
      }
    },
    [query, router]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    router.push('/search')
  }, [router])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca prodotti..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg" className="bg-brand-gradient hover:opacity-90 !text-white">
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Cerca</span>
        </Button>
      </div>
    </form>
  )
}
