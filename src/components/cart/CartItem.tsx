// src/components/cart/CartItem.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const attributeString = Object.values(item.attributes).join(' / ')

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link href={`/products/${item.productSlug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium hover:underline line-clamp-1"
            >
              {item.productName}
            </Link>
            <p className="text-sm text-muted-foreground">{attributeString}</p>
          </div>
          <p className="font-medium">
            {'\u20AC'}{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              aria-label="Diminuisci quantita"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              aria-label="Aumenta quantita"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.variantId)}
            aria-label="Rimuovi"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
