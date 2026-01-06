// src/app/products/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/products'
import { ProductFilters } from '@/components/products/ProductFilters'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    search?: string
  }>
}

async function getProducts(categorySlug?: string, sort?: string, search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      is_featured,
      category:categories(id, name, slug),
      variants:product_variants(id, price, compare_at_price),
      images:product_images(url, alt_text, sort_order)
    `)
    .eq('is_active', true)

  // Filter by category
  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  // Search by name
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      query = query.order('created_at', { ascending: true })
      break
    case 'price-desc':
      query = query.order('created_at', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return products || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order')

  return categories || []
}

async function getCategoryName(slug?: string) {
  if (!slug) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()

  return data?.name || null
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { category, sort, search } = params

  const [productsRaw, categories, categoryName] = await Promise.all([
    getProducts(category, sort, search),
    getCategories(),
    getCategoryName(category),
  ])

  const products = productsRaw.map(p => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category
  }))

  const pageTitle = categoryName ? `Collezione ${categoryName}` : 'Tutti i Prodotti'
  const pageDescription = categoryName
    ? `Scopri la nostra collezione di magliette ${categoryName}`
    : 'Esplora il nostro catalogo completo di magliette con design originali'

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-pure-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl text-center !text-white">
            {pageTitle.toUpperCase()}
          </h1>
          <p className="text-white/70 text-center mt-4 max-w-2xl mx-auto text-sm tracking-wide">
            {pageDescription}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <ProductFilters
            categories={categories}
            currentCategory={category}
            currentSort={sort}
            currentSearch={search}
            productCount={products.length}
          />

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            {products.length > 0 ? (
              <ProductGrid products={products} columns={4} />
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-grey flex items-center justify-center">
                  <svg className="w-8 h-8 text-pure-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-heading-minimal text-sm mb-2">NESSUN PRODOTTO TROVATO</h3>
                <p className="text-muted-foreground text-sm">
                  Prova a modificare i filtri o cerca qualcos&apos;altro
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  )
}
