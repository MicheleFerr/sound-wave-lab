// src/components/layout/CartIcon.tsx
'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

export function CartIcon() {
  const [mounted, setMounted] = useState(false)
  const { toggleCart, totalItems } = useCartStore()
  const count = totalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label={`Carrello (${mounted ? count : 0} articoli)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  )
}
