// src/components/ui/category-placeholder.tsx
import React from 'react'

interface CategoryPlaceholderProps {
  category: string
  variant?: 'teal' | 'orange' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const CATEGORY_ICONS: Record<string, string> = {
  plugins: 'M12 2L2 7v10c0 5.5 3.8 7.7 10 10 6.2-2.3 10-4.5 10-10V7l-10-5z',
  'sound-libraries': 'M9 18V5l12-2v13M9 9l12-2',
  'virtual-instruments': 'M9 2v17.5M13 2v17.5M17 2v17.5M21 2v17.5M5 2v17.5',
  effects: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  mixing: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  synths: 'M2 12h20M2 6h20M2 18h20',
  drums: 'M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z',
  vocals: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z',
  bundles: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'
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
  'Plugins',
  'Sound Libraries',
  'Virtual Instruments',
  'Effects',
  'Mixing',
  'Synths',
  'Drums',
  'Vocals',
  'Bundles'
] as const
