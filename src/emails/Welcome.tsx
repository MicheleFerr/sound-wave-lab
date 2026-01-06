// src/emails/Welcome.tsx
import {
  Button,
  Hr,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/Layout'

interface WelcomeProps {
  customerName: string
}

export function WelcomeEmail({ customerName }: WelcomeProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sound-wave-lab.vercel.app'

  return (
    <EmailLayout preview="Benvenuto in Sound Wave Lab!">
      {/* Heading */}
      <Text style={heading}>Benvenuto nella famiglia!</Text>
      <Text style={paragraph}>
        Ciao {customerName || 'Amico della musica'},
      </Text>
      <Text style={paragraph}>
        Grazie per esserti registrato su Sound Wave Lab! Siamo entusiasti di averti
        nella nostra community di appassionati di musica.
      </Text>

      <Hr style={hr} />

      {/* Benefits */}
      <Text style={sectionTitle}>COSA PUOI FARE ORA</Text>

      <Section style={benefitBox}>
        <Text style={benefitTitle}>Traccia i tuoi ordini</Text>
        <Text style={benefitText}>
          Visualizza lo stato dei tuoi ordini in tempo reale dalla tua area personale.
        </Text>
      </Section>

      <Section style={benefitBox}>
        <Text style={benefitTitle}>Checkout veloce</Text>
        <Text style={benefitText}>
          I tuoi dati salvati per acquisti più rapidi nelle prossime visite.
        </Text>
      </Section>

      <Section style={benefitBox}>
        <Text style={benefitTitle}>Offerte esclusive</Text>
        <Text style={benefitText}>
          Accesso anticipato a sconti e promozioni riservate ai membri.
        </Text>
      </Section>

      <Hr style={hr} />

      {/* CTA */}
      <Section style={ctaSection}>
        <Text style={ctaText}>Pronto a esplorare?</Text>
        <Button href={`${appUrl}/products`} style={ctaButton}>
          SCOPRI IL CATALOGO
        </Button>
      </Section>

      <Hr style={hr} />

      {/* Support */}
      <Text style={supportText}>
        Hai domande? Siamo qui per aiutarti!<br />
        Contattaci a support@soundwavelab.it
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail

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

const sectionTitle = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#666666',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const benefitBox = {
  backgroundColor: '#f6f6f6',
  padding: '16px',
  marginBottom: '12px',
}

const benefitTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 4px',
}

const benefitText = {
  fontSize: '13px',
  color: '#666666',
  margin: '0',
  lineHeight: '20px',
}

const ctaSection = {
  textAlign: 'center' as const,
}

const ctaText = {
  fontSize: '16px',
  color: '#333333',
  margin: '0 0 16px',
}

const ctaButton = {
  backgroundColor: '#000000',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  padding: '14px 32px',
  textDecoration: 'none',
  display: 'inline-block',
}

const supportText = {
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '20px',
}
