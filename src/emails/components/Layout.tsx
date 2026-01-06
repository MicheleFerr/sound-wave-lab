// src/emails/components/Layout.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface LayoutProps {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>SOUND WAVE LAB</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sound Wave Lab - Vinili, CD e Merchandising Musicale
            </Text>
            <Text style={footerLinks}>
              Hai domande? Contattaci a support@soundwavelab.it
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} Sound Wave Lab. Tutti i diritti riservati.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#000000',
  padding: '24px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
}

const content = {
  padding: '32px 24px',
}

const footer = {
  backgroundColor: '#f6f6f6',
  padding: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 8px',
}

const footerLinks = {
  color: '#666666',
  fontSize: '12px',
  margin: '0 0 8px',
}

const copyright = {
  color: '#999999',
  fontSize: '11px',
  margin: '0',
}
