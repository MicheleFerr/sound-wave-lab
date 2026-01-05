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
  total: number
  tracking_number: string | null
  carrier: string | null
  items: OrderItem[]
  created_at: string
}
