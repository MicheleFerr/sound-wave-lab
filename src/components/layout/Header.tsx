// src/components/layout/Header.tsx
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartIcon } from './CartIcon'
import { UserMenu } from './UserMenu'
import { HeaderLogo, MobileLogo } from './SiteLogo'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          {/* Desktop Logo */}
          <div className="hidden md:block">
            <HeaderLogo width={130} height={38} />
          </div>
          {/* Mobile Logo */}
          <div className="block md:hidden">
            <MobileLogo width={90} height={28} />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Catalogo
          </Link>
          <Link href="/products?category=synth" className="text-sm font-medium hover:text-primary transition-colors">
            Synth
          </Link>
          <Link href="/products?category=dj" className="text-sm font-medium hover:text-primary transition-colors">
            DJ
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
            <Link href="/search" aria-label="Cerca">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <CartIcon />
          <UserMenu
            user={user ? {
              email: user.email!,
              isAdmin: profile?.role === 'admin'
            } : null}
          />
        </div>
      </div>
    </header>
  )
}
