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
      <SheetContent className="flex flex-col w-full sm:max-w-lg px-4 sm:px-6 border-l-2 border-offwhite-black">
        <SheetHeader className="border-b border-offwhite-black pb-4">
          <SheetTitle className="offwhite-title text-sm tracking-widest">
            SHOPPING BAG ({String(totalItems()).padStart(2, '0')} ITEMS)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="border-2 border-offwhite-black p-6 rounded-sm">
              <ShoppingBag className="h-12 w-12" strokeWidth={1.5} />
            </div>
            <p className="offwhite-label text-xs">YOUR CART IS EMPTY</p>
            <Button asChild onClick={closeCart} className="offwhite-button-filled px-8 py-3">
              <Link href="/products">EXPLORE PRODUCTS</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="divide-y divide-offwhite-black/20">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="py-6 space-y-4 border-t-2 border-offwhite-black">
              <div className="space-y-3">
                <div className="flex justify-between offwhite-label text-[10px]">
                  <span>SUBTOTAL</span>
                  <span className="offwhite-price">EUR {sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between offwhite-label text-[10px]">
                  <span>SHIPPING</span>
                  <span className="offwhite-price">
                    {shippingCost === 0 ? (
                      <span>FREE</span>
                    ) : (
                      `EUR ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                {sub < 50 && sub > 0 && (
                  <p className="text-[9px] tracking-wide uppercase pt-1 opacity-60">
                    Add EUR {(50 - sub).toFixed(2)} for free shipping
                  </p>
                )}
              </div>
              <Separator className="bg-offwhite-black/20" />
              <div className="flex justify-between offwhite-title text-sm pt-2">
                <span>TOTAL</span>
                <span className="offwhite-price">EUR {total.toFixed(2)}</span>
              </div>
              <Button asChild className="offwhite-button-filled w-full h-12 text-xs mt-4" onClick={closeCart}>
                <Link href="/checkout">PROCEED TO CHECKOUT</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
