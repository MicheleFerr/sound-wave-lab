// src/lib/placeholder-presets.ts
// Preset URLs for category placeholders

export const PLACEHOLDER_PRESETS = {
  // Gradient variants
  plugins_gradient: '/api/placeholder/plugins?variant=gradient',
  soundLibraries_gradient: '/api/placeholder/sound-libraries?variant=gradient',
  virtualInstruments_gradient: '/api/placeholder/virtual-instruments?variant=gradient',
  effects_gradient: '/api/placeholder/effects?variant=gradient',
  mixing_gradient: '/api/placeholder/mixing?variant=gradient',
  synths_gradient: '/api/placeholder/synths?variant=gradient',
  drums_gradient: '/api/placeholder/drums?variant=gradient',
  vocals_gradient: '/api/placeholder/vocals?variant=gradient',
  bundles_gradient: '/api/placeholder/bundles?variant=gradient',

  // Teal variants
  plugins_teal: '/api/placeholder/plugins?variant=teal',
  soundLibraries_teal: '/api/placeholder/sound-libraries?variant=teal',
  virtualInstruments_teal: '/api/placeholder/virtual-instruments?variant=teal',
  effects_teal: '/api/placeholder/effects?variant=teal',
  mixing_teal: '/api/placeholder/mixing?variant=teal',
  synths_teal: '/api/placeholder/synths?variant=teal',
  drums_teal: '/api/placeholder/drums?variant=teal',
  vocals_teal: '/api/placeholder/vocals?variant=teal',
  bundles_teal: '/api/placeholder/bundles?variant=teal',

  // Orange variants
  plugins_orange: '/api/placeholder/plugins?variant=orange',
  soundLibraries_orange: '/api/placeholder/sound-libraries?variant=orange',
  virtualInstruments_orange: '/api/placeholder/virtual-instruments?variant=orange',
  effects_orange: '/api/placeholder/effects?variant=orange',
  mixing_orange: '/api/placeholder/mixing?variant=orange',
  synths_orange: '/api/placeholder/synths?variant=orange',
  drums_orange: '/api/placeholder/drums?variant=orange',
  vocals_orange: '/api/placeholder/vocals?variant=orange',
  bundles_orange: '/api/placeholder/bundles?variant=orange',
} as const

export type PlaceholderPreset = keyof typeof PLACEHOLDER_PRESETS

// Helper function to get placeholder URL
export function getPlaceholderUrl(
  category: string,
  variant: 'gradient' | 'teal' | 'orange' = 'gradient'
): string {
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  return `/api/placeholder/${slug}?variant=${variant}`
}

// Common categories for quick access
export const CATEGORY_TEMPLATES = [
  // Musica & Audio
  { name: 'Plugins', slug: 'plugins', category: 'Musica & Audio' },
  { name: 'Synths', slug: 'synths', category: 'Musica & Audio' },
  { name: 'DJ', slug: 'dj', category: 'Musica & Audio' },
  { name: 'Effects', slug: 'effects', category: 'Musica & Audio' },
  { name: 'Vocals', slug: 'vocals', category: 'Musica & Audio' },

  // Anime & Manga
  { name: 'Anime', slug: 'anime', category: 'Anime & Manga' },
  { name: 'Manga', slug: 'manga', category: 'Anime & Manga' },
  { name: 'Cosplay', slug: 'cosplay', category: 'Anime & Manga' },

  // Fitness & Sport
  { name: 'Fitness', slug: 'fitness', category: 'Fitness & Sport' },
  { name: 'Gym', slug: 'gym', category: 'Fitness & Sport' },
  { name: 'Running', slug: 'running', category: 'Fitness & Sport' },
  { name: 'Yoga', slug: 'yoga', category: 'Fitness & Sport' },

  // Gaming
  { name: 'Gaming', slug: 'gaming', category: 'Gaming' },
  { name: 'Esports', slug: 'esports', category: 'Gaming' },
  { name: 'Retro', slug: 'retro', category: 'Gaming' },

  // Tech & Geek
  { name: 'Tech', slug: 'tech', category: 'Tech & Geek' },
  { name: 'Coding', slug: 'coding', category: 'Tech & Geek' },
  { name: 'Robot', slug: 'robot', category: 'Tech & Geek' },

  // Lifestyle & Fashion
  { name: 'Streetwear', slug: 'streetwear', category: 'Lifestyle & Fashion' },
  { name: 'Fashion', slug: 'fashion', category: 'Lifestyle & Fashion' },
  { name: 'Urban', slug: 'urban', category: 'Lifestyle & Fashion' },

  // Frasi & Quotes
  { name: 'Quotes', slug: 'quotes', category: 'Frasi & Quotes' },
  { name: 'Motivation', slug: 'motivation', category: 'Frasi & Quotes' },
  { name: 'Funny', slug: 'funny', category: 'Frasi & Quotes' },

  // Altri
  { name: 'Bundles', slug: 'bundles', category: 'Altri' },
  { name: 'Limited', slug: 'limited', category: 'Altri' },
  { name: 'Trending', slug: 'trending', category: 'Altri' },
] as const
