// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductVariantSelector } from '@/components/products/ProductVariantSelector'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { ProductGrid } from '@/components/products'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Truck, RefreshCcw, Shield } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      is_featured,
      is_active,
      category_id,
      category:categories(id, name, slug),
      variants:product_variants(id, price, compare_at_price, stock_quantity, sku, attributes),
      images:product_images(id, url, alt_text, sort_order)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return product
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      is_featured,
      category:categories(name, slug),
      variants:product_variants(id, price, compare_at_price),
      images:product_images(url, alt_text)
    `)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .limit(4)

  return products || []
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Prodotto non trovato' }
  }

  return {
    title: `${product.name} | Sound Wave Lab`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const productRaw = await getProduct(slug)

  if (!productRaw) {
    notFound()
  }

  // Normalize product category
  const product = {
    ...productRaw,
    category: Array.isArray(productRaw.category) ? productRaw.category[0] : productRaw.category
  }

  const relatedProductsRaw = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : []
  
  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category
  }))

  const lowestPrice = Math.min(...product.variants.map(v => v.price))
  const highestComparePrice = Math.max(...product.variants.map(v => v.compare_at_price || 0))
  const hasDiscount = highestComparePrice > lowestPrice
  const discountPercentage = hasDiscount
    ? Math.round((1 - lowestPrice / highestComparePrice) * 100)
    : 0

  // Sort images by sort_order
  const sortedImages = [...product.images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Prodotti
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <ProductImageGallery images={sortedImages} productName={product.name} />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <Link href={`/products?category=${product.category.slug}`}>
                <Badge
                  variant="outline"
                  className="bg-brand-gradient-light border-brand-teal/30 text-brand-teal dark:text-brand-teal-light"
                >
                  {product.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand-gradient">
                €{lowestPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    €{highestComparePrice.toFixed(2)}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    -{discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant Selector & Add to Cart */}
            <ProductVariantSelector
              productId={product.id}
              productName={product.name}
              variants={product.variants}
              images={sortedImages}
            />

            {/* Trust Badges */}
            <div className="border-t pt-6 mt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                    <Truck className="h-5 w-5 text-brand-teal" />
                  </div>
                  <p className="text-xs text-muted-foreground">Spedizione Gratuita oltre €50</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                    <RefreshCcw className="h-5 w-5 text-brand-teal" />
                  </div>
                  <p className="text-xs text-muted-foreground">Reso Gratuito 30 giorni</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                    <Shield className="h-5 w-5 text-brand-teal" />
                  </div>
                  <p className="text-xs text-muted-foreground">Pagamento Sicuro</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-2xl font-bold mb-8">
              <span className="text-brand-gradient">
                Prodotti Correlati
              </span>
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  )
}
