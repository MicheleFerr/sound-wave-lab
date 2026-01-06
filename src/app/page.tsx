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
      images:product_images(url, alt_text)
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Indossa la tua
                <span className="block text-brand-gradient">passione</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 max-w-lg mx-auto lg:mx-0">
                Magliette uniche con design originali.
                Qualità premium, spedizione gratuita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-base font-semibold bg-brand-gradient hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] border-0 !text-white shadow-lg rounded-lg px-6 transition-all duration-200">
                  <Link href="/products">
                    Esplora il catalogo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild className="text-base font-medium bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:scale-[1.01] active:scale-[0.99] rounded-lg px-6 transition-all duration-200">
                  <Link href="/products">
                    Novità
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-brand-gradient-strong rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-8 bg-brand-gradient-medium rounded-full blur-2xl"></div>
                <div className="relative flex items-center justify-center h-full">
                  <div className="relative">
                    <Music className="w-32 h-32 text-white/90" />
                    <Headphones className="absolute -top-4 -right-8 w-16 h-16 text-brand-teal-light" />
                    <Radio className="absolute -bottom-4 -left-8 w-16 h-16 text-brand-gold" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45.7C96 41 192 33 288 35.2C384 37 480 50 576 54.8C672 60 768 57 864 50C960 43 1056 33 1152 31.5C1248 30 1344 37 1392 40.5L1440 44V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white" className="dark:fill-zinc-950"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Esplora per categoria</h2>
            <p className="text-muted-foreground mt-2">Trova il design perfetto per te</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
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
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-white dark:bg-zinc-900">
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
      <section className="py-12 md:py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Qualità Premium</h3>
              <p className="text-muted-foreground text-sm">
                100% cotone organico, stampa di alta qualità che dura nel tempo
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Spedizione Gratuita</h3>
              <p className="text-muted-foreground text-sm">
                Spedizione gratuita per ordini superiori a €50 in tutta Italia
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-gradient-light flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Reso Facile</h3>
              <p className="text-muted-foreground text-sm">
                30 giorni per cambiare idea con reso gratuito
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
