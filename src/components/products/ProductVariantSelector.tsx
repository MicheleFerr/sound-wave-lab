// src/components/products/ProductVariantSelector.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/stores/cart-store'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Variant {
  id: string
  price: number
  compare_at_price?: number | null
  stock_quantity: number
  sku: string
  attributes: {
    size?: string
    color?: string
    [key: string]: string | undefined
  }
}

interface ProductImage {
  id: string
  url: string
  alt_text?: string | null
}

interface ProductVariantSelectorProps {
  productId: string
  productName: string
  variants: Variant[]
  images: ProductImage[]
}

export function ProductVariantSelector({
  productId,
  productName,
  variants,
  images,
}: ProductVariantSelectorProps) {
  const { addItem } = useCartStore()

  // Get unique sizes and colors
  const sizes = useMemo(() => {
    const uniqueSizes = [...new Set(variants.map((v) => v.attributes.size).filter(Boolean))] as string[]
    return uniqueSizes.sort((a, b) => {
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
    })
  }, [variants])

  const colors = useMemo(() => {
    return [...new Set(variants.map((v) => v.attributes.color).filter(Boolean))] as string[]
  }, [variants])

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) return variants[0] || null
    return variants.find((v) => {
      const sizeMatch = !selectedSize || v.attributes.size === selectedSize
      const colorMatch = !selectedColor || v.attributes.color === selectedColor
      return sizeMatch && colorMatch
    }) || null
  }, [variants, selectedSize, selectedColor])

  // Check if a size is available for selected color
  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return variants.some((v) => v.attributes.size === size && v.stock_quantity > 0)
    const variant = variants.find((v) => v.attributes.size === size && v.attributes.color === selectedColor)
    return variant && variant.stock_quantity > 0
  }

  // Check if a color is available for selected size
  const isColorAvailable = (color: string) => {
    if (!selectedSize) return variants.some((v) => v.attributes.color === color && v.stock_quantity > 0)
    const variant = variants.find((v) => v.attributes.color === color && v.attributes.size === selectedSize)
    return variant && variant.stock_quantity > 0
  }

  const isInStock = selectedVariant && selectedVariant.stock_quantity > 0
  const maxQuantity = selectedVariant?.stock_quantity || 0

  const handleAddToCart = () => {
    if (!selectedVariant || !isInStock) return

    setIsAdding(true)

    const productSlug = window.location.pathname.split('/').pop() || ''
    const imageUrl = images[0]?.url || ''

    for (let i = 0; i < quantity; i++) {
      addItem({
        variantId: selectedVariant.id,
        productId,
        productName,
        productSlug,
        variantSku: selectedVariant.sku,
        attributes: {
          size: selectedVariant.attributes.size || '',
          color: selectedVariant.attributes.color || '',
        },
        price: selectedVariant.price,
        imageUrl,
      })
    }

    // Reset quantity
    setQuantity(1)

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <Label className="offwhite-label text-[10px]">
            SIZE: <span className="font-normal">{selectedSize}</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = isSizeAvailable(size)
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!available}
                  className={cn(
                    'h-10 min-w-[48px] px-3 border font-bold transition-all text-xs tracking-wider',
                    'rounded-sm',
                    selectedSize === size
                      ? 'border-offwhite-black bg-offwhite-black text-white'
                      : available
                      ? 'border-offwhite-black bg-white hover:bg-offwhite-black hover:text-white'
                      : 'border-offwhite-black/30 bg-white/50 text-offwhite-black/30 line-through cursor-not-allowed'
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 1 && (
        <div className="space-y-3">
          <Label className="offwhite-label text-[10px]">
            COLOR: <span className="font-normal">{selectedColor}</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = isColorAvailable(color)
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!available}
                  className={cn(
                    'h-10 px-4 border font-bold transition-all text-xs tracking-wider uppercase',
                    'rounded-sm',
                    selectedColor === color
                      ? 'border-offwhite-black bg-offwhite-black text-white'
                      : available
                      ? 'border-offwhite-black bg-white hover:bg-offwhite-black hover:text-white'
                      : 'border-offwhite-black/30 bg-white/50 text-offwhite-black/30 line-through cursor-not-allowed'
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="flex items-center gap-2 pt-2">
          <div
            className={cn(
              'w-2 h-2 border',
              isInStock ? 'bg-offwhite-black border-offwhite-black' : 'bg-offwhite-red border-offwhite-red'
            )}
          />
          <span className="offwhite-label text-[9px]">
            {isInStock
              ? selectedVariant.stock_quantity <= 5
                ? `ONLY ${selectedVariant.stock_quantity} LEFT`
                : 'IN STOCK'
              : 'SOLD OUT'}
          </span>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex gap-4 pt-2">
        {/* Quantity Selector */}
        <div className="flex items-center border border-offwhite-black rounded-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-none hover:bg-offwhite-black hover:text-white"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-mono font-bold text-sm">{String(quantity).padStart(2, '0')}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-none hover:bg-offwhite-black hover:text-white"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Button - Off-White Style */}
        <Button
          size="lg"
          className={cn(
            'flex-1 h-12 text-xs font-bold transition-all duration-200 rounded-sm tracking-wider',
            isAdding
              ? 'bg-offwhite-black text-white border-offwhite-black'
              : 'offwhite-button-filled'
          )}
          onClick={handleAddToCart}
          disabled={!isInStock || isAdding}
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ADDED TO CART
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              ADD TO CART
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
