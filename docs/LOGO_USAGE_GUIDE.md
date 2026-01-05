# SoundwaveLab Tech - Logo Usage Guide

## Overview
This guide provides comprehensive information on how to use SoundwaveLab Tech logos across the platform.

## Logo Structure

```
public/logos/
├── header/          # Main navigation logos
│   ├── logo-full.svg          # Full desktop logo
│   ├── logo-full.png          # Full desktop logo (PNG fallback)
│   ├── logo-compact.svg       # Compact mobile logo
│   └── logo-compact.png       # Compact mobile logo (PNG fallback)
├── favicon/         # Favicons and app icons
│   ├── icon.svg               # Favicon (SVG)
│   └── icon.png               # Favicon (PNG, 32x32)
├── social/          # Social media assets
│   ├── logo-square.svg        # Square logo for social (1200x1200)
│   └── logo-square.png        # Square logo (PNG fallback)
└── categories/      # Category placeholder icons
    └── SOUNDWAVE_LOGO_VETT-{09-16}.svg  # 8 symbol variations
```

## Logo Variants

### Group A - Symbol + Tech (Files 01-08)
**Visual**: "UW" symbol with "TECH" tagline
**Colors**: Teal (#1a5f5f) + Orange (#f39c12)
**Usage**:
- Favicon (32x32, 180x180)
- App icons
- Social media profile images
- Watermarks

### Group B - Symbol Only (Files 09-16)
**Visual**: "UW" symbol without text
**Colors**: Monochrome variations
**Usage**:
- Category icons
- Loading spinners
- Small space applications
- Icon badges

### Group C - Full Wordmark + Tech (Files 17-24)
**Visual**: "soundwave TECH" stacked layout
**Colors**: Full color combinations
**Usage**:
- **Desktop header (PRIMARY)**
- Email signatures
- Document headers
- Footer logos

### Group D - Wordmark Only (Files 25-30)
**Visual**: "soundwave" without tagline
**Colors**: Simplified color palette
**Usage**:
- **Mobile header (PRIMARY)**
- Compact spaces
- Navigation bars
- Mobile applications

### Group E - Horizontal Extended (Files 31-38)
**Visual**: "SOUNDWAVE TECH" horizontal layout
**Usage**:
- Hero sections
- Wide banners
- Marketing materials
- Print media

### Group F - Single Color (Files 39-44)
**Visual**: Monochrome versions (orange/teal)
**Usage**:
- Dark mode versions
- Print applications
- Single-color restrictions
- Merchandise

## React Components

### SiteLogo Component
```tsx
import { SiteLogo, HeaderLogo, MobileLogo, IconLogo } from '@/components/layout/SiteLogo'

// Full logo with custom size
<SiteLogo variant="full" width={200} height={60} />

// Header logo (convenience component)
<HeaderLogo />

// Mobile logo (automatically sized)
<MobileLogo />

// Icon only
<IconLogo width={40} height={40} />
```

### CategoryPlaceholder Component
```tsx
import { CategoryPlaceholder } from '@/components/ui/category-placeholder'

// Gradient placeholder
<CategoryPlaceholder
  category="Plugins"
  variant="gradient"
  size="md"
/>

// Teal variant
<CategoryPlaceholder
  category="Sound Libraries"
  variant="teal"
  size="lg"
/>
```

## Logo Configuration

Import logo paths from centralized config:
```tsx
import { LOGO_PATHS, BRAND_COLORS } from '@/lib/logo-config'

const headerLogo = LOGO_PATHS.header.full
const tealColor = BRAND_COLORS.primary.teal
```

## Brand Colors

### Primary (Teal)
- **Main**: `#1a5f5f` - Primary brand color
- **Light**: `#2a8f8f` - Hover states, accents
- **Dark**: `#0f3f3f` - Dark mode, depth

### Secondary (Orange)
- **Main**: `#f39c12` - Call-to-action, highlights
- **Light**: `#f5a623` - Hover states
- **Dark**: `#e67e22` - Active states

### Neutral
- **White**: `#ffffff` - Light backgrounds
- **Black**: `#000000` - Dark mode backgrounds
- **Gray**: `#f5f5f5` - Subtle backgrounds

## Competitor Analysis (Research Summary)

Based on analysis of leading audio software companies:

### Waves Audio
- Prominent header logo with clean spacing
- Strong brand recognition through consistent placement
- Multiple variants for different contexts

### Sweetwater & Thomann
- User-friendly design with clear structure
- Logo simplicity and versatility
- Fast loading optimized images
- Responsive logo sizing (desktop → mobile)

### Splice & Native Instruments
- Robust icon system extending the logo
- Custom typography and variable fonts
- Dynamic color palette with vibrant hues
- Professional yet approachable aesthetic

## Best Practices

### Spacing
- Minimum clear space: Equal to the height of the "W" in the symbol
- Never crop or obscure the logo
- Maintain aspect ratio always

### Sizing
- **Desktop Header**: 180-220px width
- **Mobile Header**: 100-140px width
- **Favicon**: 32x32px (displayed), 180x180px (Apple)
- **Social**: 1200x1200px minimum

### Color Usage
- Use full-color version on white/light backgrounds
- Use white version on dark/teal backgrounds
- Use teal version on orange/warm backgrounds
- Never use gradients that aren't part of official variants

### Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't add effects (shadows, glows, etc.)
- ❌ Don't change brand colors
- ❌ Don't place on busy backgrounds without padding
- ❌ Don't rotate or skew the logo

## File Format Guidelines

### SVG (Preferred)
- Use for web applications
- Infinitely scalable
- Small file size
- Supports dark mode easily

### PNG (Fallback)
- Use when SVG not supported
- Provide @2x and @3x versions for retina
- Optimize with tools like ImageOptim

### ICO (Favicon)
- Required for legacy browser support
- Located at `/public/favicon.ico`
- 32x32px standard size

## SEO & Metadata

Logos are configured in `/src/app/layout.tsx`:
```tsx
export const metadata: Metadata = {
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
    images: [{
      url: '/logos/social/logo-square.png',
      width: 1200,
      height: 1200
    }]
  }
}
```

## Quick Reference

| Context | Logo File | Component |
|---------|-----------|-----------|
| Desktop Header | `header/logo-full.svg` | `<HeaderLogo />` |
| Mobile Header | `header/logo-compact.svg` | `<MobileLogo />` |
| Favicon | `favicon/icon.png` | Automatic |
| Social Sharing | `social/logo-square.png` | OpenGraph |
| Category Icons | `categories/SOUNDWAVE_LOGO_VETT-*.svg` | `<CategoryPlaceholder />` |

## Support

For questions or additional logo variants, contact the design team or refer to:
- Original logo files: `/Downloads/SOUNDWAVE_LOGO PACK/`
- Vector source: `/Downloads/SOUNDWAVE_LOGO PACK/SWT_VETTORIALI/`
- Adobe Illustrator file: `SOUNDWAVE NUOVO LOGO.ai`

---

**Last Updated**: 2026-01-05
**Version**: 1.0.0
