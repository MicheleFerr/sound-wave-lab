// src/app/(legal)/privacy/page.tsx
import { Metadata } from 'next'
import { getSiteSetting, PageContent } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sound Wave Lab',
  description: 'Informativa sulla privacy e trattamento dei dati personali',
}

export default async function PrivacyPage() {
  const pageContent = await getSiteSetting<PageContent>('page_privacy')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pure-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl !text-white mb-4">
            {(pageContent?.title || 'Privacy Policy').toUpperCase()}
          </h1>
          <p className="text-white/70 text-sm tracking-wide">
            Ultimo aggiornamento: Gennaio 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral">
            <p className="lead">
              {pageContent?.content || 'La tua privacy è importante per noi. Questa policy descrive come raccogliamo e utilizziamo i tuoi dati.'}
            </p>

            <h2>1. Titolare del Trattamento</h2>
            <p>
              Il titolare del trattamento dei dati è Sound Wave Lab, con sede in Via della Musica 42, 20121 Milano, Italia.
              Per qualsiasi informazione relativa al trattamento dei dati personali è possibile contattarci all&apos;indirizzo
              email: privacy@soundwavelab.it
            </p>

            <h2>2. Dati Raccolti</h2>
            <p>Raccogliamo i seguenti tipi di dati:</p>
            <ul>
              <li><strong>Dati di registrazione:</strong> nome, cognome, email, password</li>
              <li><strong>Dati di spedizione:</strong> indirizzo, città, CAP, numero di telefono</li>
              <li><strong>Dati di pagamento:</strong> gestiti in sicurezza tramite Stripe</li>
              <li><strong>Dati di navigazione:</strong> cookies, dati di utilizzo del sito</li>
            </ul>

            <h2>3. Finalità del Trattamento</h2>
            <p>I tuoi dati vengono utilizzati per:</p>
            <ul>
              <li>Gestire il tuo account e gli ordini</li>
              <li>Elaborare i pagamenti e le spedizioni</li>
              <li>Inviarti comunicazioni relative agli ordini</li>
              <li>Con il tuo consenso, inviarti newsletter e offerte promozionali</li>
              <li>Migliorare i nostri servizi e l&apos;esperienza utente</li>
            </ul>

            <h2>4. Base Giuridica</h2>
            <p>
              Il trattamento dei tuoi dati si basa su: esecuzione del contratto di vendita,
              adempimento di obblighi legali, tuo consenso per finalità di marketing,
              e nostro legittimo interesse per migliorare i servizi.
            </p>

            <h2>5. Conservazione dei Dati</h2>
            <p>
              I tuoi dati vengono conservati per il tempo necessario a soddisfare le finalità
              per cui sono stati raccolti, nel rispetto dei termini di legge.
              I dati relativi agli ordini sono conservati per 10 anni per obblighi fiscali.
            </p>

            <h2>6. Condivisione dei Dati</h2>
            <p>I tuoi dati possono essere condivisi con:</p>
            <ul>
              <li>Corrieri per la consegna degli ordini</li>
              <li>Stripe per l&apos;elaborazione dei pagamenti</li>
              <li>Provider di servizi email per le comunicazioni</li>
            </ul>
            <p>Non vendiamo mai i tuoi dati a terze parti.</p>

            <h2>7. I Tuoi Diritti</h2>
            <p>Hai il diritto di:</p>
            <ul>
              <li>Accedere ai tuoi dati personali</li>
              <li>Richiedere la rettifica o la cancellazione dei dati</li>
              <li>Opporti al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              Utilizziamo cookies tecnici necessari per il funzionamento del sito
              e cookies analitici per migliorare la tua esperienza.
              Puoi gestire le preferenze sui cookies in qualsiasi momento.
            </p>

            <h2>9. Sicurezza</h2>
            <p>
              Adottiamo misure di sicurezza tecniche e organizzative per proteggere
              i tuoi dati da accessi non autorizzati, perdita o distruzione.
            </p>

            <h2>10. Contatti</h2>
            <p>
              Per esercitare i tuoi diritti o per qualsiasi domanda sulla privacy,
              contattaci a: privacy@soundwavelab.it
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
