// src/components/admin/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Variant {
  id?: string
  sku: string
  price: number
  compare_at_price: number | null
  stock_quantity: number
  attributes: {
    size?: string
    color?: string
  }
}

interface ProductImage {
  id?: string
  url: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id?: string
  name: string
  slug: string
  description: string
  category_id: string | null
  is_active: boolean
  is_featured: boolean
  variants: Variant[]
  images: ProductImage[]
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  isEdit?: boolean
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Nero', 'Bianco', 'Grigio', 'Blu', 'Rosso', 'Verde', 'Giallo', 'Rosa', 'Arancione', 'Viola']

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateSKU(name: string, size?: string, color?: string): string {
  const prefix = name.substring(0, 3).toUpperCase()
  const sizeCode = size ? size.substring(0, 2).toUpperCase() : 'XX'
  const colorCode = color ? color.substring(0, 2).toUpperCase() : 'XX'
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${sizeCode}-${colorCode}-${random}`
}

export function ProductForm({ product, categories, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState<Product>({
    id: product?.id,
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category_id: product?.category_id || null,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    variants: product?.variants || [{
      sku: '',
      price: 0,
      compare_at_price: null,
      stock_quantity: 0,
      attributes: { size: 'M', color: 'Nero' }
    }],
    images: product?.images || []
  })

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : generateSlug(name)
    }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        sku: generateSKU(prev.name, 'M', 'Nero'),
        price: prev.variants[0]?.price || 0,
        compare_at_price: null,
        stock_quantity: 0,
        attributes: { size: 'M', color: 'Nero' }
      }]
    }))
  }

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const updateVariant = (index: number, updates: Partial<Variant>) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, ...updates } : v)
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt_text: '', is_primary: prev.images.length === 0 }]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImage = (index: number, updates: Partial<ProductImage>) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? { ...img, ...updates } : img)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      if (isEdit && formData.id) {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id,
            is_active: formData.is_active,
            is_featured: formData.is_featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id)

        if (productError) throw productError

        // Delete existing variants and images, then re-insert
        await supabase.from('product_variants').delete().eq('product_id', formData.id)
        await supabase.from('product_images').delete().eq('product_id', formData.id)

        // Insert variants
        if (formData.variants.length > 0) {
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(formData.variants.map(v => ({
              product_id: formData.id,
              sku: v.sku || generateSKU(formData.name, v.attributes.size, v.attributes.color),
              price: v.price,
              compare_at_price: v.compare_at_price,
              stock_quantity: v.stock_quantity,
              attributes: v.attributes
            })))
          if (variantError) throw variantError
        }

        // Insert images
        if (formData.images.length > 0) {
          const { error: imageError } = await supabase
            .from('product_images')
            .insert(formData.images.filter(img => img.url).map((img, idx) => ({
              product_id: formData.id,
              url: img.url,
              alt_text: img.alt_text || formData.name,
              is_primary: idx === 0,
              sort_order: idx
            })))
          if (imageError) throw imageError
        }

        setMessage({ type: 'success', text: 'Prodotto aggiornato con successo!' })
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id,
            is_active: formData.is_active,
            is_featured: formData.is_featured
          })
          .select('id')
          .single()

        if (productError) throw productError

        // Insert variants
        if (formData.variants.length > 0) {
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(formData.variants.map(v => ({
              product_id: newProduct.id,
              sku: v.sku || generateSKU(formData.name, v.attributes.size, v.attributes.color),
              price: v.price,
              compare_at_price: v.compare_at_price,
              stock_quantity: v.stock_quantity,
              attributes: v.attributes
            })))
          if (variantError) throw variantError
        }

        // Insert images
        if (formData.images.length > 0) {
          const { error: imageError } = await supabase
            .from('product_images')
            .insert(formData.images.filter(img => img.url).map((img, idx) => ({
              product_id: newProduct.id,
              url: img.url,
              alt_text: img.alt_text || formData.name,
              is_primary: idx === 0,
              sort_order: idx
            })))
          if (imageError) throw imageError
        }

        setMessage({ type: 'success', text: 'Prodotto creato con successo!' })
        router.push('/admin/products')
      }

      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Errore durante il salvataggio' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" type="button" asChild>
        <Link href="/admin/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai prodotti
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Prodotto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Es: T-Shirt Wave Classic"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="t-shirt-wave-classic"
                />
                <p className="text-xs text-muted-foreground">
                  Generato automaticamente dal nome
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrivi il prodotto..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Varianti (Taglie e Colori)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Variante
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variante {index + 1}</span>
                    {formData.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Taglia</Label>
                      <Select
                        value={variant.attributes.size || 'M'}
                        onValueChange={(value) => updateVariant(index, {
                          attributes: { ...variant.attributes, size: value },
                          sku: generateSKU(formData.name, value, variant.attributes.color)
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Colore</Label>
                      <Select
                        value={variant.attributes.color || 'Nero'}
                        onValueChange={(value) => updateVariant(index, {
                          attributes: { ...variant.attributes, color: value },
                          sku: generateSKU(formData.name, variant.attributes.size, value)
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Prezzo (€) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, { price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Prezzo Barrato (€)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.compare_at_price || ''}
                        onChange={(e) => updateVariant(index, {
                          compare_at_price: e.target.value ? parseFloat(e.target.value) : null
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quantità *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock_quantity}
                        onChange={(e) => updateVariant(index, { stock_quantity: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, { sku: e.target.value })}
                      placeholder="Codice SKU"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Immagini</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Immagine
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.images.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nessuna immagine aggiunta
                </p>
              ) : (
                formData.images.map((image, index) => (
                  <div key={index} className="flex items-start gap-4 border rounded-lg p-4">
                    <div className="flex-1 space-y-2">
                      <Label>URL Immagine</Label>
                      <Input
                        value={image.url}
                        onChange={(e) => updateImage(index, { url: e.target.value })}
                        placeholder="https://..."
                      />
                      <Label>Testo Alternativo</Label>
                      <Input
                        value={image.alt_text}
                        onChange={(e) => updateImage(index, { alt_text: e.target.value })}
                        placeholder="Descrizione immagine"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
              <p className="text-xs text-muted-foreground">
                Inserisci URL di immagini esistenti (es: da Unsplash, Cloudinary, etc.)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Stato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Prodotto Attivo</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                I prodotti inattivi non saranno visibili nel negozio
              </p>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">In Evidenza</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Appare nella homepage
              </p>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.category_id || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm mb-4 ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gradient bg-brand-gradient-hover text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? 'Aggiorna Prodotto' : 'Crea Prodotto'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
