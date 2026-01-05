// src/types/cart.ts
export interface CartItem {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  variantSku: string
  attributes: Record<string, string>
  price: number
  quantity: number
  imageUrl: string
}
