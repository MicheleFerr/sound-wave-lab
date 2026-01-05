// src/app/admin/products/nuovo/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

async function getCategories() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return categories || []
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nuovo Prodotto</h1>
        <p className="text-muted-foreground">
          Crea un nuovo prodotto nel catalogo
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
