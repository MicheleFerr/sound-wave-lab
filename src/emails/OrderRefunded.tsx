// src/emails/OrderRefunded.tsx
import {
  Button,
  Hr,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/Layout'

interface OrderRefundedProps {
  orderNumber: string
  customerName: string
  refundAmount: number
  refundReason?: string
  isPartial: boolean
  estimatedDays: string
}

export function OrderRefundedEmail({
  orderNumber,
  customerName,
  refundAmount,
  refundReason,
  isPartial,
  estimatedDays = '5-10 giorni lavorativi',
}: OrderRefundedProps) {

  return (
    <EmailLayout preview={`Rimborso per l'ordine #${orderNumber}`}>
      {/* Heading */}
      <Text style={heading}>
        {isPartial ? 'Rimborso Parziale Elaborato' : 'Rimborso Completo Elaborato'}
      </Text>
      <Text style={paragraph}>
        Ciao {customerName || 'Cliente'},
      </Text>
      <Text style={paragraph}>
        {isPartial
          ? `È stato elaborato un rimborso parziale per il tuo ordine `
          : `È stato elaborato il rimborso completo per il tuo ordine `}
        <strong>#{orderNumber}</strong>.
      </Text>

      <Hr style={hr} />

      {/* Refund Amount */}
      <Section style={refundBox}>
        <Text style={refundLabel}>IMPORTO RIMBORSATO</Text>
        <Text style={amountText}>€{refundAmount.toFixed(2)}</Text>
        {refundReason && (
          <Text style={reasonText}>Motivo: {refundReason}</Text>
        )}
      </Section>

      <Hr style={hr} />

      {/* Timeline */}
      <Text style={sectionTitle}>QUANDO RICEVERAI IL RIMBORSO?</Text>
      <Text style={paragraph}>
        Il rimborso è stato inviato al tuo metodo di pagamento originale e dovrebbe
        essere visibile entro <strong>{estimatedDays}</strong>.
      </Text>
      <Section style={timelineBox}>
        <div style={timelineItem}>
          <Text style={timelineNumber}>1</Text>
          <div>
            <Text style={timelineTitle}>Elaborazione</Text>
            <Text style={timelineDesc}>Il rimborso è stato inviato (completato)</Text>
          </div>
        </div>
        <div style={timelineItem}>
          <Text style={timelineNumber}>2</Text>
          <div>
            <Text style={timelineTitle}>Circuito bancario</Text>
            <Text style={timelineDesc}>2-5 giorni lavorativi</Text>
          </div>
        </div>
        <div style={timelineItem}>
          <Text style={timelineNumber}>3</Text>
          <div>
            <Text style={timelineTitle}>Accredito sul conto</Text>
            <Text style={timelineDesc}>Visibile nell'estratto conto</Text>
          </div>
        </div>
      </Section>

      <Text style={smallText}>
        <strong>Nota:</strong> I tempi effettivi possono variare in base alla tua banca
        o al circuito della carta di credito. Se dopo 10 giorni lavorativi non vedi
        l'accredito, contatta la tua banca.
      </Text>

      <Hr style={hr} />

      {/* Order Status */}
      {!isPartial && (
        <>
          <Text style={sectionTitle}>STATO DELL'ORDINE</Text>
          <Text style={paragraph}>
            L'ordine #{orderNumber} è stato cancellato e non verrà spedito.
          </Text>
        </>
      )}

      <Hr style={hr} />

      {/* Support */}
      <Text style={supportText}>
        Domande sul rimborso? Rispondi a questa email o contattaci a
        support@soundwavelab.it includendo il numero ordine.
      </Text>

      <Button href="https://sound-wave-lab.vercel.app/account/ordini" style={button}>
        VEDI I MIEI ORDINI
      </Button>
    </EmailLayout>
  )
}

export default OrderRefundedEmail

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#059669',
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

const refundBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #10b981',
  padding: '24px',
  textAlign: 'center' as const,
  borderRadius: '4px',
}

const refundLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#065f46',
  margin: '0 0 8px',
  fontWeight: 'bold',
}

const amountText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#065f46',
  margin: '0 0 8px',
}

const reasonText = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0',
  fontStyle: 'italic',
}

const sectionTitle = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#666666',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const timelineBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '4px',
  marginBottom: '16px',
}

const timelineItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
}

const timelineNumber = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
  marginRight: '16px',
  flexShrink: 0,
}

const timelineTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 4px',
}

const timelineDesc = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0',
}

const smallText = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: '18px',
  margin: '0 0 16px',
}

const supportText = {
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const button = {
  backgroundColor: '#000000',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  margin: '0 auto',
}
