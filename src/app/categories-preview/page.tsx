// src/app/categories-preview/page.tsx
// Demo page to preview category placeholders

import { CategoryPlaceholder, COMMON_CATEGORIES } from '@/components/ui/category-placeholder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CategoriesPreviewPage() {
  const variants = ['teal', 'orange', 'gradient'] as const
  const sizes = ['sm', 'md', 'lg'] as const

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Category Placeholder System</h1>
        <p className="text-muted-foreground text-lg">
          Dynamic SVG placeholders for product categories - Zero external dependencies
        </p>
      </div>

      {/* Common Categories Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Common Categories (Gradient)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMON_CATEGORIES.map((category) => (
            <Card key={category} className="overflow-hidden">
              <CardContent className="p-0">
                <CategoryPlaceholder
                  category={category}
                  variant="gradient"
                  size="md"
                  className="w-full h-auto"
                />
              </CardContent>
              <CardHeader>
                <CardTitle className="text-center text-sm">{category}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Size Variations */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Size Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sizes.map((size) => (
            <Card key={size}>
              <CardHeader>
                <CardTitle className="capitalize">{size} Size</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CategoryPlaceholder
                  category="Plugins"
                  variant="gradient"
                  size={size}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Color Variations */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Color Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map((variant) => (
            <Card key={variant}>
              <CardHeader>
                <CardTitle className="capitalize">{variant} Variant</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CategoryPlaceholder
                  category="Sound Libraries"
                  variant={variant}
                  size="md"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Usage Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>Product Category Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg mb-2 transition-transform group-hover:scale-105">
                  <CategoryPlaceholder
                    category="Synths"
                    variant="gradient"
                    size="sm"
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="font-semibold text-center">Synths</h3>
                <p className="text-sm text-muted-foreground text-center">42 products</p>
              </div>

              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg mb-2 transition-transform group-hover:scale-105">
                  <CategoryPlaceholder
                    category="Drums"
                    variant="teal"
                    size="sm"
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="font-semibold text-center">Drums</h3>
                <p className="text-sm text-muted-foreground text-center">38 products</p>
              </div>

              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg mb-2 transition-transform group-hover:scale-105">
                  <CategoryPlaceholder
                    category="Effects"
                    variant="orange"
                    size="sm"
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="font-semibold text-center">Effects</h3>
                <p className="text-sm text-muted-foreground text-center">56 products</p>
              </div>

              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg mb-2 transition-transform group-hover:scale-105">
                  <CategoryPlaceholder
                    category="Bundles"
                    variant="gradient"
                    size="sm"
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="font-semibold text-center">Bundles</h3>
                <p className="text-sm text-muted-foreground text-center">15 products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Code Example */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Code Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { CategoryPlaceholder } from '@/components/ui/category-placeholder'

// Basic usage
<CategoryPlaceholder
  category="Plugins"
  variant="gradient"
  size="md"
/>

// With Tailwind classes
<CategoryPlaceholder
  category="Sound Libraries"
  variant="teal"
  size="lg"
  className="rounded-xl shadow-lg"
/>

// Available variants: 'teal' | 'orange' | 'gradient'
// Available sizes: 'sm' | 'md' | 'lg'
// Pre-configured categories: Plugins, Sound Libraries, Virtual Instruments,
//   Effects, Mixing, Synths, Drums, Vocals, Bundles`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
