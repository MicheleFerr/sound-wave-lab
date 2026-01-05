// src/components/layout/CartIcon.tsx
'use client'

import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

export function CartIcon() {
  const { toggleCart, totalItems } = useCartStore()
  const count = totalItems()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label={`Carrello (${count} articoli)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  )
}
