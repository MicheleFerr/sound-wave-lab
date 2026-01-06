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

      {/* Search Bar Overlay */}
      <div
        className={`
          absolute left-0 right-0 top-full z-50
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }
        `}
      >
        <div className="bg-background border-b shadow-sm">
          <form onSubmit={handleSubmit} className="container mx-auto px-4">
            <div className="flex items-center h-14 gap-3">
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
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Chiudi ricerca"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Animated bottom line */}
            <div
              className={`
                h-px bg-foreground/20 transition-all duration-700 ease-out
                ${isOpen ? 'w-full' : 'w-0'}
              `}
            />
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
