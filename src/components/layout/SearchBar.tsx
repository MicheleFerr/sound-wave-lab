// src/components/layout/SearchBar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* Search Toggle Button - hidden when search is open */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="Cerca"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}

      {/* Search Bar Overlay - Full Width like Off-White */}
      <div
        className={`
          fixed left-0 right-0 top-[57px] md:top-[65px] z-50
          transition-all duration-300 ease-out
          ${isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1 pointer-events-none'
          }
        `}
      >
        <div className="bg-background">
          <form onSubmit={handleSubmit} className="px-4 md:px-6">
            <div className="flex items-center h-12 gap-3">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={handleClose}
                className="p-1 hover:opacity-60 transition-opacity"
                aria-label="Chiudi ricerca"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Bottom line - full width */}
            <div className="h-px bg-foreground/20" />
          </form>
        </div>
      </div>

      {/* Backdrop to close on click outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/5"
          onClick={handleClose}
        />
      )}
    </>
  )
}
