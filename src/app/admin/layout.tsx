// src/app/admin/layout.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Settings, ArrowLeft, Tag, Palette, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Prodotti', href: '/admin/products', icon: Package },
  { label: 'Categorie', href: '/admin/categorie', icon: FolderOpen },
  { label: 'Ordini', href: '/admin/ordini', icon: ShoppingCart },
  { label: 'Coupon', href: '/admin/coupons', icon: Tag },
  { label: 'Stripe', href: '/admin/stripe', icon: CreditCard },
  { label: 'Personalizzazione', href: '/admin/personalizzazione', icon: Palette },
  { label: 'Impostazioni', href: '/admin/settings', icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Security: Verify user is authenticated and has admin role
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Admin Header */}
      <header className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Torna al sito</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-bold text-lg">
                <span className="text-brand-gradient">
                  Admin Panel
                </span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r min-h-[calc(100vh-64px)] hidden md:block">
          <nav className="p-4 space-y-1">
            {adminNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t z-50">
          <nav className="flex justify-around py-2">
            {adminNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
