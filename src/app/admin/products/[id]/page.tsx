// src/app/admin/products/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

async function getCategories() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return categories || []
}

async function getProduct(id: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      category_id,
      is_active,
      is_featured,
      variants:product_variants(
        id,
        sku,
        price,
        compare_at_price,
        stock_quantity,
        attributes
      ),
      images:product_images(
        id,
        url,
        alt_text,
        is_primary
      )
    `)
    .eq('id', id)
    .single()

  return product
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [categories, product] = await Promise.all([
    getCategories(),
    getProduct(id)
  ])

  if (!product) {
    notFound()
  }

  // Transform the product data to match the form interface
  const formProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    category_id: product.category_id,
    is_active: product.is_active,
    is_featured: product.is_featured,
    variants: product.variants.map((v: {
      id: string
      sku: string
      price: number
      compare_at_price: number | null
      stock_quantity: number
      attributes: { size?: string; color?: string }
    }) => ({
      id: v.id,
      sku: v.sku,
      price: v.price,
      compare_at_price: v.compare_at_price,
      stock_quantity: v.stock_quantity,
      attributes: v.attributes || {}
    })),
    images: product.images.map((img: {
      id: string
      url: string
      alt_text: string | null
      is_primary: boolean
    }) => ({
      id: img.id,
      url: img.url,
      alt_text: img.alt_text || '',
      is_primary: img.is_primary
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modifica Prodotto</h1>
        <p className="text-muted-foreground">
          Modifica le informazioni del prodotto
        </p>
      </div>

      <ProductForm product={formProduct} categories={categories} isEdit />
    </div>
  )
}
