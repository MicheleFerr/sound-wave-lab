// src/types/order.ts
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  id: string
  product_name: string
  variant_sku: string
  variant_attributes: Record<string, string>
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  shipping_address: {
    name: string
    street: string
    city: string
    province: string
    postal_code: string
    country: string
  }
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total: number
  tracking_number: string | null
  carrier: string | null
  tracking_url: string | null
  items: OrderItem[]
  created_at: string
  updated_at: string
  notes: string | null
  user_id: string
}

export type OrderNoteType = 'internal' | 'customer'

export interface OrderNote {
  id: string
  order_id: string
  created_by: string | null
  note_type: OrderNoteType
  content: string
  created_at: string
  updated_at: string
}

export type OrderActivityType =
  | 'status_change'
  | 'refund'
  | 'cancellation'
  | 'shipment'
  | 'email_sent'
  | 'note_added'
  | 'order_edited'
  | 'payment_captured'

export interface OrderActivity {
  id: string
  order_id: string
  performed_by: string | null
  action_type: OrderActivityType
  previous_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: string
}
