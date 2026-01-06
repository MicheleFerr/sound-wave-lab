// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromoBanner } from '@/components/layout/PromoBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SoundwaveLab Tech - Pro Audio Plugins & Sound Design Tools',
  description: 'Premium audio plugins, virtual instruments, sound libraries and mixing tools for music producers, sound designers and audio professionals.',
  keywords: ['audio plugins', 'VST', 'virtual instruments', 'sound design', 'mixing', 'mastering', 'DAW', 'music production'],
  authors: [{ name: 'SoundwaveLab Tech' }],
  creator: 'SoundwaveLab Tech',
  publisher: 'SoundwaveLab Tech',
  icons: {
    icon: [
      { url: '/logos/favicon/icon.svg', type: 'image/svg+xml' },
      { url: '/logos/favicon/icon.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/logos/favicon/icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://soundwavelab.tech',
    title: 'SoundwaveLab Tech - Pro Audio Plugins & Sound Design Tools',
    description: 'Premium audio plugins, virtual instruments, sound libraries and mixing tools for music producers.',
    siteName: 'SoundwaveLab Tech',
    images: [
      {
        url: '/logos/social/logo-square.png',
        width: 1200,
        height: 1200,
        alt: 'SoundwaveLab Tech Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoundwaveLab Tech - Pro Audio Plugins',
    description: 'Premium audio plugins and sound design tools for music producers.',
    images: ['/logos/social/logo-square.png']
  }
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
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <PromoBanner />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CartDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
