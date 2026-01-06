// src/app/(info)/contatti/page.tsx
import { Metadata } from 'next'
import { getSiteSettings, PageContent } from '@/lib/site-settings'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = {
  title: 'Contatti | Sound Wave Lab',
  description: 'Contattaci per qualsiasi domanda o informazione sui nostri prodotti',
}

export default async function ContattiPage() {
  const settings = await getSiteSettings([
    'page_contatti',
    'contact_email',
    'contact_phone',
    'contact_address',
  ])

  const pageContent = settings.page_contatti as PageContent | undefined
  const email = (settings.contact_email as string) || 'info@soundwavelab.it'
  const phone = (settings.contact_phone as string) || '+39 02 1234567'
  const address = (settings.contact_address as string) || 'Via della Musica 42, 20121 Milano, Italia'

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pure-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl !text-white mb-4">
            {(pageContent?.title || 'Contatti').toUpperCase()}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm tracking-wide">
            {pageContent?.content || 'Hai domande? Contattaci! Siamo sempre disponibili per aiutarti.'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-heading-minimal text-lg">
                COME CONTATTARCI
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-grey flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-pure-black" />
                  </div>
                  <div>
                    <h3 className="text-label-caps text-[10px]">EMAIL</h3>
                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-pure-black transition-colors text-sm">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-grey flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-pure-black" />
                  </div>
                  <div>
                    <h3 className="text-label-caps text-[10px]">TELEFONO</h3>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-pure-black transition-colors text-sm">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-grey flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-pure-black" />
                  </div>
                  <div>
                    <h3 className="text-label-caps text-[10px]">INDIRIZZO</h3>
                    <p className="text-muted-foreground text-sm">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-grey flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-pure-black" />
                  </div>
                  <div>
                    <h3 className="text-label-caps text-[10px]">ORARI DI ASSISTENZA</h3>
                    <p className="text-muted-foreground text-sm">Lun-Ven: 9:00-18:00</p>
                    <p className="text-muted-foreground text-sm">Sab: 10:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-grey p-8">
              <h2 className="text-heading-minimal text-lg mb-6">
                SCRIVICI
              </h2>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Il tuo nome" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="La tua email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input id="subject" placeholder="Di cosa vuoi parlare?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio</Label>
                  <Textarea
                    id="message"
                    placeholder="Scrivi il tuo messaggio..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-filled"
                >
                  INVIA MESSAGGIO
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
