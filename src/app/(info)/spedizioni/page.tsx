// src/app/(info)/spedizioni/page.tsx
import { Metadata } from 'next'
import { getSiteSetting, PageContent } from '@/lib/site-settings'
import { Truck, Package, Clock, MapPin, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spedizioni | Sound Wave Lab',
  description: 'Informazioni su spedizioni, tempi di consegna e costi di spedizione',
}

export default async function SpedizioniPage() {
  const pageContent = await getSiteSetting<PageContent>('page_spedizioni')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pure-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl !text-white mb-4">
            {(pageContent?.title || 'Spedizioni').toUpperCase()}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm tracking-wide">
            {pageContent?.content || 'Spediamo in tutta Italia con corriere espresso'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Key Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-neutral-grey p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                  <Truck className="w-7 h-7 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm mb-2">SPEDIZIONE GRATUITA</h3>
                <p className="text-muted-foreground text-sm">
                  Per ordini superiori a €50
                </p>
              </div>
              <div className="bg-neutral-grey p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm mb-2">CONSEGNA RAPIDA</h3>
                <p className="text-muted-foreground text-sm">
                  2-4 giorni lavorativi
                </p>
              </div>
              <div className="bg-neutral-grey p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-pure-black" />
                </div>
                <h3 className="text-heading-minimal text-sm mb-2">TRACCIAMENTO</h3>
                <p className="text-muted-foreground text-sm">
                  Segui il tuo ordine in tempo reale
                </p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-8">
              {/* Shipping Costs */}
              <div className="bg-white border border-pure-black/10 p-6 md:p-8">
                <h2 className="text-heading-minimal text-sm mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pure-black" />
                  COSTI DI SPEDIZIONE
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Italia (standard)</span>
                    <span className="font-semibold">€4.99</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Italia (ordini oltre €50)</span>
                    <span className="font-semibold text-green-600">Gratuita</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Europa</span>
                    <span className="font-semibold">€9.99</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Resto del Mondo</span>
                    <span className="font-semibold">€14.99</span>
                  </div>
                </div>
              </div>

              {/* Delivery Times */}
              <div className="bg-white border border-pure-black/10 p-6 md:p-8">
                <h2 className="text-heading-minimal text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pure-black" />
                  TEMPI DI CONSEGNA
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Italia</span>
                    <span className="font-semibold">2-4 giorni lavorativi</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Europa</span>
                    <span className="font-semibold">5-7 giorni lavorativi</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Resto del Mondo</span>
                    <span className="font-semibold">10-15 giorni lavorativi</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  * I tempi di consegna sono indicativi e possono variare in base alla destinazione.
                </p>
              </div>

              {/* How it Works */}
              <div className="bg-neutral-grey p-6 md:p-8">
                <h2 className="text-heading-minimal text-sm mb-6">
                  COME FUNZIONA
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pure-black text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-label-caps text-[10px]">EFFETTUA L&apos;ORDINE</h3>
                      <p className="text-muted-foreground text-sm">
                        Scegli i tuoi prodotti e completa l&apos;acquisto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pure-black text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-label-caps text-[10px]">RICEVI LA CONFERMA</h3>
                      <p className="text-muted-foreground text-sm">
                        Ti inviamo un&apos;email con tutti i dettagli dell&apos;ordine
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pure-black text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-label-caps text-[10px]">TRACCIA LA SPEDIZIONE</h3>
                      <p className="text-muted-foreground text-sm">
                        Ricevi il codice di tracciamento e segui il pacco in tempo reale
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-pure-black text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-label-caps text-[10px]">CONSEGNA A CASA TUA</h3>
                      <p className="text-muted-foreground text-sm">
                        Ricevi il tuo ordine comodamente a casa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
