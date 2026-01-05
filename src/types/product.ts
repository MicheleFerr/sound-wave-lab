// src/types/product.ts
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

export interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

export interface ProductVariant {
  id: string
  sku: string
  price: number
  compare_at_price: number | null
  stock_quantity: number
  attributes: {
    size?: string
    color?: string
  }
  is_active: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category: Category | null
  variants: ProductVariant[]
  images: ProductImage[]
  is_active: boolean
  is_featured: boolean
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  color?: string
  sort?: 'price_asc' | 'price_desc' | 'newest'
}
