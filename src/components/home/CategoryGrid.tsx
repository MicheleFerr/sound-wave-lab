// src/components/home/CategoryGrid.tsx
'use client'

import { useState, useEffect } from 'react'
import { CategoryCard } from './CategoryCard'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0)

  // Mobile: rotate featured card every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % categories.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [categories.length])

  if (categories.length === 0) return null

  // Get the featured category and the rest for mobile
  const featuredCategory = categories[featuredIndex]
  const otherCategories = categories.filter((_, i) => i !== featuredIndex)

  return (
    <div className="w-full overflow-hidden">
      {/* Desktop Layout: Asymmetric 1+3 grid */}
      {/* 1 large card on left (spans 3 rows), 3 smaller cards stacked on right */}
      <div className="hidden md:grid md:grid-cols-2 gap-4" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
        {/* Large featured card - spans all 3 rows */}
        {categories[0] && (
          <div className="row-span-3">
            <CategoryCard
              category={categories[0]}
              index={0}
              isFeatured
            />
          </div>
        )}

        {/* 3 smaller cards stacked on the right */}
        {categories.slice(1, 4).map((category, idx) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={idx + 1}
          />
        ))}
      </div>

      {/* Mobile Layout: 1 large card on top + 3 small below */}
      <div className="md:hidden flex flex-col gap-4">
        {/* Featured card - full width, larger aspect ratio */}
        <div className="w-full relative pb-8">
          <CategoryCard
            category={featuredCategory}
            index={featuredIndex}
            isFeatured
          />

          {/* Rotation indicator dots - below the card */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {categories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                className={`w-2 h-2 transition-all duration-300 ${
                  idx === featuredIndex
                    ? 'bg-pure-black scale-125'
                    : 'bg-pure-black/30 hover:bg-pure-black/50'
                }`}
                aria-label={`Vai alla categoria ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Other 3 categories in a row below */}
        <div className="grid grid-cols-3 gap-2">
          {otherCategories.slice(0, 3).map((category) => {
            const originalIndex = categories.findIndex(c => c.id === category.id)
            return (
              <CategoryCard
                key={category.id}
                category={category}
                index={originalIndex}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
