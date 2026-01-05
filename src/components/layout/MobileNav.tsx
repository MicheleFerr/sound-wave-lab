// src/components/layout/MobileNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Grid3X3, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Cerca' },
  { href: '/products', icon: Grid3X3, label: 'Catalogo' },
  { href: '/cart', icon: ShoppingBag, label: 'Carrello', showBadge: true },
  { href: '/account', icon: User, label: 'Account' },
]

export function MobileNav() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.totalItems())

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label, showBadge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] min-h-[48px] text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {showBadge && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {totalItems > 99 ? '99' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
