# Category Placeholder API

Generates dynamic placeholder images for product categories.

## Endpoint

```
GET /api/placeholder/[category]?variant=[gradient|teal|orange]
```

## Parameters

- **category** (path): Category slug (e.g., `plugins`, `sound-libraries`, `synths`)
- **variant** (query): Color variant - `gradient`, `teal`, or `orange` (default: `gradient`)

## Examples

```
/api/placeholder/plugins?variant=gradient
/api/placeholder/sound-libraries?variant=teal
/api/placeholder/synths?variant=orange
```

## Response

Returns a PNG image (800x600px) with:
- Gradient background based on variant
- Soundwave pattern overlay
- Category-specific icon
- Category name text

## Available Categories

### Musica & Audio
- plugins, synths, dj, effects, vocals, mixing, drums, sound-libraries, virtual-instruments

### Anime & Manga
- anime, manga, cosplay

### Fitness & Sport
- fitness, gym, running, yoga

### Gaming
- gaming, esports, retro

### Tech & Geek
- tech, coding, robot

### Lifestyle & Fashion
- streetwear, fashion, urban

### Frasi & Quotes
- quotes, motivation, funny

### Altri
- bundles, limited, trending

## Usage in Category Form

The admin category form includes a visual gallery of all available placeholders. Selecting a template automatically populates the image URL field.

## Technical Details

- Runtime: Edge (fast response)
- Technology: Next.js Image Response API
- Output format: PNG
- Dimensions: 800x600px
- Generated on-demand (no storage)
