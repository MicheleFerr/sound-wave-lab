// src/app/api/placeholder/[category]/route.ts
/** @jsxImportSource react */
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

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

const GRADIENTS = {
  teal: { start: '#1a5f5f', end: '#2a8f8f' },
  orange: { start: '#f39c12', end: '#f5a623' },
  gradient: { start: '#1a5f5f', end: '#f39c12' }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  const searchParams = request.nextUrl.searchParams
  const variant = (searchParams.get('variant') || 'gradient') as keyof typeof GRADIENTS

  // Get category name and icon
  const categoryName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const iconPath = CATEGORY_ICONS[category] || CATEGORY_ICONS['bundles']
  const colors = GRADIENTS[variant] || GRADIENTS.gradient

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`,
          position: 'relative',
        }}
      >
        {/* Soundwave pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            opacity: 0.1,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: `${30 + Math.sin(i) * 20}%`,
                background: 'white',
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          style={{ marginBottom: 30 }}
        >
          <path d={iconPath} />
        </svg>

        {/* Category name */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          {categoryName}
        </div>
      </div>
    ),
    {
      width: 800,
      height: 600,
    }
  )
}
