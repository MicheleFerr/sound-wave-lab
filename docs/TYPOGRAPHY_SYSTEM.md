# Sistema di Tipografia Standardizzato

## Panoramica

Questo progetto utilizza un sistema di tipografia standardizzato per garantire coerenza visiva in tutto il sito, specialmente in dark mode.

## File di Configurazione

`src/styles/typography.ts` - Definisce tutte le classi di tipografia standardizzate

## Utilizzo

### Import

```tsx
import { typography } from '@/styles/typography'
```

### Esempi Base

```tsx
// Titoli
<h1 className={typography.h1}>Titolo Principale</h1>
<h2 className={typography.h2}>Sottotitolo</h2>

// Testo body
<p className={typography.body.default}>Paragrafo standard</p>
<p className={typography.muted.small}>Testo secondario</p>

// Pulsanti (sempre visibili in dark mode)
<Button className={typography.button.primary}>
  Clicca qui
</Button>

// Link
<a href="#" className={typography.link.default}>Link normale</a>
<a href="#" className={typography.link.nav}>Link navigazione</a>
```

## Categorie di Tipografia

### 1. Headings
- `typography.h1` - Titolo principale (4xl/5xl/6xl)
- `typography.h2` - Sezione importante (2xl/3xl)
- `typography.h3` - Sottosezione (xl/2xl)
- `typography.h4-h6` - Titoli minori

### 2. Hero Text (Homepage)
- `typography.hero.title` - Titolo hero
- `typography.hero.subtitle` - Sottotitolo hero
- `typography.hero.description` - Descrizione hero

### 3. Body Text
- `typography.body.large` - Testo grande
- `typography.body.default` - Testo standard
- `typography.body.small` - Testo piccolo
- `typography.body.tiny` - Testo minimo

### 4. Muted Text (Secondario)
- `typography.muted.large/default/small/tiny`

### 5. Links
- `typography.link.default` - Link standard con underline
- `typography.link.inline` - Link nel testo
- `typography.link.nav` - Link di navigazione
- `typography.link.subtle` - Link discreto

### 6. Button Text
**IMPORTANTE**: Usare sempre queste classi per i pulsanti con gradiente!

- `typography.button.primary` - Testo bianco forzato (`!text-white`)
- `typography.button.secondary` - Testo standard
- `typography.button.ghost` - Testo standard
- `typography.button.link` - Testo link

### 7. Form Elements
- `typography.label` - Label dei form
- `typography.helper` - Testo helper
- `typography.error` - Messaggi di errore

### 8. Product Specific
- `typography.product.name` - Nome prodotto
- `typography.product.price` - Prezzo
- `typography.product.oldPrice` - Prezzo scontato
- `typography.product.badge` - Badge prodotto

### 9. Card Text
- `typography.card.title` - Titolo card
- `typography.card.description` - Descrizione card
- `typography.card.label` - Label card

### 10. Section Titles
- `typography.section.title` - Titolo sezione
- `typography.section.subtitle` - Sottotitolo sezione

## Regole per i Pulsanti con Gradiente

⚠️ **ATTENZIONE**: Tutti i pulsanti con `bg-brand-gradient` DEVONO usare `!text-white`:

```tsx
// ✅ CORRETTO
<Button className="bg-brand-gradient !text-white">
  Testo visibile
</Button>

// ❌ SBAGLIATO - Il testo sarà invisibile in dark mode
<Button className="bg-brand-gradient text-white">
  Testo invisibile
</Button>
```

### Perché `!text-white`?

Il componente `Button` con variant="default" ha `text-primary-foreground` che può essere scuro in dark mode. Il `!` (important) di Tailwind forza l'override del colore.

## Pattern Comuni

### Hero Section
```tsx
<section>
  <h1 className={typography.hero.title}>
    Titolo <span className={typography.gradient}>Evidenziato</span>
  </h1>
  <p className={typography.hero.subtitle}>
    Sottotitolo descrittivo
  </p>
</section>
```

### Product Card
```tsx
<div>
  <h3 className={typography.product.name}>Nome Prodotto</h3>
  <p className={typography.product.price}>€99.99</p>
  <p className={typography.card.description}>Descrizione breve</p>
</div>
```

### Form
```tsx
<div>
  <Label className={typography.label}>Email</Label>
  <Input />
  <p className={typography.helper}>Inserisci la tua email</p>
  <p className={typography.error}>Email non valida</p>
</div>
```

### Navigation
```tsx
<nav>
  <a href="#" className={typography.link.nav}>Home</a>
  <a href="#" className={typography.link.nav}>Prodotti</a>
</nav>
```

## Gradienti Brand

Per testi con gradiente brand (da teal a gold):

```tsx
<span className={typography.gradient}>
  Testo con gradiente
</span>
```

## Checklist per Nuovi Componenti

Quando crei un nuovo componente, assicurati di:

- [ ] Usare classi da `typography.ts` invece di classi inline
- [ ] Pulsanti con gradiente hanno `!text-white`
- [ ] Links usano `typography.link.*` appropriato
- [ ] Titoli usano `typography.h*` o `typography.section.*`
- [ ] Testi secondari usano `typography.muted.*`
- [ ] Form elements usano `typography.label/helper/error`

## Benefici

1. **Coerenza**: Tutti i testi seguono lo stesso stile
2. **Dark Mode**: Garantisce visibilità in tutte le modalità
3. **Manutenibilità**: Cambiamenti centralizzati
4. **Accessibilità**: Dimensioni e contrasti corretti
5. **Performance**: Riuso delle classi Tailwind

## Riferimenti

- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [Design Tokens](https://www.figma.com/community/file/958423019126247353)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
