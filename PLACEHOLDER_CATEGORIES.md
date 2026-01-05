# SoundwaveLab - Categorie Placeholder Complete

## 📚 Panoramica

Sistema di placeholder multi-categoria per uno shop di tecnologia mista che copre:
- 🎵 Musica & Audio (9 categorie)
- 🎌 Anime & Manga (3 categorie)
- 💪 Fitness & Sport (4 categorie)
- 🎮 Gaming (3 categorie)
- 💻 Tech & Geek (3 categorie)
- 👕 Lifestyle & Fashion (3 categorie)
- 💬 Frasi & Quotes (3 categorie)
- ⭐ Altri (3 categorie)

**Totale: 31 template predefiniti**

---

## 🎵 Musica & Audio

### Plugins
- **Icona**: Shield/Plugin
- **Descrizione**: Plugin audio VST/AU per produzione musicale
- **Esempi**: Serum, Massive, Kontakt

### Synths
- **Icona**: Waveforms
- **Descrizione**: Sintetizzatori software e hardware
- **Esempi**: Analog, FM, Wavetable synths

### DJ
- **Icona**: Diamond mixer
- **Descrizione**: Attrezzatura e software per DJ
- **Esempi**: Controller, mixer, deck

### Effects
- **Icona**: Circle target
- **Descrizione**: Effetti audio (reverb, delay, etc.)
- **Esempi**: FabFilter, Valhalla, Soundtoys

### Vocals
- **Icona**: Microphone
- **Descrizione**: Plugin e tools per vocal processing
- **Esempi**: Autotune, vocal chain, de-esser

### Mixing
- **Icona**: Sliders
- **Descrizione**: Tools per mixing e mastering
- **Esempi**: EQ, compressori, limiter

### Drums
- **Icona**: Circle/Disc
- **Descrizione**: Batterie elettroniche e sample pack
- **Esempi**: Drum machines, sample libraries

### Sound Libraries
- **Icona**: Music notes
- **Descrizione**: Librerie di suoni e campioni
- **Esempi**: Orchestral, cinematic, ambient

### Virtual Instruments
- **Icona**: Piano keys
- **Descrizione**: Strumenti virtuali completi
- **Esempi**: Pianoforti, archi, brass

---

## 🎌 Anime & Manga

### Anime
- **Icona**: Layers
- **Descrizione**: Merchandise anime, poster, figure
- **Esempi**: Naruto, One Piece, Attack on Titan

### Manga
- **Icona**: Book pages
- **Descrizione**: Volumi manga, collezionismo
- **Esempi**: Shonen Jump, seinen, shojo

### Cosplay
- **Icona**: Costume
- **Descrizione**: Costumi e accessori cosplay
- **Esempi**: Outfit completi, props, parrucche

---

## 💪 Fitness & Sport

### Fitness
- **Icona**: Dumbbell bars
- **Descrizione**: Attrezzatura fitness generale
- **Esempi**: Manubri, elastici, tappetini

### Gym
- **Icona**: Barbell
- **Descrizione**: Equipment da palestra
- **Esempi**: Bilancieri, panche, rack

### Running
- **Icona**: Runner silhouette
- **Descrizione**: Abbigliamento e accessori running
- **Esempi**: Scarpe, tracker, abbigliamento

### Yoga
- **Icona**: Yoga pose
- **Descrizione**: Yoga mat, blocchi, abbigliamento
- **Esempi**: Tappetini, cinture, supporti

---

## 🎮 Gaming

### Gaming
- **Icona**: Game controller
- **Descrizione**: Gaming gear generale
- **Esempi**: Controller, headset, sedie

### Esports
- **Icona**: Code brackets
- **Descrizione**: Equipment professionale esports
- **Esempi**: Mouse gaming, keyboard, monitor

### Retro
- **Icona**: Pixel square
- **Descrizione**: Gaming retrò e vintage
- **Esempi**: Console retrò, giochi vintage

---

## 💻 Tech & Geek

### Tech
- **Icona**: Monitor/Computer
- **Descrizione**: Tecnologia e gadget
- **Esempi**: Accessori PC, cavi, stand

### Coding
- **Icona**: Code brackets
- **Descrizione**: Developer tools e merch
- **Esempi**: IDE themes, stickers, libri

### Robot
- **Icona**: Robot head
- **Descrizione**: Robotica e IoT
- **Esempi**: Arduino, Raspberry Pi, sensori

---

## 👕 Lifestyle & Fashion

### Streetwear
- **Icona**: T-shirt
- **Descrizione**: Moda streetwear urbana
- **Esempi**: Hoodie, t-shirt, accessori

### Fashion
- **Icona**: Layers diamond
- **Descrizione**: Fashion e tendenze
- **Esempi**: Accessori, outfit completi

### Urban
- **Icona**: Buildings
- **Descrizione**: Stile urbano e city life
- **Esempi**: Backpack, caps, sneakers

---

## 💬 Frasi & Quotes

### Quotes
- **Icona**: Quote marks
- **Descrizione**: Citazioni motivazionali
- **Esempi**: Poster con frasi, wall art

### Motivation
- **Icona**: Mountain/Layers
- **Descrizione**: Frasi motivazionali fitness/life
- **Esempi**: Gym quotes, life mantras

### Funny
- **Icona**: Smile face
- **Descrizione**: Frasi divertenti e sfiziose
- **Esempi**: Battute, meme, ironia

---

## ⭐ Altri

### Bundles
- **Icona**: Package/Box
- **Descrizione**: Bundle e pacchetti speciali
- **Esempi**: Combo deals, starter pack

### Limited
- **Icona**: Diamond layers
- **Descrizione**: Edizioni limitate e speciali
- **Esempi**: Drop esclusivi, collaborazioni

### Trending
- **Icona**: Arrow trending up
- **Descrizione**: Prodotti di tendenza
- **Esempi**: Best seller, viral products

---

## 🎨 Varianti Colore

Ogni categoria è disponibile in 3 varianti:

1. **Gradient** (default)
   - Teal → Orange
   - Perfetto per impatto visivo
   - Più dinamico e moderno

2. **Teal**
   - Monocolore teal (#1a5f5f → #2a8f8f)
   - Professionale e tech
   - Adatto per categorie tecniche

3. **Orange**
   - Monocolore orange (#f39c12 → #f5a623)
   - Energico e vivace
   - Perfetto per sport e lifestyle

---

## 🚀 Come Usarli

### Nel Form Admin
1. Vai su **Admin → Categorie**
2. Clicca **Nuova Categoria** o modifica esistente
3. Tab **Placeholder**
4. Scegli **Stile Colore** (Gradient/Teal/Orange)
5. Clicca sul **template** desiderato
6. ✅ L'URL viene inserito automaticamente

### Via API
```
GET /api/placeholder/[categoria]?variant=[gradient|teal|orange]

Esempi:
/api/placeholder/anime?variant=gradient
/api/placeholder/fitness?variant=teal
/api/placeholder/quotes?variant=orange
```

### In Codice
```tsx
import { CategoryPlaceholder } from '@/components/ui/category-placeholder'

<CategoryPlaceholder
  category="Gaming"
  variant="gradient"
  size="md"
/>
```

---

## 📊 Statistiche

- **Categorie totali**: 31
- **Icone uniche**: 31
- **Varianti colore**: 3
- **Combinazioni possibili**: 93
- **Dimensioni supportate**: 3 (sm, md, lg)
- **Formati output**: SVG dinamico + PNG API

---

## 🎯 Casi d'Uso

### E-commerce Generalista
✅ Perfetto per shop multi-categoria
✅ Copre tecnologia, lifestyle, sport, cultura pop

### Niche Shop
✅ Seleziona solo le categorie pertinenti
✅ Personalizza i colori per il brand

### Marketplace
✅ Usa tutte le 31 categorie
✅ Varietà completa per qualsiasi prodotto

---

## 🔮 Espandibilità

Aggiungere nuove categorie è semplicissimo:

1. Aggiungi icona a `CATEGORY_ICONS` in:
   - `src/components/ui/category-placeholder.tsx`
   - `src/app/api/placeholder/[category]/route.ts`

2. Aggiungi a `COMMON_CATEGORIES` in:
   - `src/components/ui/category-placeholder.tsx`

3. Aggiungi a `CATEGORY_TEMPLATES` in:
   - `src/lib/placeholder-presets.ts`

4. Aggiorna documentazione API

---

**Ultimo aggiornamento**: 2026-01-05
**Versione**: 2.0.0 (Multi-categoria)
**Precedente**: 1.0.0 (Solo musica - 9 categorie)
