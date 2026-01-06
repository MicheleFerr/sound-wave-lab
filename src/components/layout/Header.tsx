// src/components/layout/Header.tsx
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartIcon } from './CartIcon'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from './ThemeToggle'
import { HeaderLogo, MobileLogo } from './SiteLogo'
import { createClient } from '@/lib/supabase/server'

interface NavLink {
  text: string
  url: string
}

async function getHeaderSettings() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('category', 'header')

  const navLinks: NavLink[] = []
  let announcement = ''
  let darkModeEnabled = true // Default to true if setting doesn't exist

  settings?.forEach(setting => {
    if (setting.key === 'header_nav_links' && Array.isArray(setting.value)) {
      navLinks.push(...setting.value as NavLink[])
    }
    if (setting.key === 'header_announcement' && typeof setting.value === 'string') {
      announcement = setting.value
    }
    if (setting.key === 'header_dark_mode_enabled') {
      darkModeEnabled = Boolean(setting.value)
    }
  })

  // Default links if none configured
  if (navLinks.length === 0) {
    navLinks.push(
      { text: 'Catalogo', url: '/products' },
      { text: 'Novità', url: '/products?sort=newest' },
      { text: 'Chi Siamo', url: '/chi-siamo' }
    )
  }

  return { navLinks, announcement, darkModeEnabled }
}

export async function Header() {
  const supabase = await createClient()
  const [{ data: { user } }, headerSettings] = await Promise.all([
    supabase.auth.getUser(),
    getHeaderSettings()
  ])

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const { navLinks, announcement, darkModeEnabled } = headerSettings

  return (
    <>
      {/* Announcement Banner */}
      {announcement && (
        <div className="bg-brand-gradient text-white text-center py-2 px-4 text-sm font-medium">
          {announcement}
        </div>
      )}

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
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </nav>

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search" aria-label="Cerca">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          {darkModeEnabled && <ThemeToggle />}
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
    </>
  )
}
