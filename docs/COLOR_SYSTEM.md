# Sistema di Colori Standardizzato

## Panoramica

Sistema completo di gestione colori per garantire coerenza visiva, supporto dark mode automatico e facile manutenibilità.

## File di Configurazione

`src/styles/colors.ts` - Sistema centralizzato di tutti i colori

## Categorie di Colori

### 1. Brand Colors (Teal & Gold)

I colori primari del brand SoundWave Lab:

```tsx
import { brandColors } from '@/styles/colors'

// Teal (Verde acqua)
<div className={brandColors.teal.bg}>Background teal</div>
<p className={brandColors.teal.base}>Testo teal</p>
<div className={brandColors.teal.bgOpacity[10]}>Teal 10%</div>

// Gold (Oro)
<div className={brandColors.gold.bg}>Background gold</div>
<p className={brandColors.gold.base}>Testo gold</p>

// Gradienti
<div className={brandColors.gradient.bg}>Gradiente pieno</div>
<p className={brandColors.gradient.text}>Testo con gradiente</p>
<div className={brandColors.gradient.bgLight}>Gradiente leggero</div>
```

### 2. Semantic Colors (Light/Dark Mode)

Colori che si adattano automaticamente al tema:

```tsx
import { semanticColors } from '@/styles/colors'

// Background principale
<div className={semanticColors.background}>Page background</div>

// Card
<div className={semanticColors.card}>Card content</div>

// Primary (pulsanti principali)
<Button className={semanticColors.primary}>Primary</Button>

// Secondary
<Button className={semanticColors.secondary}>Secondary</Button>

// Muted (testi secondari)
<p className={semanticColors.muted}>Testo secondario</p>

// Destructive (azioni pericolose)
<Button className={semanticColors.destructive}>Elimina</Button>
```

### 3. State Colors (Success, Warning, Error, Info)

Colori per comunicare stati:

```tsx
import { stateColors } from '@/styles/colors'

// Successo
<div className={`${stateColors.success.bg} ${stateColors.success.text}`}>
  Operazione completata con successo
</div>

// Warning
<div className={`${stateColors.warning.bg} ${stateColors.warning.text}`}>
  Attenzione: controlla i dati
</div>

// Errore
<div className={`${stateColors.error.bg} ${stateColors.error.text}`}>
  Errore durante il salvataggio
</div>

// Info
<div className={`${stateColors.info.bg} ${stateColors.info.text}`}>
  Informazione utile
</div>
```

### 4. Color Patterns (Combinazioni Comuni)

Pattern preconfigurati per casi d'uso frequenti:

```tsx
import { colorPatterns } from '@/styles/colors'

// Pulsante primario brand (con gradiente)
<Button className={colorPatterns.buttonPrimary}>
  Clicca qui
</Button>

// Card con bordo brand
<div className={colorPatterns.cardBrand}>
  Contenuto card
</div>

// Link brand
<a href="#" className={colorPatterns.linkBrand}>Link</a>

// Badge brand
<span className={colorPatterns.badgeBrand}>NUOVO</span>

// Alert pre-configurati
<div className={colorPatterns.alertSuccess}>Successo!</div>
<div className={colorPatterns.alertError}>Errore!</div>
<div className={colorPatterns.alertWarning}>Attenzione!</div>
<div className={colorPatterns.alertInfo}>Info</div>

// Card con hover
<div className={colorPatterns.cardHover}>
  Hover effect
</div>

// Focus ring (accessibilità)
<input className={colorPatterns.focusRing} />
```

## Pattern d'Uso Comuni

### Hero Section con Gradiente

```tsx
<section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
  <h1>
    Titolo <span className={brandColors.gradient.text}>Brand</span>
  </h1>

  <Button className={colorPatterns.buttonPrimary}>
    Call to Action
  </Button>
</section>
```

### Alert Box

```tsx
// Successo
<div className={`${colorPatterns.alertSuccess} rounded-lg p-4`}>
  <div className="flex items-center gap-2">
    <CheckCircle className={stateColors.success.icon} />
    <p>Prodotto salvato con successo</p>
  </div>
</div>

// Errore
<div className={`${colorPatterns.alertError} rounded-lg p-4`}>
  <div className="flex items-center gap-2">
    <XCircle className={stateColors.error.icon} />
    <p>Errore durante il salvataggio</p>
  </div>
</div>
```

### Card con Brand

```tsx
<div className={`${colorPatterns.cardBrand} rounded-xl p-6`}>
  <h3 className={brandColors.teal.base}>Titolo Card</h3>
  <p className={semanticColors.muted}>Descrizione</p>

  <span className={colorPatterns.badgeBrand}>
    FEATURED
  </span>
</div>
```

### Form con Stati

```tsx
<div>
  <Label className={semanticColors.muted}>Email</Label>
  <Input className={colorPatterns.focusRing} />

  {/* Helper text */}
  <p className={stateColors.info.text}>
    Inserisci una email valida
  </p>

  {/* Error */}
  <p className={stateColors.error.text}>
    Email non valida
  </p>
</div>
```

### Background con Overlay

```tsx
import { overlayColors } from '@/styles/colors'

<div className="relative">
  {/* Immagine di sfondo */}
  <img src="hero.jpg" />

  {/* Overlay scuro */}
  <div className={overlayColors.overlay.dark}>
    <h1 className="text-white">Titolo</h1>
  </div>
</div>
```

## Tabella Colori Brand

| Nome | Valore Hex | Classe CSS | Uso |
|------|------------|------------|-----|
| Teal | #14595E | `brandColors.teal.base` | Colore primario brand |
| Teal Light | #1a7078 | `brandColors.teal.light` | Hover/evidenziazioni |
| Teal Dark | #0f3f3f | - | Variante scura |
| Gold | #FFB753 | `brandColors.gold.base` | Colore secondario brand |
| Gold Light | #f5a623 | - | Hover/evidenziazioni |
| Gold Dark | #e67e22 | - | Variante scura |

## Gradienti Brand

| Nome | Opacità | Classe CSS | Uso |
|------|---------|------------|-----|
| Subtle | 5% | `brandColors.gradient.bgSubtle` | Background molto leggero |
| Light | 10% | `brandColors.gradient.bgLight` | Background leggero |
| Medium | 20% | `brandColors.gradient.bgMedium` | Background moderato |
| Strong | 30% | `brandColors.gradient.bgStrong` | Background intenso |
| Full | 100% | `brandColors.gradient.bg` | Pulsanti, elementi principali |

## Regole Importanti

### ⚠️ Pulsanti con Gradiente

**SEMPRE** usare `!text-white` con `buttonPrimary`:

```tsx
// ✅ CORRETTO
<Button className={colorPatterns.buttonPrimary}>
  Testo visibile
</Button>

// ❌ SBAGLIATO - Invisibile in dark mode
<Button className={brandColors.gradient.bg}>
  Testo invisibile
</Button>
```

### 🌓 Dark Mode

I colori semantici si adattano automaticamente:
- `semanticColors.*` → Funzionano in light e dark mode
- `brandColors.*` → Colori fissi, visibili in entrambi i temi
- `stateColors.*` → Varianti per light/dark mode

### 🎨 Combinazione Custom

Usa la funzione `color()` per combinare:

```tsx
import { color, brandColors, semanticColors } from '@/styles/colors'

<div className={color(
  semanticColors.card,
  brandColors.teal.border,
  brandColors.gradient.bgLight,
  'rounded-lg p-6'
)}>
  Combinazione custom
</div>
```

## Colori Sidebar (Admin)

```tsx
import { sidebarColors } from '@/styles/colors'

<aside className={sidebarColors.bg}>
  <nav className={sidebarColors.primary}>
    <a className={sidebarColors.accent}>Link</a>
  </nav>
</aside>
```

## Accessibility

### Contrasto Minimo

Tutti i colori rispettano WCAG 2.1 AA:
- Testo normale: ratio 4.5:1
- Testo grande: ratio 3:1
- UI components: ratio 3:1

### Focus Indicators

Sempre usare `colorPatterns.focusRing` su elementi interattivi:

```tsx
<button className={colorPatterns.focusRing}>
  Button accessibile
</button>
```

## Testing Dark Mode

Per testare i colori in dark mode:

```tsx
// Aggiungi class="dark" a <html> o <body>
document.documentElement.classList.add('dark')
```

## Migration Checklist

Quando converti componenti esistenti:

- [ ] Sostituisci colori hardcoded con `brandColors.*`
- [ ] Usa `semanticColors.*` per sfondi/testi
- [ ] Pulsanti con gradiente hanno `colorPatterns.buttonPrimary`
- [ ] Alert usano `colorPatterns.alert*`
- [ ] Focus ring su elementi interattivi
- [ ] Testa in light e dark mode

## Vantaggi

1. **Coerenza**: Tutti i componenti usano gli stessi colori
2. **Dark Mode**: Supporto automatico senza codice aggiuntivo
3. **Manutenibilità**: Cambiamenti centralizzati
4. **Accessibilità**: Contrasti garantiti
5. **Performance**: Riuso classi Tailwind
6. **Type Safety**: Import TypeScript con autocompletamento

## Riferimenti

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
