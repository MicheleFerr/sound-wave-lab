// src/emails/OrderConfirmation.tsx
import {
  Column,
  Hr,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/Layout'

interface OrderItem {
  name: string
  quantity: number
  price: number
  attributes?: Record<string, string>
}

interface OrderConfirmationProps {
  orderNumber: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  total: number
  shippingAddress: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  discountAmount,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  const formatPrice = (price: number) => `€${price.toFixed(2)}`

  return (
    <EmailLayout preview={`Conferma ordine #${orderNumber}`}>
      {/* Greeting */}
      <Text style={heading}>Grazie per il tuo ordine!</Text>
      <Text style={paragraph}>
        Ciao {customerName || 'Cliente'},
      </Text>
      <Text style={paragraph}>
        Abbiamo ricevuto il tuo ordine e lo stiamo preparando con cura.
        Di seguito trovi il riepilogo del tuo acquisto.
      </Text>

      {/* Order Number */}
      <Section style={orderBox}>
        <Text style={orderLabel}>NUMERO ORDINE</Text>
        <Text style={orderNumberStyle}>{orderNumber}</Text>
      </Section>

      <Hr style={hr} />

      {/* Items */}
      <Text style={sectionTitle}>PRODOTTI ORDINATI</Text>
      {items.map((item, index) => (
        <Section key={index} style={itemRow}>
          <Row>
            <Column style={itemName}>
              <Text style={itemNameText}>{item.name}</Text>
              {item.attributes && Object.keys(item.attributes).length > 0 && (
                <Text style={itemAttributes}>
                  {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' - ')}
                </Text>
              )}
              <Text style={itemQty}>Quantità: {item.quantity}</Text>
            </Column>
            <Column style={itemPrice}>
              <Text style={itemPriceText}>{formatPrice(item.price * item.quantity)}</Text>
            </Column>
          </Row>
        </Section>
      ))}

      <Hr style={hr} />

      {/* Totals */}
      <Section style={totalsSection}>
        <Row>
          <Column style={totalLabel}><Text style={totalText}>Subtotale</Text></Column>
          <Column style={totalValue}><Text style={totalText}>{formatPrice(subtotal)}</Text></Column>
        </Row>
        <Row>
          <Column style={totalLabel}><Text style={totalText}>Spedizione</Text></Column>
          <Column style={totalValue}>
            <Text style={totalText}>{shippingCost === 0 ? 'Gratuita' : formatPrice(shippingCost)}</Text>
          </Column>
        </Row>
        {discountAmount > 0 && (
          <Row>
            <Column style={totalLabel}><Text style={discountText}>Sconto</Text></Column>
            <Column style={totalValue}><Text style={discountText}>-{formatPrice(discountAmount)}</Text></Column>
          </Row>
        )}
        <Hr style={hrThin} />
        <Row>
          <Column style={totalLabel}><Text style={grandTotalText}>Totale</Text></Column>
          <Column style={totalValue}>
            <Text style={grandTotalText}>{total === 0 ? 'Gratuito' : formatPrice(total)}</Text>
          </Column>
        </Row>
      </Section>

      <Hr style={hr} />

      {/* Shipping Address */}
      <Text style={sectionTitle}>INDIRIZZO DI SPEDIZIONE</Text>
      <Text style={addressText}>
        {shippingAddress.street}<br />
        {shippingAddress.postalCode} {shippingAddress.city} ({shippingAddress.province})<br />
        {shippingAddress.country}
      </Text>

      <Hr style={hr} />

      {/* Next Steps */}
      <Text style={sectionTitle}>PROSSIMI PASSI</Text>
      <Text style={paragraph}>
        1. Prepareremo il tuo pacco con cura<br />
        2. Ti invieremo un'email con il tracking quando spediremo<br />
        3. Consegna stimata: 3-5 giorni lavorativi
      </Text>
    </EmailLayout>
  )
}

export default OrderConfirmationEmail

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

const orderBox = {
  backgroundColor: '#f6f6f6',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const orderLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#666666',
  margin: '0 0 4px',
}

const orderNumberStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  color: '#000000',
  margin: '0',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '24px 0',
}

const hrThin = {
  borderColor: '#e6e6e6',
  margin: '8px 0',
}

const sectionTitle = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#666666',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const itemRow = {
  margin: '0 0 12px',
}

const itemName = {
  width: '70%',
}

const itemNameText = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
  margin: '0',
}

const itemAttributes = {
  fontSize: '12px',
  color: '#666666',
  margin: '2px 0 0',
}

const itemQty = {
  fontSize: '12px',
  color: '#666666',
  margin: '2px 0 0',
}

const itemPrice = {
  width: '30%',
  textAlign: 'right' as const,
}

const itemPriceText = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
  margin: '0',
}

const totalsSection = {
  margin: '0',
}

const totalLabel = {
  width: '70%',
}

const totalValue = {
  width: '30%',
  textAlign: 'right' as const,
}

const totalText = {
  fontSize: '14px',
  color: '#333333',
  margin: '4px 0',
}

const discountText = {
  fontSize: '14px',
  color: '#16a34a',
  margin: '4px 0',
}

const grandTotalText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '8px 0',
}

const addressText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#333333',
  margin: '0',
}
