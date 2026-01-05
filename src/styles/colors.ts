// src/styles/colors.ts
/**
 * Sistema di colori standardizzato per coerenza in tutto il sito
 * Include colori brand, semantici e gradienti
 */

/**
 * COLORI BRAND
 * Teal (#14595E) e Gold (#FFB753) - colori principali del brand
 */
export const brandColors = {
  // Teal (Verde acqua)
  teal: {
    base: 'text-brand-teal',           // #14595E
    light: 'text-brand-teal-light',    // #1a7078
    bg: 'bg-brand-teal',
    bgOpacity: {
      10: 'bg-brand-teal/10',
      20: 'bg-brand-teal/20',
      30: 'bg-brand-teal/30',
    },
    border: 'border-brand-teal',
    borderOpacity: {
      30: 'border-brand-teal/30',
    },
    ring: 'ring-brand-teal',
    ringOpacity: {
      30: 'ring-brand-teal/30',
    },
  },

  // Gold (Oro)
  gold: {
    base: 'text-brand-gold',           // #FFB753
    bg: 'bg-brand-gold',
    bgOpacity: {
      10: 'bg-brand-gold/10',
      20: 'bg-brand-gold/20',
    },
  },

  // Gradienti
  gradient: {
    // Gradiente pieno (per pulsanti)
    bg: 'bg-brand-gradient',
    bgHover: 'bg-brand-gradient-hover',

    // Gradiente per testo
    text: 'text-brand-gradient',

    // Gradienti di sfondo (varie intensità)
    bgSubtle: 'bg-brand-gradient-subtle',   // 5% opacity
    bgLight: 'bg-brand-gradient-light',     // 10% opacity
    bgMedium: 'bg-brand-gradient-medium',   // 20% opacity
    bgStrong: 'bg-brand-gradient-strong',   // 30% opacity

    // Border con gradiente
    border: 'border-brand-gradient',
  },
} as const

/**
 * COLORI SEMANTICI
 * Usano le CSS variables di shadcn/ui per supportare dark mode automaticamente
 */
export const semanticColors = {
  // Background
  background: 'bg-background text-foreground',

  // Card e Popover
  card: 'bg-card text-card-foreground',
  popover: 'bg-popover text-popover-foreground',

  // Primary (pulsanti principali)
  primary: 'bg-primary text-primary-foreground',
  primaryHover: 'hover:bg-primary/90',

  // Secondary
  secondary: 'bg-secondary text-secondary-foreground',
  secondaryHover: 'hover:bg-secondary/80',

  // Muted (testi secondari, sfondi subtili)
  muted: 'bg-muted text-muted-foreground',
  mutedHover: 'hover:bg-muted/50',

  // Accent (evidenziazioni)
  accent: 'bg-accent text-accent-foreground',
  accentHover: 'hover:bg-accent/50',

  // Destructive (errori, azioni pericolose)
  destructive: 'bg-destructive text-white',
  destructiveHover: 'hover:bg-destructive/90',

  // Border, Input, Ring
  border: 'border-border',
  input: 'bg-input',
  ring: 'ring-ring',
} as const

/**
 * COLORI PER STATI
 * Success, Warning, Error, Info
 */
export const stateColors = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-300 dark:border-green-700',
    icon: 'text-green-600 dark:text-green-500',
  },

  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: 'text-yellow-600 dark:text-yellow-500',
  },

  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-300 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-500',
  },

  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-500',
  },
} as const

/**
 * PATTERN COMUNI
 * Combinazioni di colori frequentemente usate
 */
export const colorPatterns = {
  // Pulsante primario brand
  buttonPrimary: `${brandColors.gradient.bg} ${brandColors.gradient.bgHover} !text-white`,

  // Card con bordo brand
  cardBrand: `${semanticColors.card} ${brandColors.teal.border}`,

  // Link brand
  linkBrand: `${brandColors.teal.base} hover:${brandColors.teal.light}`,

  // Badge brand
  badgeBrand: `${brandColors.gradient.bgLight} ${brandColors.teal.base}`,

  // Alert di successo
  alertSuccess: `${stateColors.success.bg} ${stateColors.success.border} ${stateColors.success.text}`,

  // Alert di errore
  alertError: `${stateColors.error.bg} ${stateColors.error.border} ${stateColors.error.text}`,

  // Alert di warning
  alertWarning: `${stateColors.warning.bg} ${stateColors.warning.border} ${stateColors.warning.text}`,

  // Alert info
  alertInfo: `${stateColors.info.bg} ${stateColors.info.border} ${stateColors.info.text}`,

  // Hover su card
  cardHover: 'hover:bg-muted/50 transition-colors',

  // Focus ring
  focusRing: 'focus:ring-2 focus:ring-ring focus:ring-offset-2',
} as const

/**
 * COLORI PER OVERLAY E BACKDROP
 */
export const overlayColors = {
  backdrop: 'bg-black/80',
  backdropLight: 'bg-black/50',
  backdropBlur: 'bg-white/10 backdrop-blur-sm',

  overlay: {
    dark: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
    light: 'bg-gradient-to-t from-white/60 via-white/20 to-transparent',
  },
} as const

/**
 * COLORI PER CHART/GRAFICI
 */
export const chartColors = {
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',
} as const

/**
 * COLORI PER SIDEBAR (Admin)
 */
export const sidebarColors = {
  bg: 'bg-sidebar',
  text: 'text-sidebar-foreground',
  primary: 'bg-sidebar-primary text-sidebar-primary-foreground',
  accent: 'bg-sidebar-accent text-sidebar-accent-foreground',
  border: 'border-sidebar-border',
  ring: 'ring-sidebar-ring',
} as const

/**
 * Utility per combinare classi di colore
 */
export function color(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Esempi di utilizzo:
 *
 * // Pulsante primario brand
 * <Button className={colorPatterns.buttonPrimary}>Clicca</Button>
 *
 * // Card con bordo brand
 * <div className={colorPatterns.cardBrand}>Content</div>
 *
 * // Alert di successo
 * <div className={colorPatterns.alertSuccess}>Operazione completata</div>
 *
 * // Link brand
 * <a className={colorPatterns.linkBrand}>Link</a>
 *
 * // Combinazione custom
 * <div className={color(
 *   brandColors.gradient.bgLight,
 *   brandColors.teal.border,
 *   semanticColors.card
 * )}>
 *   Custom combination
 * </div>
 */

/**
 * VALORI HEX (per riferimento)
 */
export const brandColorValues = {
  teal: '#14595E',
  tealLight: '#1a7078',
  tealDark: '#0f3f3f',
  gold: '#FFB753',
  goldLight: '#f5a623',
  goldDark: '#e67e22',
} as const
