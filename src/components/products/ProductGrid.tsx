// src/components/products/ProductGrid.tsx
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  is_featured?: boolean
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
}

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">
          Nessun prodotto trovato
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Prova a modificare i filtri di ricerca
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
