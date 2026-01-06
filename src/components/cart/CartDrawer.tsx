// src/components/cart/CartDrawer.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart-store'
import { CartItem } from './CartItem'

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, totalItems } = useCartStore()
  const sub = subtotal()
  const shippingCost = sub >= 50 ? 0 : 4.99
  const total = sub + shippingCost

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg px-4 sm:px-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrello ({totalItems()} articoli)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Il tuo carrello e vuoto</p>
            <Button asChild onClick={closeCart}>
              <Link href="/products">Esplora il catalogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 space-y-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotale</span>
                  <span>{'\u20AC'}{sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spedizione</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `\u20AC${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                {sub < 50 && sub > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Aggiungi {'\u20AC'}{(50 - sub).toFixed(2)} per la spedizione gratuita
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Totale</span>
                <span>{'\u20AC'}{total.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full h-12" onClick={closeCart}>
                <Link href="/checkout">Vai al checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
