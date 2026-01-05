// src/app/(account)/account/layout.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserCog, Package, MapPin, ArrowLeft } from 'lucide-react'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const navItems = [
    { href: '/account', label: 'Il mio profilo', icon: UserCog },
    { href: '/account/ordini', label: 'I miei ordini', icon: Package },
    { href: '/account/indirizzi', label: 'Indirizzi', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna al negozio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white dark:bg-zinc-800 rounded-lg p-4 space-y-1">
              <h2 className="font-semibold mb-4 px-3">Il mio account</h2>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
