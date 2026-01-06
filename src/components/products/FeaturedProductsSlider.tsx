// src/components/products/FeaturedProductsSlider.tsx
'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  category?: { name: string; slug: string } | null
  variants: Array<{
    id: string
    price: number
    compare_at_price?: number | null
  }>
  images: Array<{
    url: string
    alt_text?: string | null
  }>
  is_featured?: boolean
}

interface FeaturedProductsSliderProps {
  products: Product[]
}

export function FeaturedProductsSlider({ products }: FeaturedProductsSliderProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (products.length === 0) return null

  return (
    <div className="space-y-6">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="h-[1px] bg-pure-black/20 dark:bg-white/20 relative">
          <div
            className="h-full bg-pure-black dark:bg-white transition-all duration-300"
            style={{ width: `${((current + 1) / count) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
