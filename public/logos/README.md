# SoundwaveLab Tech - Logo Assets

This directory contains all official logo variations for the SoundwaveLab Tech brand.

## Directory Structure

- **header/** - Main navigation logos (full & compact)
- **favicon/** - Favicons and app icons
- **social/** - Social media sharing images
- **categories/** - Category icon variations

## File Formats

- **SVG** (Preferred): Scalable, small file size, web-optimized
- **PNG** (Fallback): Universal compatibility, retina-ready

## Quick Start

### React/Next.js
```tsx
import { HeaderLogo, MobileLogo } from '@/components/layout/SiteLogo'

<HeaderLogo />  // Desktop header
<MobileLogo />   // Mobile header
```

### HTML
```html
<!-- Desktop -->
<img src="/logos/header/logo-full.svg" alt="SoundwaveLab Tech" width="180" height="50">

<!-- Mobile -->
<img src="/logos/header/logo-compact.svg" alt="SoundwaveLab Tech" width="120" height="40">
```

## Documentation

For complete usage guidelines, see:
- [Logo Usage Guide](../../docs/LOGO_USAGE_GUIDE.md)
- [Brand Integration Summary](../../docs/BRANDING_INTEGRATION_SUMMARY.md)

## Brand Colors

- Primary Teal: `#1a5f5f`
- Secondary Orange: `#f39c12`

## Total Assets

- 16 files
- ~1.6 MB total size
- SVG + PNG formats

Last updated: 2026-01-05
