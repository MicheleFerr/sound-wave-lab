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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-brand-gradient">
              {pageContent?.title || 'Spedizioni'}
            </span>
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto text-lg">
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
              <div className="bg-brand-gradient-subtle rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-gradient-medium flex items-center justify-center mb-4">
                  <Truck className="w-7 h-7 text-brand-teal" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Spedizione Gratuita</h3>
                <p className="text-muted-foreground text-sm">
                  Per ordini superiori a €50
                </p>
              </div>
              <div className="bg-brand-gradient-subtle rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-gradient-medium flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-brand-teal" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Consegna Rapida</h3>
                <p className="text-muted-foreground text-sm">
                  2-4 giorni lavorativi
                </p>
              </div>
              <div className="bg-brand-gradient-subtle rounded-xl p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-gradient-medium flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-brand-teal" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Tracciamento</h3>
                <p className="text-muted-foreground text-sm">
                  Segui il tuo ordine in tempo reale
                </p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-8">
              {/* Shipping Costs */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                  Costi di Spedizione
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
              <div className="bg-white dark:bg-zinc-900 rounded-xl border p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-teal" />
                  Tempi di Consegna
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
              <div className="bg-brand-gradient-subtle rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6">
                  <span className="text-brand-gradient">
                    Come Funziona
                  </span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Effettua l&apos;ordine</h3>
                      <p className="text-muted-foreground text-sm">
                        Scegli i tuoi prodotti e completa l&apos;acquisto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Ricevi la conferma</h3>
                      <p className="text-muted-foreground text-sm">
                        Ti inviamo un&apos;email con tutti i dettagli dell&apos;ordine
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Traccia la spedizione</h3>
                      <p className="text-muted-foreground text-sm">
                        Ricevi il codice di tracciamento e segui il pacco in tempo reale
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Consegna a casa tua</h3>
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
