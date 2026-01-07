// src/emails/OrderShipped.tsx
import {
  Button,
  Hr,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/Layout'

interface OrderShippedProps {
  orderNumber: string
  customerName: string
  trackingNumber: string
  carrier: string
  trackingUrl?: string | null
}

export function OrderShippedEmail({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  trackingUrl,
}: OrderShippedProps) {

  return (
    <EmailLayout preview={`Il tuo ordine #${orderNumber} è stato spedito!`}>
      {/* Heading */}
      <Text style={heading}>Il tuo ordine è in viaggio!</Text>
      <Text style={paragraph}>
        Ciao {customerName || 'Cliente'},
      </Text>
      <Text style={paragraph}>
        Ottime notizie! Il tuo ordine <strong>#{orderNumber}</strong> è stato spedito
        e sta arrivando da te.
      </Text>

      <Hr style={hr} />

      {/* Tracking Info */}
      <Section style={trackingBox}>
        <Text style={trackingLabel}>DETTAGLI SPEDIZIONE</Text>
        <Text style={carrierText}>Corriere: {carrier}</Text>
        <Text style={trackingNumberText}>Tracking: {trackingNumber}</Text>

        {trackingUrl && (
          <Button href={trackingUrl} style={trackButton}>
            TRACCIA IL TUO PACCO
          </Button>
        )}
      </Section>

      <Hr style={hr} />

      {/* Timeline */}
      <Text style={sectionTitle}>COSA ASPETTARTI</Text>
      <Text style={paragraph}>
        La consegna è prevista entro <strong>3-5 giorni lavorativi</strong>.
        Riceverai aggiornamenti dal corriere durante la spedizione.
      </Text>
      <Text style={paragraph}>
        Se non sei a casa al momento della consegna, il corriere lascerà
        un avviso e potrai organizzare una nuova consegna.
      </Text>

      <Hr style={hr} />

      {/* Support */}
      <Text style={supportText}>
        Hai domande sulla tua spedizione? Rispondi a questa email o
        contattaci a support@soundwavelab.it
      </Text>
    </EmailLayout>
  )
}

export default OrderShippedEmail

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px',
}

const paragraph = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#333333',
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '24px 0',
}

const trackingBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '4px',
}

const trackingLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#166534',
  margin: '0 0 12px',
  fontWeight: 'bold',
}

const carrierText = {
  fontSize: '14px',
  color: '#333333',
  margin: '0 0 4px',
}

const trackingNumberText = {
  fontSize: '18px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px',
}

const trackButton = {
  backgroundColor: '#000000',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  padding: '12px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}

const sectionTitle = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#666666',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const supportText = {
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0',
}
