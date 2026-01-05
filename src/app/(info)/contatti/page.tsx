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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-brand-gradient">
              {pageContent?.title || 'Contatti'}
            </span>
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto text-lg">
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
              <h2 className="text-2xl font-bold">
                <span className="text-brand-gradient">
                  Come contattarci
                </span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient-medium flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-brand-teal transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient-medium flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Telefono</h3>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-brand-teal transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient-medium flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Indirizzo</h3>
                    <p className="text-muted-foreground">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient-medium flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Orari di assistenza</h3>
                    <p className="text-muted-foreground">Lun-Ven: 9:00-18:00</p>
                    <p className="text-muted-foreground">Sab: 10:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-brand-gradient-subtle rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-brand-gradient">
                  Scrivici
                </span>
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
                  className="w-full bg-brand-gradient bg-brand-gradient-hover !text-white"
                >
                  Invia messaggio
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
