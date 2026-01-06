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
      <SheetContent className="flex flex-col w-full sm:max-w-lg px-4 sm:px-6 border-l-2 border-pure-black">
        <SheetHeader className="border-b border-pure-black pb-4">
          <SheetTitle className="text-heading-minimal text-sm tracking-widest">
            CARRELLO ({String(totalItems()).padStart(2, '0')} ARTICOLI)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="border-2 border-pure-black p-6 rounded-sm">
              <ShoppingBag className="h-12 w-12" strokeWidth={1.5} />
            </div>
            <p className="text-label-caps text-xs">IL TUO CARRELLO È VUOTO</p>
            <Button asChild onClick={closeCart} className="btn-filled px-8 py-3">
              <Link href="/products">ESPLORA PRODOTTI</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="divide-y divide-pure-black/20">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="py-6 space-y-4 border-t-2 border-pure-black">
              <div className="space-y-3">
                <div className="flex justify-between text-label-caps text-[10px]">
                  <span>SUBTOTALE</span>
                  <span className="text-price-mono">€{sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-label-caps text-[10px]">
                  <span>SPEDIZIONE</span>
                  <span className="text-price-mono">
                    {shippingCost === 0 ? (
                      <span>GRATIS</span>
                    ) : (
                      `€${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                {sub < 50 && sub > 0 && (
                  <p className="text-[9px] tracking-wide uppercase pt-1 opacity-60">
                    Aggiungi €{(50 - sub).toFixed(2)} per la spedizione gratuita
                  </p>
                )}
              </div>
              <Separator className="bg-pure-black/20" />
              <div className="flex justify-between text-heading-minimal text-sm pt-2">
                <span>TOTALE</span>
                <span className="text-price-mono">€{total.toFixed(2)}</span>
              </div>
              <Button asChild className="btn-filled w-full h-12 text-xs mt-4" onClick={closeCart}>
                <Link href="/checkout">VAI AL CHECKOUT</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
