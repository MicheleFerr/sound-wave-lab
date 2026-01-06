// src/app/(legal)/termini/page.tsx
import { Metadata } from 'next'
import { getSiteSetting, PageContent } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Termini e Condizioni | Sound Wave Lab',
  description: 'Termini e condizioni di utilizzo del sito e di vendita',
}

export default async function TerminiPage() {
  const pageContent = await getSiteSetting<PageContent>('page_termini')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-pure-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading-minimal text-2xl md:text-3xl lg:text-4xl !text-white mb-4">
            {(pageContent?.title || 'Termini e Condizioni').toUpperCase()}
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
              {pageContent?.content || 'Benvenuto su Sound Wave Lab. Utilizzando il nostro sito accetti i seguenti termini e condizioni.'}
            </p>

            <h2>1. Informazioni Generali</h2>
            <p>
              Il presente sito web è di proprietà di Sound Wave Lab, con sede legale in
              Via della Musica 42, 20121 Milano, Italia. L&apos;utilizzo del sito e l&apos;acquisto
              di prodotti comporta l&apos;accettazione dei presenti termini e condizioni.
            </p>

            <h2>2. Prodotti</h2>
            <p>
              I prodotti in vendita sono magliette con design originali.
              Le immagini dei prodotti sono puramente indicative e potrebbero
              presentare lievi differenze rispetto al prodotto reale.
              Ci impegniamo a descrivere accuratamente i nostri prodotti,
              ma non garantiamo che le descrizioni siano prive di errori.
            </p>

            <h2>3. Prezzi</h2>
            <p>
              Tutti i prezzi sono indicati in Euro e includono l&apos;IVA.
              I costi di spedizione sono indicati separatamente durante il checkout.
              Ci riserviamo il diritto di modificare i prezzi in qualsiasi momento,
              ma le modifiche non influiranno sugli ordini già confermati.
            </p>

            <h2>4. Ordini e Pagamenti</h2>
            <p>
              Per effettuare un ordine è necessario aggiungere i prodotti al carrello
              e completare la procedura di checkout. L&apos;ordine viene confermato
              solo dopo la ricezione del pagamento. Accettiamo pagamenti tramite
              carte di credito/debito e altri metodi disponibili su Stripe.
            </p>
            <p>
              Ci riserviamo il diritto di rifiutare o annullare ordini in caso
              di problemi con il pagamento o sospetta frode.
            </p>

            <h2>5. Spedizioni</h2>
            <p>
              Gli ordini vengono elaborati entro 1-2 giorni lavorativi.
              I tempi di consegna variano in base alla destinazione:
            </p>
            <ul>
              <li>Italia: 2-4 giorni lavorativi</li>
              <li>Europa: 5-7 giorni lavorativi</li>
              <li>Resto del mondo: 10-15 giorni lavorativi</li>
            </ul>
            <p>
              La spedizione è gratuita per ordini superiori a €50 in Italia.
            </p>

            <h2>6. Diritto di Recesso</h2>
            <p>
              Hai diritto di recedere dall&apos;acquisto entro 30 giorni dalla ricezione
              del prodotto, senza dover fornire alcuna motivazione.
              Per esercitare il diritto di recesso, contattaci indicando
              la tua intenzione di restituire il prodotto.
            </p>
            <p>
              I prodotti devono essere restituiti nelle condizioni originali,
              non utilizzati, con tutti i cartellini e l&apos;imballaggio originale.
              I costi di restituzione sono a carico del cliente, salvo difetti del prodotto.
            </p>

            <h2>7. Rimborsi</h2>
            <p>
              Una volta ricevuto e verificato il reso, procederemo al rimborso
              entro 14 giorni utilizzando lo stesso metodo di pagamento dell&apos;ordine.
              Il rimborso include il prezzo del prodotto, escluse le spese di spedizione
              originali (se applicabili).
            </p>

            <h2>8. Garanzia</h2>
            <p>
              Tutti i prodotti sono coperti dalla garanzia legale di conformità
              di 2 anni dalla data di consegna. In caso di difetti di conformità,
              hai diritto alla riparazione, sostituzione o rimborso del prodotto.
            </p>

            <h2>9. Proprietà Intellettuale</h2>
            <p>
              Tutti i contenuti del sito (design, testi, immagini, loghi) sono
              di proprietà esclusiva di Sound Wave Lab e sono protetti dalle
              leggi sul diritto d&apos;autore. È vietata la riproduzione non autorizzata.
            </p>

            <h2>10. Limitazione di Responsabilità</h2>
            <p>
              Non siamo responsabili per danni indiretti, perdite di profitto
              o altre conseguenze derivanti dall&apos;uso del sito o dei prodotti,
              nei limiti consentiti dalla legge.
            </p>

            <h2>11. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi termini in qualsiasi momento.
              Le modifiche saranno effettive dalla pubblicazione sul sito.
              Ti consigliamo di consultare periodicamente questa pagina.
            </p>

            <h2>12. Legge Applicabile</h2>
            <p>
              I presenti termini sono regolati dalla legge italiana.
              Per qualsiasi controversia sarà competente il Foro di Milano.
            </p>

            <h2>13. Contatti</h2>
            <p>
              Per qualsiasi domanda sui presenti termini, contattaci a:
              info@soundwavelab.it
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
