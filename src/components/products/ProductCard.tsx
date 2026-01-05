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
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge className="bg-primary text-primary-foreground">
                In evidenza
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                -{Math.round((1 - lowestPrice / highestComparePrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Quick add button - visible on hover (desktop) */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <Button className="w-full" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Aggiungi al carrello
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-3 md:p-4">
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm md:text-base mt-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-base md:text-lg">
            €{lowestPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              €{highestComparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile add button */}
        <Button className="w-full mt-3 md:hidden" size="sm">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </CardContent>
    </Card>
  )
}
