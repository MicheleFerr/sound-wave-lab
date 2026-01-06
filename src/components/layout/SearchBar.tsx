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

      {/* Search Bar - Integrated with Header */}
      <div
        className={`
          fixed inset-x-0 top-[56px] md:top-[64px] z-40
          origin-top
          transition-all duration-200 ease-out
          ${isOpen
            ? 'opacity-100 scale-y-100'
            : 'opacity-0 scale-y-0 pointer-events-none'
          }
        `}
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <div className="bg-background w-screen border-b">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center h-12 px-4 gap-3">
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
