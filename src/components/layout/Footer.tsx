// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

// TikTok icon (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

// Payment method icons as simple components
function VisaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path d="M19.5 21H17L18.75 11H21.25L19.5 21Z" fill="white" />
      <path d="M28.5 11.25C28 11 27.25 10.75 26.25 10.75C23.75 10.75 22 12.25 22 14.25C22 15.75 23.25 16.5 24.25 17C25.25 17.5 25.5 17.75 25.5 18.25C25.5 18.75 24.75 19.25 24 19.25C23 19.25 22.25 19 21.75 18.75L21.5 18.5L21 21C21.5 21.25 22.5 21.5 23.75 21.5C26.5 21.5 28.25 20 28.25 17.75C28.25 16.5 27.5 15.5 26 14.75C25 14.25 24.5 14 24.5 13.5C24.5 13 25 12.5 26 12.5C26.75 12.5 27.25 12.75 27.75 12.75L28 12.75L28.5 11.25Z" fill="white" />
      <path d="M33.25 11H31.25C30.5 11 30 11.25 29.75 12L26 21H28.75L29.25 19.5H32.5L32.75 21H35.25L33.25 11ZM30 17.5L31.25 13.75L32 17.5H30Z" fill="white" />
      <path d="M16.5 11L14 18L13.75 17C13.25 15.5 11.75 13.75 10 12.75L12.25 21H15L19 11H16.5Z" fill="white" />
    </svg>
  )
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#1A1A1A" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.5C25.9 12 27 14 27 16C27 18 25.9 20 24 21.5C22.1 20 21 18 21 16C21 14 22.1 12 24 10.5Z" fill="#FF5F00" />
    </svg>
  )
}

function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#F5F5F5" />
      <path d="M19.5 8H14.5C14 8 13.5 8.5 13.5 9L11.5 22C11.5 22.5 12 23 12.5 23H14.5L15 20V20.5C15 20.5 15.5 21 16 21H18C21 21 23.5 19 24 16C24 16 24.5 13 22.5 11C21.5 9.5 20 8 19.5 8Z" fill="#003087" />
      <path d="M24.5 11.5C24.5 11.5 24 9.5 22 9C20 8.5 17.5 9 17.5 9L16 18C16 18.5 16.5 19 17 19H19.5C22 19 24 17 24.5 14.5C24.5 14.5 25 12 24.5 11.5Z" fill="#009CDE" />
    </svg>
  )
}

function ApplePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#000000" />
      <path d="M15.5 12C15 11.25 14 10.5 13.25 10.5C12.5 10.5 11 11.5 11 13.25C11 15 12.5 17.5 13.5 18.5C14.25 19.5 15 20 15.75 20C16.5 20 17 19.75 17.75 19.75C18.5 19.75 19 20 19.75 20C20.5 20 21.25 19.25 22 18.5C22.75 17.5 23 16.5 23 16.5C23 16.5 21.25 15.75 21.25 13.75C21.25 12 22.5 11 22.5 11C22.5 11 21.25 9.5 19.25 9.5C17.25 9.5 16 10.75 15.5 11.25V12Z" fill="white" />
      <path d="M17.5 9C17.75 8.25 17.5 7.5 17.5 7.5C17.5 7.5 16.25 7.5 15.5 8.5C14.75 9.5 15 10.5 15 10.5C15 10.5 16.25 10.5 17.5 9Z" fill="white" />
      <text x="25" y="17.5" fill="white" fontSize="8" fontWeight="600" fontFamily="system-ui">Pay</text>
    </svg>
  )
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#F5F5F5" />
      <path d="M24 13V18.5H22.5V10H26.5C27.5 10 28.5 10.5 29 11C29.5 11.5 30 12.5 30 13.25C30 14 29.5 15 29 15.5C28.5 16 27.5 16.5 26.5 16.5H24V15H26.5C27 15 27.5 14.75 27.75 14.5C28 14.25 28.25 13.75 28.25 13.25C28.25 12.75 28 12.25 27.75 12C27.5 11.75 27 11.5 26.5 11.5H24V13Z" fill="#5F6368" />
      <path d="M33 18.5L31 15H32.75L34 17.5L35.25 15H37L35 18.5V22H33V18.5Z" fill="#5F6368" />
      <circle cx="15" cy="16" r="5" fill="#4285F4" />
      <path d="M15 13.5V16H18C18 17.5 16.5 18.5 15 18.5C13.25 18.5 12 17.25 12 16C12 14.75 13.25 13.5 15 13.5Z" fill="white" />
    </svg>
  )
}

const footerLinks = {
  negozio: {
    title: 'Negozio',
    links: [
      { label: 'Prodotti', href: '/products' },
      { label: 'Categorie', href: '/products?view=categories' },
      { label: 'Novita', href: '/products?sort=newest' },
    ],
  },
  info: {
    title: 'Informazioni',
    links: [
      { label: 'Chi Siamo', href: '/chi-siamo' },
      { label: 'Contatti', href: '/contatti' },
      { label: 'Spedizioni', href: '/spedizioni' },
    ],
  },
  legal: {
    title: 'Legale',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Termini e Condizioni', href: '/termini' },
    ],
  },
}

const socialLinks = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'TikTok', href: '#', icon: TikTokIcon },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50 pb-20 md:pb-0">
      <div className="container py-8 md:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="font-bold text-lg mb-4">Sound Wave Lab</h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Magliette uniche per amanti della musica elettronica, sintetizzatori e tecnologia audio.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Negozio Links */}
          <div>
            <h4 className="font-medium mb-4">{footerLinks.negozio.title}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.negozio.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-medium mb-4">{footerLinks.info.title}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.info.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-medium mb-4">{footerLinks.legal.title}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Metodi di pagamento accettati</span>
              <div className="flex items-center gap-2">
                <VisaIcon className="h-8 w-12" />
                <MastercardIcon className="h-8 w-12" />
                <PayPalIcon className="h-8 w-12" />
                <ApplePayIcon className="h-8 w-12" />
                <GooglePayIcon className="h-8 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Sound Wave Lab. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
