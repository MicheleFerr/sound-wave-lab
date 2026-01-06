// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
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

// Payment method logos - Real brand images from CDN
const paymentLogos = [
  {
    name: 'Visa',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
    alt: 'Visa',
  },
  {
    name: 'Mastercard',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
    alt: 'Mastercard',
  },
  {
    name: 'PayPal',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png',
    alt: 'PayPal',
  },
  {
    name: 'Apple Pay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png',
    alt: 'Apple Pay',
  },
  {
    name: 'Google Pay',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png',
    alt: 'Google Pay',
  },
]

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
    <footer className="border-t border-pure-black/10 bg-neutral-grey pb-20 md:pb-0">
      <div className="container py-8 md:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="text-heading-minimal text-base tracking-wider mb-4">SOUND WAVE LAB</h3>
            </Link>
            <p className="text-xs tracking-wide opacity-70 mb-6 max-w-xs">
              MAGLIETTE UNICHE CON DESIGN ORIGINALI PER CHI AMA DISTINGUERSI.
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
            <h4 className="text-label-caps text-[10px] tracking-wider mb-4">{footerLinks.negozio.title.toUpperCase()}</h4>
            <ul className="space-y-2">
              {footerLinks.negozio.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs tracking-wide opacity-70 hover:opacity-100 transition-opacity uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-label-caps text-[10px] tracking-wider mb-4">{footerLinks.info.title.toUpperCase()}</h4>
            <ul className="space-y-2">
              {footerLinks.info.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs tracking-wide opacity-70 hover:opacity-100 transition-opacity uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-label-caps text-[10px] tracking-wider mb-4">{footerLinks.legal.title.toUpperCase()}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs tracking-wide opacity-70 hover:opacity-100 transition-opacity uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mt-8 pt-8 border-t border-pure-black/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-label-caps text-[9px] tracking-wider opacity-70">METODI DI PAGAMENTO ACCETTATI</span>
              <div className="flex items-center gap-3 flex-wrap">
                {paymentLogos.map((logo) => (
                  <div
                    key={logo.name}
                    className="relative h-8 w-auto bg-white border border-pure-black/10 px-2 py-1 flex items-center justify-center"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={48}
                      height={32}
                      className="object-contain h-6 w-auto"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-pure-black/10 text-center md:text-left">
          <p className="text-xs tracking-wide opacity-60">
            &copy; {currentYear} SOUND WAVE LAB. TUTTI I DIRITTI RISERVATI.
          </p>
        </div>
      </div>
    </footer>
  )
}
