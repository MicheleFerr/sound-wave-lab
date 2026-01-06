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

  // Get the featured category and the rest
  const featuredCategory = categories[featuredIndex]
  const otherCategories = categories.filter((_, i) => i !== featuredIndex)

  return (
    <>
      {/* Desktop Layout: Asymmetric grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {/* Large featured card - spans 2 rows */}
        <div className="row-span-2">
          <CategoryCard
            category={categories[0]}
            index={0}
            isFeatured
          />
        </div>

        {/* Three smaller cards stacked on the right */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {categories.slice(1, 4).map((category, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={idx + 1}
            />
          ))}
          {/* If we have exactly 3 other categories, add empty placeholder for balance */}
          {categories.length === 4 && (
            <div className="hidden" /> // Grid will auto-balance
          )}
        </div>
      </div>

      {/* Mobile Layout: Featured card + 3 small cards with rotation */}
      <div className="md:hidden space-y-4">
        {/* Featured card with rotation */}
        <div className="relative">
          {/* Rotation indicator dots */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
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

          <CategoryCard
            category={featuredCategory}
            index={featuredIndex}
            isFeatured
          />
        </div>

        {/* Other categories in a row */}
        <div className="grid grid-cols-3 gap-2 mt-8">
          {otherCategories.slice(0, 3).map((category, idx) => {
            // Calculate the original index for proper numbering
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
    </>
  )
}
