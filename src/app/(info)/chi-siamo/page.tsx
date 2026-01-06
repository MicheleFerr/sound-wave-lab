// src/app/(info)/chi-siamo/page.tsx
import { Metadata } from 'next'
import { getSiteSetting, PageContent } from '@/lib/site-settings'
import { Sparkles, Heart, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chi Siamo | Sound Wave Lab',
  description: 'Scopri la storia di Sound Wave Lab - magliette uniche per chi ama distinguersi',
}

export default async function ChiSiamoPage() {
  const pageContent = await getSiteSetting<PageContent>('page_chi_siamo')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pure-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl !text-white mb-4">
            {(pageContent?.title || 'Chi Siamo').toUpperCase()}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm tracking-wide">
            La passione per il design incontra la qualità
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Main Content */}
            <div className="prose prose-lg mx-auto">
              <p className="text-base text-muted-foreground leading-relaxed">
                {pageContent?.content || 'Sound Wave Lab nasce dalla passione per il design e la qualità. Creiamo magliette uniche per chi ama distinguersi.'}
              </p>
            </div>

            {/* Values Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-grey flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm">DESIGN UNICI</h3>
                <p className="text-muted-foreground text-sm">
                  Ogni design nasce dalla creatività e dall&apos;attenzione ai dettagli
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-grey flex items-center justify-center">
                  <Star className="w-8 h-8 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm">QUALITÀ PREMIUM</h3>
                <p className="text-muted-foreground text-sm">
                  Solo materiali di prima scelta e stampe di alta qualità
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-grey flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm">MADE WITH LOVE</h3>
                <p className="text-muted-foreground text-sm">
                  Ogni maglietta è progettata con cura per gli appassionati come noi
                </p>
              </div>
            </div>

            {/* Story Section */}
            <div className="mt-16 bg-neutral-grey p-8 md:p-12">
              <h2 className="text-heading-minimal text-lg mb-4">
                LA NOSTRA STORIA
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm">
                <p>
                  Sound Wave Lab è nato nel 2024 da un gruppo di amici appassionati di design e moda.
                  Stanchi delle solite magliette generiche, abbiamo deciso di creare qualcosa di diverso:
                  abbigliamento che fa la differenza.
                </p>
                <p>
                  I nostri design sono pensati per chi vuole distinguersi: originali, creativi,
                  realizzati con materiali di alta qualità.
                </p>
                <p>
                  Ogni maglietta racconta una storia, esprime una personalità.
                  Perché lo stile non si compra, si indossa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
