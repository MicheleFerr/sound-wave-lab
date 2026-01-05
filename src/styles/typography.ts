// src/styles/typography.ts
/**
 * Sistema di tipografia standardizzato per coerenza in tutto il sito
 */

export const typography = {
  // Headings
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground',
  h2: 'text-2xl md:text-3xl font-bold text-foreground',
  h3: 'text-xl md:text-2xl font-semibold text-foreground',
  h4: 'text-lg md:text-xl font-semibold text-foreground',
  h5: 'text-base md:text-lg font-semibold text-foreground',
  h6: 'text-sm md:text-base font-semibold text-foreground',

  // Hero text (per sezioni principali)
  hero: {
    title: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground',
    subtitle: 'text-lg md:text-xl text-muted-foreground',
    description: 'text-base md:text-lg text-muted-foreground',
  },

  // Body text
  body: {
    large: 'text-lg text-foreground',
    default: 'text-base text-foreground',
    small: 'text-sm text-foreground',
    tiny: 'text-xs text-foreground',
  },

  // Muted text (testi secondari)
  muted: {
    large: 'text-lg text-muted-foreground',
    default: 'text-base text-muted-foreground',
    small: 'text-sm text-muted-foreground',
    tiny: 'text-xs text-muted-foreground',
  },

  // Link text
  link: {
    default: 'text-base text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors',
    inline: 'text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors',
    nav: 'text-sm font-medium text-foreground hover:text-primary transition-colors',
    subtle: 'text-sm text-muted-foreground hover:text-foreground transition-colors',
  },

  // Button text (sempre visibile in dark mode)
  button: {
    primary: '!text-white font-medium',  // ! per override
    secondary: 'text-foreground font-medium',
    ghost: 'text-foreground font-medium',
    link: 'text-primary font-medium',
  },

  // Label e form
  label: 'text-sm font-medium text-foreground',
  helper: 'text-xs text-muted-foreground',
  error: 'text-xs text-destructive',

  // Badge e tag
  badge: 'text-xs font-semibold',

  // Gradiente brand (per testi speciali)
  gradient: 'bg-gradient-to-r from-brand-teal to-brand-gold bg-clip-text text-transparent',

  // Card text
  card: {
    title: 'text-lg font-semibold text-foreground',
    description: 'text-sm text-muted-foreground',
    label: 'text-xs font-medium text-muted-foreground uppercase tracking-wide',
  },

  // Product specific
  product: {
    name: 'text-base font-semibold text-foreground hover:text-primary transition-colors',
    price: 'text-lg font-bold text-foreground',
    oldPrice: 'text-sm text-muted-foreground line-through',
    badge: 'text-xs font-semibold uppercase tracking-wide',
  },

  // Section titles
  section: {
    title: 'text-2xl md:text-3xl font-bold text-foreground',
    subtitle: 'text-base md:text-lg text-muted-foreground',
  },
} as const

/**
 * Utility per combinare classi di tipografia con classi aggiuntive
 */
export function typo(key: keyof typeof typography, additionalClasses?: string): string {
  const baseClasses = typography[key]
  if (typeof baseClasses === 'string') {
    return additionalClasses ? `${baseClasses} ${additionalClasses}` : baseClasses
  }
  return additionalClasses || ''
}

/**
 * Esempi di utilizzo:
 *
 * <h1 className={typography.h1}>Titolo</h1>
 * <p className={typography.body.default}>Paragrafo</p>
 * <Button className={typography.button.primary}>Clicca</Button>
 * <a className={typography.link.default}>Link</a>
 *
 * // Con classi aggiuntive:
 * <h1 className={typo('h1', 'mb-4')}>Titolo con margin</h1>
 */
