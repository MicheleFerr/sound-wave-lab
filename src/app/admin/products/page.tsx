// src/app/admin/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

async function getProducts() {
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
      category:categories(id, name),
      variants:product_variants(id, price, stock_quantity),
      images:product_images(url)
    `)
    .order('created_at', { ascending: false })

  return products || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('sort_order')

  return categories || []
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prodotti</h1>
          <p className="text-muted-foreground">
            Gestisci il catalogo prodotti
          </p>
        </div>
        <Button className="bg-brand-gradient bg-brand-gradient-hover" asChild>
          <Link href="/admin/products/nuovo">
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Prodotto
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Evidenza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-teal">
              {products.filter(p => p.is_featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tutti i Prodotti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Img</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const primaryImage = product.images[0]?.url
                const lowestPrice = product.variants.length > 0
                  ? Math.min(...product.variants.map(v => v.price))
                  : 0
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock_quantity, 0)

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      {primaryImage ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(Array.isArray(product.category)
                        ? product.category[0]?.name
                        : (product.category as any)?.name) || '-'}
                    </TableCell>
                    <TableCell>
                      €{lowestPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={totalStock < 10 ? 'text-orange-600 font-medium' : ''}>
                        {totalStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Attivo' : 'Inattivo'}
                        </Badge>
                        {product.is_featured && (
                          <Badge className="bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal-light">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizza
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nessun prodotto trovato
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
