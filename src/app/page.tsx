// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Headphones, Music, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { FeaturedProductsSlider } from '@/components/products'

async function getFeaturedProducts() {
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
      images:product_images(url, alt_text, sort_order)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return products || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .order('sort_order')
    .limit(4)

  return categories || []
}

export default async function Home() {
  const [rawFeaturedProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  const featuredProducts = rawFeaturedProducts.map(product => ({
    ...product,
    category: Array.isArray(product.category) ? product.category[0] : product.category
  }))


  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal Style */}
      <section className="relative bg-pure-black text-white">
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-heading-minimal text-3xl md:text-4xl lg:text-5xl tracking-wider !text-white">
              INDOSSA LA TUA
              <span className="block text-accent-yellow mt-2">PASSIONE</span>
            </h1>
            <p className="text-sm md:text-base text-white/70 mt-6 max-w-md tracking-wide">
              Magliette uniche con design originali.
              Qualità premium, spedizione gratuita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" asChild className="btn-filled !bg-white !text-black hover:!bg-white/90 text-xs tracking-wider">
                <Link href="/products">
                  ESPLORA IL CATALOGO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-outline !border-white !text-white hover:!bg-white hover:!text-black text-xs tracking-wider">
                <Link href="/products?sort=newest">
                  NOVITÀ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-heading-minimal text-xl md:text-2xl tracking-wider">ESPLORA PER CATEGORIA</h2>
            <p className="text-label-caps text-[10px] mt-3 opacity-60">TROVA IL DESIGN PERFETTO PER TE</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-grey"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized={category.image_url.startsWith('/api/placeholder')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {category.slug === 'synth' && <Headphones className="w-16 h-16 text-zinc-400" />}
                    {category.slug === 'dj' && <Radio className="w-16 h-16 text-zinc-400" />}
                    {category.slug === 'vintage' && <Music className="w-16 h-16 text-zinc-400" />}
                    {category.slug === 'minimal' && <div className="w-16 h-16 border-4 border-zinc-400 rounded-full" />}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white text-heading-minimal text-sm tracking-wider !text-white">{category.name.toUpperCase()}</h3>
                  <p className="text-white/70 text-xs mt-1 line-clamp-1 tracking-wide">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-heading-minimal text-xl md:text-2xl tracking-wider">PRODOTTI IN EVIDENZA</h2>
              <p className="text-label-caps text-[10px] mt-2 opacity-60">TORNATI DISPONIBILI</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex btn-outline text-[10px] py-2 px-4">
              <Link href="/products">
                VEDI TUTTI
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <FeaturedProductsSlider products={featuredProducts} />

          <div className="mt-8 text-center md:hidden">
            <Button asChild className="btn-filled text-xs">
              <Link href="/products">
                VEDI TUTTI I PRODOTTI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-12 md:py-16 bg-neutral-grey">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto border-2 border-pure-black flex items-center justify-center">
                <svg className="w-6 h-6 text-pure-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-heading-minimal text-sm tracking-wider">QUALITÀ PREMIUM</h3>
              <p className="text-xs tracking-wide opacity-70">
                100% COTONE ORGANICO, STAMPA DI ALTA QUALITÀ CHE DURA NEL TEMPO
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto border-2 border-pure-black flex items-center justify-center">
                <svg className="w-6 h-6 text-pure-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-heading-minimal text-sm tracking-wider">SPEDIZIONE GRATUITA</h3>
              <p className="text-xs tracking-wide opacity-70">
                SPEDIZIONE GRATUITA PER ORDINI SUPERIORI A €50 IN TUTTA ITALIA
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto border-2 border-pure-black flex items-center justify-center">
                <svg className="w-6 h-6 text-pure-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-heading-minimal text-sm tracking-wider">RESO FACILE</h3>
              <p className="text-xs tracking-wide opacity-70">
                30 GIORNI PER CAMBIARE IDEA CON RESO GRATUITO
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
