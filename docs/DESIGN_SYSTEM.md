# SoundWave Lab - Design System

Sistema di design completo per garantire coerenza visiva, accessibilità e manutenibilità del codice.

## 📋 Indice

1. [Panoramica](#panoramica)
2. [Sistema di Tipografia](#tipografia)
3. [Sistema di Colori](#colori)
4. [Componenti](#componenti)
5. [Best Practices](#best-practices)
6. [Dark Mode](#dark-mode)

---

## Panoramica

Il Design System di SoundWave Lab è composto da due sistemi principali:

### 🔤 **Tipografia** (`src/styles/typography.ts`)
- Headings (h1-h6)
- Body text (large, default, small, tiny)
- Links (default, inline, nav, subtle)
- Buttons (primary, secondary, ghost, link)
- Forms (label, helper, error)
- Prodotti (name, price, badge)

### 🎨 **Colori** (`src/styles/colors.ts`)
- Brand colors (teal, gold, gradienti)
- Semantic colors (background, card, primary, muted, etc.)
- State colors (success, warning, error, info)
- Color patterns (combinazioni comuni)

---

## Tipografia

### Import

```tsx
import { typography } from '@/styles/typography'
```

### Utilizzo Base

```tsx
// Titoli
<h1 className={typography.h1}>Titolo Principale</h1>
<h2 className={typography.h2}>Sottotitolo</h2>

// Body text
<p className={typography.body.default}>Paragrafo standard</p>
<p className={typography.muted.small}>Testo secondario</p>

// Links
<a href="#" className={typography.link.nav}>Menu</a>

// Pulsanti (IMPORTANTE: sempre !text-white con gradiente)
<Button className={typography.button.primary}>Clicca</Button>
```

### Categorie Disponibili

| Categoria | Varianti | Utilizzo |
|-----------|----------|----------|
| **Headings** | h1, h2, h3, h4, h5, h6 | Titoli di sezione |
| **Hero** | title, subtitle, description | Homepage hero |
| **Body** | large, default, small, tiny | Testo paragrafi |
| **Muted** | large, default, small, tiny | Testo secondario |
| **Link** | default, inline, nav, subtle | Collegamenti |
| **Button** | primary, secondary, ghost, link | Pulsanti |
| **Form** | label, helper, error | Elementi form |
| **Product** | name, price, oldPrice, badge | Prodotti |
| **Card** | title, description, label | Card |
| **Section** | title, subtitle | Sezioni pagina |

📖 **Documentazione completa**: [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md)
💡 **Esempi pratici**: [TYPOGRAPHY_EXAMPLES.tsx](./TYPOGRAPHY_EXAMPLES.tsx)

---

## Colori

### Import

```tsx
import {
  brandColors,
  semanticColors,
  stateColors,
  colorPatterns
} from '@/styles/colors'
```

### Brand Colors

```tsx
// Teal (Verde acqua #14595E)
<div className={brandColors.teal.bg}>Background</div>
<p className={brandColors.teal.base}>Testo</p>

// Gold (Oro #FFB753)
<span className={brandColors.gold.base}>Oro</span>

// Gradienti
<div className={brandColors.gradient.bg}>Gradiente pieno</div>
<p className={brandColors.gradient.text}>Testo gradiente</p>
```

### Semantic Colors (Light/Dark Auto)

```tsx
// Background e card
<div className={semanticColors.background}>Page</div>
<div className={semanticColors.card}>Card</div>

// Stati pulsanti
<Button className={semanticColors.primary}>Primary</Button>
<Button className={semanticColors.destructive}>Elimina</Button>
```

### State Colors

```tsx
// Success
<div className={`${stateColors.success.bg} ${stateColors.success.text}`}>
  Operazione completata
</div>

// Error
<div className={`${stateColors.error.bg} ${stateColors.error.text}`}>
  Errore
</div>

// Warning
<div className={`${stateColors.warning.bg} ${stateColors.warning.text}`}>
  Attenzione
</div>

// Info
<div className={`${stateColors.info.bg} ${stateColors.info.text}`}>
  Informazione
</div>
```

### Color Patterns (Combinazioni Pronte)

```tsx
// Pulsante primario brand
<Button className={colorPatterns.buttonPrimary}>CTA</Button>

// Alert pre-configurati
<div className={colorPatterns.alertSuccess}>Successo!</div>
<div className={colorPatterns.alertError}>Errore!</div>

// Card brand
<div className={colorPatterns.cardBrand}>Content</div>

// Link brand
<a className={colorPatterns.linkBrand}>Link</a>
```

### Palette Completa

| Colore | Hex | Uso |
|--------|-----|-----|
| **Teal** | #14595E | Primario brand |
| **Teal Light** | #1a7078 | Hover/highlight |
| **Gold** | #FFB753 | Secondario brand |
| **Gold Light** | #f5a623 | Hover/highlight |

📖 **Documentazione completa**: [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)
💡 **Esempi pratici**: [COLOR_EXAMPLES.tsx](./COLOR_EXAMPLES.tsx)

---

## Componenti

### Pulsante Primario (Call-to-Action)

```tsx
<Button className={colorPatterns.buttonPrimary}>
  Acquista Ora
</Button>
```

### Alert Box

```tsx
// Successo
<div className={`${colorPatterns.alertSuccess} rounded-lg p-4`}>
  <div className="flex items-center gap-3">
    <CheckCircle className={stateColors.success.icon} />
    <p>Operazione completata</p>
  </div>
</div>
```

### Product Card

```tsx
<div className={`${colorPatterns.cardBrand} rounded-xl p-6`}>
  <span className={colorPatterns.badgeBrand}>NUOVO</span>

  <h3 className={typography.product.name}>Nome Prodotto</h3>
  <p className={typography.card.description}>Descrizione</p>

  <div className="flex items-center justify-between mt-4">
    <span className={typography.product.price}>€29.99</span>
    <Button className={colorPatterns.buttonPrimary}>Aggiungi</Button>
  </div>
</div>
```

### Form Field

```tsx
<div>
  <Label className={typography.label}>Email</Label>
  <Input className={colorPatterns.focusRing} />
  <p className={typography.helper}>Inserisci la tua email</p>
  <p className={typography.error}>Email non valida</p>
</div>
```

### Hero Section

```tsx
<section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-20">
  <h1 className={typography.hero.title}>
    Indossa la tua <span className={brandColors.gradient.text}>passione</span>
  </h1>

  <p className={typography.hero.subtitle}>
    Magliette uniche con design originali
  </p>

  <Button size="lg" className={colorPatterns.buttonPrimary}>
    Esplora il Catalogo
  </Button>
</section>
```

---

## Best Practices

### ✅ DO

```tsx
// ✅ Usa le utility del design system
<h1 className={typography.h1}>Titolo</h1>
<Button className={colorPatterns.buttonPrimary}>CTA</Button>
<p className={typography.muted.default}>Testo secondario</p>

// ✅ Pulsanti con gradiente SEMPRE con !text-white
<Button className={`${brandColors.gradient.bg} !text-white`}>
  Visibile
</Button>

// ✅ Semantic colors per supporto dark mode
<div className={semanticColors.card}>Content</div>

// ✅ State colors per feedback
<div className={stateColors.success.bg}>Success</div>
```

### ❌ DON'T

```tsx
// ❌ Colori hardcoded
<div className="bg-[#14595E] text-[#FFB753]">Bad</div>

// ❌ Classi inline non standardizzate
<h1 className="text-4xl font-bold">Usa typography.h1</h1>

// ❌ Pulsante gradiente senza !text-white
<Button className="bg-brand-gradient text-white">
  Invisibile in dark mode
</Button>

// ❌ Colori fissi che non si adattano al tema
<div className="bg-white text-black">
  Non funziona in dark mode
</div>
```

---

## Dark Mode

### Supporto Automatico

I colori semantici si adattano automaticamente:

```tsx
// Funziona in light e dark mode
<div className={semanticColors.background}>
  <p className={semanticColors.muted}>Testo adattivo</p>
</div>
```

### Test Dark Mode

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

### Regole

1. **Usa `semanticColors.*`** per sfondi/testi che devono adattarsi
2. **Usa `brandColors.*`** per elementi brand (sempre visibili)
3. **Pulsanti con gradiente**: SEMPRE `!text-white`
4. **State colors**: Hanno varianti light/dark automatiche

---

## Checklist per Nuovi Componenti

Quando crei un nuovo componente:

- [ ] Import `typography` e/o `colors`
- [ ] Titoli usano `typography.h*` o `typography.section.*`
- [ ] Testi secondari usano `typography.muted.*`
- [ ] Links usano `typography.link.*`
- [ ] Pulsanti brand usano `colorPatterns.buttonPrimary`
- [ ] Sfondi/card usano `semanticColors.*`
- [ ] Alert usano `colorPatterns.alert*`
- [ ] Form elements hanno `colorPatterns.focusRing`
- [ ] Testa in light e dark mode
- [ ] Verifica contrasti (accessibilità)

---

## Quick Reference

### Pulsante CTA

```tsx
import { colorPatterns } from '@/styles/colors'

<Button className={colorPatterns.buttonPrimary}>
  Call to Action
</Button>
```

### Titolo Sezione

```tsx
import { typography } from '@/styles/typography'

<h2 className={typography.section.title}>Sezione</h2>
<p className={typography.section.subtitle}>Sottotitolo</p>
```

### Alert Success

```tsx
import { colorPatterns } from '@/styles/colors'

<div className={colorPatterns.alertSuccess}>
  Operazione completata
</div>
```

### Product Card

```tsx
import { typography } from '@/styles/typography'
import { colorPatterns } from '@/styles/colors'

<div className={colorPatterns.cardBrand}>
  <h3 className={typography.product.name}>Prodotto</h3>
  <p className={typography.product.price}>€29.99</p>
</div>
```

---

## Risorse

- 📖 [Documentazione Tipografia Completa](./TYPOGRAPHY_SYSTEM.md)
- 📖 [Documentazione Colori Completa](./COLOR_SYSTEM.md)
- 💡 [Esempi Tipografia](./TYPOGRAPHY_EXAMPLES.tsx)
- 💡 [Esempi Colori](./COLOR_EXAMPLES.tsx)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- ♿ [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Versione**: 1.0
**Ultimo aggiornamento**: Gennaio 2025
**Autori**: SoundWave Lab Team
