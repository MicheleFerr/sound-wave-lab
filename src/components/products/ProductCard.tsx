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
      sort_order?: number
    }>
    is_featured?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // Sort images by sort_order for consistent primary/secondary
  const sortedImages = [...product.images].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )
  const primaryImage = sortedImages[0]
  const secondaryImage = sortedImages[1] // For hover effect (Off-White style)
  const lowestPrice = Math.min(...product.variants.map(v => v.price))
  const highestComparePrice = Math.max(
    ...product.variants.map(v => v.compare_at_price || 0)
  )
  const hasDiscount = highestComparePrice > lowestPrice

  return (
    <Card className="group overflow-hidden border shadow-none hover:shadow-none transition-all duration-200 bg-white !p-0 !gap-0 rounded-none">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-neutral-grey">
          {primaryImage ? (
            <>
              {/* Primary image - visible by default, fades out on hover if secondary exists */}
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text || product.name}
                fill
                className={`object-cover transition-all duration-500 ease-out ${
                  secondaryImage
                    ? 'group-hover:opacity-0 group-hover:scale-105'
                    : 'group-hover:scale-110'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Secondary image - hidden by default, fades in on hover (Off-White effect) */}
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt_text || `${product.name} - vista alternativa`}
                  fill
                  className="object-cover opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-label-caps">
              NESSUNA IMMAGINE
            </div>
          )}

          {/* Discount Badge Only */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <div className="bg-accent-red text-white px-3 py-1.5 border border-pure-black">
                <span className="font-bold text-xs tracking-wider">
                  -{Math.round((1 - lowestPrice / highestComparePrice) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Quick add button - Minimal Style */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <Button className="btn-filled w-full py-3 text-xs" size="sm">
              AGGIUNGI AL CARRELLO
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2 bg-white">
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-label-caps text-[10px] hover:underline block"
          >
            {product.category.name.toUpperCase()}
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-heading-minimal text-xs md:text-sm leading-tight line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-price-mono text-sm md:text-base">
            €{lowestPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-price-mono text-xs line-through opacity-50">
              €{highestComparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Featured/Stock Status */}
        {product.is_featured && (
          <p className="text-label-caps text-[9px] tracking-wide opacity-60">
            TORNATO DISPONIBILE
          </p>
        )}

        {/* Mobile add button - Minimal Style */}
        <Button className="btn-outline w-full mt-2 md:hidden py-3 text-xs" size="sm">
          AGGIUNGI AL CARRELLO
        </Button>
      </CardContent>
    </Card>
  )
}
