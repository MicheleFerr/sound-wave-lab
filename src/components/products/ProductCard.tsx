// src/components/products/ProductCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: {
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
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]
  const lowestPrice = Math.min(...product.variants.map(v => v.price))
  const highestComparePrice = Math.max(
    ...product.variants.map(v => v.compare_at_price || 0)
  )
  const hasDiscount = highestComparePrice > lowestPrice

  return (
    <Card className="group overflow-hidden offwhite-card hover:shadow-none transition-all duration-200">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-white border-b border-offwhite-black">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center offwhite-label">
              NO IMAGE
            </div>
          )}

          {/* Badges - Off-White Style */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <div className="offwhite-quote bg-white px-3 py-1.5 border border-offwhite-black">
                <span className="offwhite-label text-[10px]">FEATURED</span>
              </div>
            )}
            {hasDiscount && (
              <div className="bg-offwhite-red text-white px-3 py-1.5 border border-offwhite-black">
                <span className="font-bold text-xs tracking-wider">
                  -{Math.round((1 - lowestPrice / highestComparePrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Quick add button - Off-White Style */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <Button className="offwhite-button-filled w-full py-3 text-xs" size="sm">
              ADD TO CART
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4 md:p-5 space-y-3">
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="offwhite-label text-[10px] hover:underline block"
          >
            {product.category.name.toUpperCase()}
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="offwhite-title text-xs md:text-sm leading-tight line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="offwhite-price text-sm md:text-base">
            EUR {lowestPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="offwhite-price text-xs line-through opacity-50">
              EUR {highestComparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile add button - Off-White Style */}
        <Button className="offwhite-button w-full mt-2 md:hidden py-3 text-xs" size="sm">
          ADD TO CART
        </Button>
      </CardContent>
    </Card>
  )
}
