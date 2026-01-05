// src/components/ui/category-placeholder.tsx
import React from 'react'

interface CategoryPlaceholderProps {
  category: string
  variant?: 'teal' | 'orange' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const CATEGORY_ICONS: Record<string, string> = {
  // Musica & Audio
  plugins: 'M12 2L2 7v10c0 5.5 3.8 7.7 10 10 6.2-2.3 10-4.5 10-10V7l-10-5z',
  'sound-libraries': 'M9 18V5l12-2v13M9 9l12-2',
  'virtual-instruments': 'M9 2v17.5M13 2v17.5M17 2v17.5M21 2v17.5M5 2v17.5',
  effects: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  mixing: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  synths: 'M2 12h20M2 6h20M2 18h20',
  drums: 'M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z',
  vocals: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z',
  dj: 'M12 2L2 12l10 10 10-10L12 2zM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',

  // Anime & Manga
  anime: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  manga: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6v12M16 6v12',
  cosplay: 'M12 2a5 5 0 0 1 5 5v10a5 5 0 1 1-10 0V7a5 5 0 0 1 5-5z',

  // Fitness & Sport
  fitness: 'M2 12h4M6 8v8M10 4v16M14 4v16M18 8v8M18 12h4',
  gym: 'M6.5 6.5v11M17.5 6.5v11M3 9.5h18M3 14.5h18',
  running: 'M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 11l-3 8-3-2-2 4M8 11l3-6',
  yoga: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 13l-4 7M16 13l4 7M12 9v12',

  // Gaming
  gaming: 'M6 12h12M6 12a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2M6 12v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5',
  esports: 'M15 6l6 6-6 6M9 6L3 12l6 6',
  retro: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 9h6v6H9z',

  // Tech & Geek
  tech: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
  coding: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  robot: 'M12 2v4M18 8h2M4 8h2M6 18H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2',

  // Lifestyle & Fashion
  streetwear: 'M6 2v6h12V2M6 8v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8',
  fashion: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  urban: 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-4',

  // Frasi & Quotes
  quotes: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  motivation: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  funny: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',

  // Altri
  bundles: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  limited: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5',
  trending: 'M3 17l6-6 4 4 8-8M21 7v6h-6'
}

const SIZE_MAP = {
  sm: { width: 200, height: 200, fontSize: 14 },
  md: { width: 400, height: 300, fontSize: 18 },
  lg: { width: 800, height: 600, fontSize: 24 }
}

const GRADIENTS = {
  teal: ['#1a5f5f', '#2a8f8f'],
  orange: ['#f39c12', '#f5a623'],
  gradient: ['#1a5f5f', '#f39c12']
}

export function CategoryPlaceholder({
  category,
  variant = 'gradient',
  size = 'md',
  className = ''
}: CategoryPlaceholderProps) {
  const dimensions = SIZE_MAP[size]
  const [color1, color2] = GRADIENTS[variant]
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  const iconPath = CATEGORY_ICONS[slug] || CATEGORY_ICONS['bundles']

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={dimensions.width} height={dimensions.height} fill={`url(#grad-${slug})`} />

      {/* Soundwave pattern background */}
      <g opacity="0.1">
        {Array.from({ length: 20 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * (dimensions.width / 20)} ${dimensions.height / 2} Q${i * (dimensions.width / 20) + 10} ${dimensions.height / 2 - (Math.sin(i) * 30)}, ${i * (dimensions.width / 20) + 20} ${dimensions.height / 2}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </g>

      {/* Icon */}
      <g transform={`translate(${dimensions.width / 2 - 40}, ${dimensions.height / 2 - 60})`}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d={iconPath} />
        </svg>
      </g>

      {/* Category name */}
      <text
        x={dimensions.width / 2}
        y={dimensions.height / 2 + 50}
        fill="white"
        fontSize={dimensions.fontSize}
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
      >
        {category}
      </text>
    </svg>
  )
}

// Pre-generate static placeholder images for common categories
export const COMMON_CATEGORIES = [
  // Musica & Audio
  'Plugins',
  'Synths',
  'DJ',
  'Effects',
  'Vocals',

  // Anime & Manga
  'Anime',
  'Manga',
  'Cosplay',

  // Fitness & Sport
  'Fitness',
  'Gym',
  'Running',
  'Yoga',

  // Gaming
  'Gaming',
  'Esports',
  'Retro',

  // Tech & Geek
  'Tech',
  'Coding',
  'Robot',

  // Lifestyle & Fashion
  'Streetwear',
  'Fashion',
  'Urban',

  // Frasi & Quotes
  'Quotes',
  'Motivation',
  'Funny',

  // Altri
  'Bundles',
  'Limited',
  'Trending'
] as const
