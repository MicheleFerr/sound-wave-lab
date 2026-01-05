// src/app/search/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/products'
import { SearchForm } from '@/components/search/SearchForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

async function searchProducts(query?: string) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      is_featured,
      category:categories(id, name, slug),
      variants:product_variants(id, price, compare_at_price),
      images:product_images(url, alt_text)
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  return products || []
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const productsRaw = await searchProducts(query)

  const products = productsRaw.map(p => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] : p.category
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            <span className="text-brand-gradient">Cerca Prodotti</span>
          </h1>
          <p className="text-zinc-300 text-center mt-2">
            Trova la maglietta perfetta per te
          </p>
        </div>
      </section>

      {/* Search Form & Results */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchForm initialQuery={query} />
          </div>

          {/* Results */}
          {query ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-muted-foreground">
                  {products.length > 0 ? (
                    <>
                      <span className="font-semibold text-foreground">{products.length}</span>{' '}
                      {products.length === 1 ? 'risultato' : 'risultati'} per{' '}
                      <span className="font-semibold text-brand-teal">&quot;{query}&quot;</span>
                    </>
                  ) : (
                    <>
                      Nessun risultato per{' '}
                      <span className="font-semibold text-brand-teal">&quot;{query}&quot;</span>
                    </>
                  )}
                </p>
              </div>

              <Suspense fallback={<ProductGridSkeleton />}>
                {products.length > 0 ? (
                  <ProductGrid products={products} columns={4} />
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gradient-light flex items-center justify-center">
                      <Search className="w-8 h-8 text-brand-teal" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nessun prodotto trovato</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Prova con termini di ricerca diversi o esplora le nostre categorie
                    </p>
                  </div>
                )}
              </Suspense>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gradient-light flex items-center justify-center">
                <Search className="w-8 h-8 text-brand-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cosa stai cercando?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Inserisci il nome del prodotto o una descrizione per iniziare la ricerca
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
