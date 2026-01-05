// src/lib/logo-config.ts

export const LOGO_PATHS = {
  // Header logos
  header: {
    full: '/logos/header/logo-full.svg',
    fullPng: '/logos/header/logo-full.png',
    compact: '/logos/header/logo-compact.svg',
    compactPng: '/logos/header/logo-compact.png'
  },

  // Favicon and app icons
  favicon: {
    svg: '/logos/favicon/icon.svg',
    png: '/logos/favicon/icon.png'
  },

  // Social media
  social: {
    square: '/logos/social/logo-square.svg',
    squarePng: '/logos/social/logo-square.png'
  },

  // Category icons (symbol variations)
  categories: {
    variant1: '/logos/categories/SOUNDWAVE_LOGO_VETT-09.svg',
    variant2: '/logos/categories/SOUNDWAVE_LOGO_VETT-10.svg',
    variant3: '/logos/categories/SOUNDWAVE_LOGO_VETT-11.svg',
    variant4: '/logos/categories/SOUNDWAVE_LOGO_VETT-12.svg',
    variant5: '/logos/categories/SOUNDWAVE_LOGO_VETT-13.svg',
    variant6: '/logos/categories/SOUNDWAVE_LOGO_VETT-14.svg',
    variant7: '/logos/categories/SOUNDWAVE_LOGO_VETT-15.svg',
    variant8: '/logos/categories/SOUNDWAVE_LOGO_VETT-16.svg'
  }
} as const

export const BRAND_COLORS = {
  primary: {
    teal: '#1a5f5f',
    tealLight: '#2a8f8f',
    tealDark: '#0f3f3f'
  },
  secondary: {
    orange: '#f39c12',
    orangeLight: '#f5a623',
    orangeDark: '#e67e22'
  },
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: '#f5f5f5'
  }
} as const

export type LogoVariant = 'full' | 'compact' | 'icon' | 'social'
export type LogoFormat = 'svg' | 'png'
