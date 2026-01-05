// docs/TYPOGRAPHY_EXAMPLES.tsx
// Esempi pratici di utilizzo del sistema di tipografia

import { typography } from '@/styles/typography'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * ESEMPIO 1: Hero Section
 */
export function HeroExample() {
  return (
    <section className="py-16">
      <h1 className={typography.hero.title}>
        Benvenuto su
        <span className={typography.gradient}> SoundWave Lab</span>
      </h1>
      <p className={typography.hero.subtitle}>
        Magliette uniche con design originali
      </p>

      <div className="flex gap-4 mt-8">
        {/* ✅ Pulsante primario con gradiente - SEMPRE !text-white */}
        <Button className={`bg-brand-gradient ${typography.button.primary}`}>
          Esplora il catalogo
        </Button>

        {/* ✅ Pulsante secondario */}
        <Button variant="secondary">
          Scopri di più
        </Button>
      </div>
    </section>
  )
}

/**
 * ESEMPIO 2: Product Card
 */
export function ProductCardExample() {
  return (
    <div className="border rounded-lg p-4">
      <span className={typography.product.badge}>NUOVO</span>

      <h3 className={typography.product.name}>
        Maglietta Premium Sound
      </h3>

      <p className={typography.card.description}>
        Design originale stampato su cotone 100% organico
      </p>

      <div className="flex items-center gap-2 mt-4">
        <span className={typography.product.price}>€29.99</span>
        <span className={typography.product.oldPrice}>€39.99</span>
      </div>
    </div>
  )
}

/**
 * ESEMPIO 3: Navigation
 */
export function NavigationExample() {
  return (
    <nav className="flex gap-6">
      <Link href="/" className={typography.link.nav}>
        Home
      </Link>
      <Link href="/products" className={typography.link.nav}>
        Prodotti
      </Link>
      <Link href="/about" className={typography.link.nav}>
        Chi Siamo
      </Link>
      <Link href="/contact" className={typography.link.nav}>
        Contatti
      </Link>
    </nav>
  )
}

/**
 * ESEMPIO 4: Form
 */
export function FormExample() {
  return (
    <form className="space-y-4">
      <div>
        <label className={typography.label}>
          Email
        </label>
        <input
          type="email"
          className="w-full mt-1"
          aria-describedby="email-helper"
        />
        <p id="email-helper" className={typography.helper}>
          Inserisci la tua email per ricevere aggiornamenti
        </p>
      </div>

      <div>
        <label className={typography.label}>
          Password
        </label>
        <input
          type="password"
          className="w-full mt-1"
          aria-invalid="true"
          aria-describedby="password-error"
        />
        <p id="password-error" className={typography.error}>
          La password deve contenere almeno 8 caratteri
        </p>
      </div>

      {/* ✅ Submit button con gradiente */}
      <Button
        type="submit"
        className={`w-full bg-brand-gradient ${typography.button.primary}`}
      >
        Invia
      </Button>
    </form>
  )
}

/**
 * ESEMPIO 5: Section con titoli
 */
export function SectionExample() {
  return (
    <section className="py-12">
      <h2 className={typography.section.title}>
        Prodotti in evidenza
      </h2>
      <p className={typography.section.subtitle}>
        I nostri best seller scelti per te
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Product cards qui... */}
      </div>
    </section>
  )
}

/**
 * ESEMPIO 6: Content con link inline
 */
export function ContentExample() {
  return (
    <div className="prose">
      <h3 className={typography.h3}>
        Informazioni Importanti
      </h3>

      <p className={typography.body.default}>
        Benvenuto nel nostro negozio! Per maggiori informazioni consulta la nostra{' '}
        <a href="/faq" className={typography.link.inline}>
          pagina FAQ
        </a>
        {' '}o contattaci direttamente.
      </p>

      <p className={typography.muted.default}>
        Tutti i prezzi sono IVA inclusa. Spedizione gratuita per ordini superiori a €50.
      </p>

      <a href="/terms" className={typography.link.subtle}>
        Leggi i termini e condizioni →
      </a>
    </div>
  )
}

/**
 * ESEMPIO 7: Admin Panel
 */
export function AdminPanelExample() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h2}>
            Gestione Prodotti
          </h1>
          <p className={typography.muted.default}>
            Gestisci il catalogo prodotti del tuo negozio
          </p>
        </div>

        {/* ✅ Action button con gradiente */}
        <Button className={`bg-brand-gradient ${typography.button.primary}`}>
          + Nuovo Prodotto
        </Button>
      </div>

      {/* Table content... */}
    </div>
  )
}

/**
 * ESEMPIO 8: Footer
 */
export function FooterExample() {
  return (
    <footer className="bg-zinc-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-4 gap-8">
        <div>
          <h4 className={typography.h5}>
            Shop
          </h4>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="/products" className={typography.link.subtle}>
                Tutti i prodotti
              </a>
            </li>
            <li>
              <a href="/new" className={typography.link.subtle}>
                Novità
              </a>
            </li>
            <li>
              <a href="/sale" className={typography.link.subtle}>
                Saldi
              </a>
            </li>
          </ul>
        </div>

        {/* Altri footer columns... */}
      </div>

      <div className="container mx-auto mt-12 pt-8 border-t border-zinc-800">
        <p className={typography.muted.small}>
          © 2024 SoundWave Lab. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  )
}

/**
 * RIEPILOGO CLASSI COMUNI
 */
export const COMMON_PATTERNS = {
  // Pulsante primario con gradiente
  primaryButton: `bg-brand-gradient bg-brand-gradient-hover ${typography.button.primary}`,

  // Titolo sezione
  sectionHeader: typography.section.title,

  // Sottotitolo sezione
  sectionSubtitle: typography.section.subtitle,

  // Nome prodotto
  productName: typography.product.name,

  // Prezzo prodotto
  productPrice: typography.product.price,

  // Link navigazione
  navLink: typography.link.nav,

  // Label form
  formLabel: typography.label,

  // Testo helper
  formHelper: typography.helper,

  // Messaggio errore
  formError: typography.error,
}
