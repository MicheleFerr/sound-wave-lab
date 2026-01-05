// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getStats() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: activeProductsCount },
    { count: categoriesCount },
    { count: variantsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('product_variants').select('*', { count: 'exact', head: true }),
  ])

  return {
    products: productsCount || 0,
    activeProducts: activeProductsCount || 0,
    categories: categoriesCount || 0,
    variants: variantsCount || 0,
  }
}

interface RecentProduct {
  id: string
  name: string
  slug: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  category: { name: string } | null
}

async function getRecentProducts(): Promise<RecentProduct[]> {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      is_active,
      is_featured,
      created_at,
      category:categories(name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Transform array relations to single objects
  return (products || []).map((p) => ({
    ...p,
    category: Array.isArray(p.category) ? p.category[0] || null : p.category,
  })) as RecentProduct[]
}

export default async function AdminDashboard() {
  const [stats, recentProducts] = await Promise.all([
    getStats(),
    getRecentProducts(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Panoramica del tuo negozio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prodotti Totali</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts} attivi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Varianti</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.variants}</div>
            <p className="text-xs text-muted-foreground">
              Taglie e colori
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categorie</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Collezioni attive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Azioni Rapide</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/products">Prodotti</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/settings">Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prodotti Recenti</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">Vedi tutti</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category?.name || 'Nessuna categoria'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {product.is_active ? 'Attivo' : 'Inattivo'}
                  </span>
                  {product.is_featured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal-light">
                      In evidenza
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nessun prodotto trovato
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
