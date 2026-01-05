// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sound Wave Lab - Magliette per amanti della musica',
  description: 'E-commerce di magliette uniche a tema musica elettronica, synth, DJ e tecnologia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </div>
          <CartDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
