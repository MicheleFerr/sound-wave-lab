// src/emails/OrderCancelled.tsx
import {
  Button,
  Hr,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/Layout'

interface OrderCancelledProps {
  orderNumber: string
  customerName: string
  cancellationReason?: string
  willBeRefunded: boolean
  refundAmount?: number
  estimatedRefundDays?: string
}

export function OrderCancelledEmail({
  orderNumber,
  customerName,
  cancellationReason,
  willBeRefunded,
  refundAmount,
  estimatedRefundDays = '5-10 giorni lavorativi',
}: OrderCancelledProps) {

  return (
    <EmailLayout preview={`Il tuo ordine #${orderNumber} è stato annullato`}>
      {/* Heading */}
      <Text style={heading}>Ordine Annullato</Text>
      <Text style={paragraph}>
        Ciao {customerName || 'Cliente'},
      </Text>
      <Text style={paragraph}>
        Il tuo ordine <strong>#{orderNumber}</strong> è stato annullato.
      </Text>

      {cancellationReason && (
        <>
          <Hr style={hr} />
          <Section style={reasonBox}>
            <Text style={reasonLabel}>MOTIVO DELLA CANCELLAZIONE</Text>
            <Text style={reasonText}>{cancellationReason}</Text>
          </Section>
        </>
      )}

      <Hr style={hr} />

      {/* Refund Info */}
      {willBeRefunded && refundAmount ? (
        <>
          <Text style={sectionTitle}>INFORMAZIONI SUL RIMBORSO</Text>
          <Section style={refundBox}>
            <Text style={amountText}>Importo: €{refundAmount.toFixed(2)}</Text>
            <Text style={paragraph}>
              Il rimborso verrà elaborato entro <strong>{estimatedRefundDays}</strong> e
              accreditato sul metodo di pagamento originale.
            </Text>
            <Text style={smallText}>
              I tempi effettivi di accredito possono variare in base alla tua banca
              o al circuito della carta di credito.
            </Text>
          </Section>
        </>
      ) : (
        <Text style={paragraph}>
          Non è stato effettuato alcun addebito per questo ordine, quindi non è
          necessario alcun rimborso.
        </Text>
      )}

      <Hr style={hr} />

      {/* EU Withdrawal Rights Notice */}
      <Section style={legalBox}>
        <Text style={legalTitle}>I TUOI DIRITTI</Text>
        <Text style={legalText}>
          In base alla normativa europea sui diritti dei consumatori, hai il diritto
          di annullare un ordine entro 14 giorni dalla ricezione senza fornire
          alcuna motivazione.
        </Text>
      </Section>

      <Hr style={hr} />

      {/* Support */}
      <Text style={supportText}>
        Hai domande sulla cancellazione o sul rimborso? Rispondi a questa email o
        contattaci a support@soundwavelab.it
      </Text>

      <Button href="https://sound-wave-lab.vercel.app/account/ordini" style={button}>
        VEDI I MIEI ORDINI
      </Button>
    </EmailLayout>
  )
}

export default OrderCancelledEmail

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#dc2626',
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

const reasonBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  padding: '20px',
  borderRadius: '4px',
  marginBottom: '16px',
}

const reasonLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#991b1b',
  margin: '0 0 8px',
  fontWeight: 'bold',
}

const reasonText = {
  fontSize: '14px',
  color: '#333333',
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

const refundBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  padding: '20px',
  borderRadius: '4px',
}

const amountText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#166534',
  margin: '0 0 12px',
}

const smallText = {
  fontSize: '12px',
  color: '#666666',
  margin: '0',
}

const legalBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  padding: '16px',
  borderRadius: '4px',
}

const legalTitle = {
  fontSize: '12px',
  letterSpacing: '1px',
  color: '#374151',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const legalText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '18px',
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
