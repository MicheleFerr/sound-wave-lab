// src/app/admin/categorie/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryList } from '@/components/admin/CategoryList'

async function getCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url, sort_order')
    .order('sort_order')

  return categories || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categorie</h1>
        <p className="text-muted-foreground">
          Gestisci le categorie dei prodotti
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutte le Categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryList categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
