// src/components/home/CategoryCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Headphones, Music, Radio } from 'lucide-react'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    image_url: string | null
  }
  index: number
  isFeatured?: boolean
}

export function CategoryCard({ category, index, isFeatured = false }: CategoryCardProps) {
  const indexStr = String(index + 1).padStart(2, '0')

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={`
        block w-full
        group relative overflow-hidden
        border-2 border-pure-black
        bg-white
        ${isFeatured ? 'aspect-[3/4]' : 'aspect-[4/3]'}
        transition-all duration-300
      `}
    >
      {/* Image container with shift effect on hover */}
      <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            unoptimized={category.image_url.startsWith('/api/placeholder')}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-neutral-grey">
            {category.slug === 'synth' && <Headphones className="w-16 h-16 text-zinc-400" />}
            {category.slug === 'dj' && <Radio className="w-16 h-16 text-zinc-400" />}
            {category.slug === 'vintage' && <Music className="w-16 h-16 text-zinc-400" />}
            {category.slug === 'minimal' && <div className="w-16 h-16 border-4 border-zinc-400" />}
            {!['synth', 'dj', 'vintage', 'minimal'].includes(category.slug) && (
              <div className="w-16 h-16 border-4 border-zinc-400" />
            )}
          </div>
        )}
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Decorative line on hover - right side */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-pure-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Label container - bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-pure-black text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Quoted category name */}
              <h3 className="text-heading-minimal text-sm md:text-base tracking-wider !text-white">
                <span className="opacity-50">&quot;</span>
                {category.name.toUpperCase()}
                <span className="opacity-50">&quot;</span>
              </h3>
            </div>

            {/* Index number with arrow on hover */}
            <div className="flex items-center gap-2">
              <span className="text-label-caps text-xs opacity-70 !text-white font-mono">
                {indexStr}
              </span>
              <ArrowRight
                className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </div>
          </div>

          {/* Description - only on featured/larger cards */}
          {isFeatured && category.description && (
            <p className="text-white/60 text-xs mt-2 line-clamp-2 tracking-wide">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
