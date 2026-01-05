# Sound Wave Lab E-Commerce Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete e-commerce platform for Sound Wave Lab to sell t-shirts with custom designs, featuring a mobile-first responsive UI, Stripe payments, and an admin panel.

**Architecture:** Next.js 15 monolith with App Router, Server Components for data fetching, Server Actions for mutations, Zustand for client-side cart state, Supabase for database/auth/storage, and Stripe for payments.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Supabase, Stripe, Vitest, Playwright

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `~/Progetti/sound-wave-lab/` (entire project scaffold)

**Step 1: Create Next.js project with TypeScript**

```bash
cd ~/Progetti/sound-wave-lab
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project created with src/ directory, App Router, Tailwind configured

**Step 2: Verify project runs**

```bash
npm run dev
```

Expected: Server running on http://localhost:3000

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js 15 project with TypeScript and Tailwind"
```

---

### Task 1.2: Install Core Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand stripe @stripe/stripe-js lucide-react clsx tailwind-merge class-variance-authority
```

**Step 2: Install dev dependencies**

```bash
npm install -D @types/node vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add core dependencies (Supabase, Stripe, Zustand, testing)"
```

---

### Task 1.3: Setup shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `tailwind.config.ts`

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Select:
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 2: Add essential components**

```bash
npx shadcn@latest add button card input label select badge skeleton sheet dialog toast dropdown-menu table tabs separator
```

**Step 3: Commit**

```bash
git add .
git commit -m "chore: setup shadcn/ui with essential components"
```

---

### Task 1.4: Configure Environment Variables

**Files:**
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Create .env.example (committed)**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 2: Create .env.local (not committed) - Copy and fill with real values**

**Step 3: Verify .gitignore includes .env.local**

```bash
echo ".env.local" >> .gitignore
```

**Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: add environment variable template"
```

---

### Task 1.5: Setup Supabase Clients

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`

**Step 1: Create browser client**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Create server client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

**Step 3: Create middleware helper**

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**Step 4: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: setup Supabase client helpers (browser, server, middleware)"
```

---

### Task 1.6: Setup Middleware

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create middleware**

```typescript
// src/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add auth middleware for protected routes"
```

---

### Task 1.7: Setup Stripe

**Files:**
- Create: `src/lib/stripe/client.ts`
- Create: `src/lib/stripe/server.ts`

**Step 1: Create Stripe server instance**

```typescript
// src/lib/stripe/server.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})
```

**Step 2: Create Stripe client loader**

```typescript
// src/lib/stripe/client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}
```

**Step 3: Commit**

```bash
git add src/lib/stripe/
git commit -m "feat: setup Stripe client and server instances"
```

---

## Phase 2: Database Schema

### Task 2.1: Create Supabase Project

**Step 1: Create project at supabase.com**

Go to https://supabase.com/dashboard and create a new project named "sound-wave-lab"

**Step 2: Copy credentials to .env.local**

- Project URL -> NEXT_PUBLIC_SUPABASE_URL
- anon public key -> NEXT_PUBLIC_SUPABASE_ANON_KEY
- service_role key -> SUPABASE_SERVICE_ROLE_KEY

---

### Task 2.2: Create Database Schema

**Files:**
- Create: `supabase/schema.sql`

**Step 1: Create schema file**

```sql
-- supabase/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase Auth)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ADDRESSES
-- =============================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Casa',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'IT',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- =============================================
-- PRODUCT VARIANTS (SKU)
-- =============================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  attributes JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_attributes ON product_variants USING GIN (attributes);
CREATE INDEX idx_variants_price ON product_variants(price);

-- =============================================
-- PRODUCT IMAGES
-- =============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_product ON product_images(product_id);

-- =============================================
-- CARTS
-- =============================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(session_id)
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe ON orders(stripe_session_id);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  variant_sku TEXT NOT NULL,
  variant_attributes JSONB NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users see/update own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users manage own
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Categories: public read
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products: public read active, admin all
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Variants: same as products
CREATE POLICY "Anyone can view active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage variants" ON product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Images: public read
CREATE POLICY "Anyone can view images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage images" ON product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Carts: users manage own
CREATE POLICY "Users manage own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Cart items via cart" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

-- Orders: users see own, admin all
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items: via order
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins view all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

**Step 2: Run schema in Supabase SQL Editor**

Go to Supabase Dashboard -> SQL Editor -> Paste and run the schema

**Step 3: Commit**

```bash
mkdir -p supabase
git add supabase/schema.sql
git commit -m "feat: add complete database schema with RLS policies"
```

---

### Task 2.3: Create Storage Bucket

**Step 1: Create bucket in Supabase Dashboard**

Go to Storage -> New Bucket:
- Name: `products`
- Public: Yes

**Step 2: Set storage policies**

```sql
-- Allow public read
CREATE POLICY "Public read products" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Allow admin upload
CREATE POLICY "Admin upload products" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admin delete
CREATE POLICY "Admin delete products" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

### Task 2.4: Generate TypeScript Types

**Files:**
- Create: `src/types/database.types.ts`

**Step 1: Install Supabase CLI**

```bash
npm install -D supabase
```

**Step 2: Generate types**

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

**Step 3: Commit**

```bash
git add src/types/database.types.ts
git commit -m "feat: add auto-generated Supabase types"
```

---

### Task 2.5: Seed Sample Data

**Files:**
- Create: `supabase/seed.sql`

**Step 1: Create seed file**

```sql
-- supabase/seed.sql

-- Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Synth', 'synth', 'Magliette a tema sintetizzatori'),
  ('DJ', 'dj', 'Magliette per DJ e producer'),
  ('Vintage', 'vintage', 'Design retrò e vintage');

-- Products
INSERT INTO products (name, slug, description, category_id, is_active, is_featured)
SELECT
  'Moog Modular T-Shirt',
  'moog-modular-tshirt',
  'Design iconico del sintetizzatore Moog Modular. Stampa di alta qualità su cotone 100%.',
  id,
  true,
  true
FROM categories WHERE slug = 'synth';

INSERT INTO products (name, slug, description, category_id, is_active, is_featured)
SELECT
  'Roland TR-808 T-Shirt',
  'roland-tr808-tshirt',
  'Il leggendario drum machine che ha definito la musica elettronica.',
  id,
  true,
  true
FROM categories WHERE slug = 'synth';

INSERT INTO products (name, slug, description, category_id, is_active)
SELECT
  'Vinyl DJ T-Shirt',
  'vinyl-dj-tshirt',
  'Per i veri appassionati del vinile.',
  id,
  true
FROM categories WHERE slug = 'dj';

-- Variants for Moog Modular
INSERT INTO product_variants (product_id, sku, price, compare_at_price, stock_quantity, attributes)
SELECT id, 'MOOG-S-BLACK', 29.99, 39.99, 10, '{"size": "S", "color": "Nero"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt'
UNION ALL
SELECT id, 'MOOG-M-BLACK', 29.99, 39.99, 15, '{"size": "M", "color": "Nero"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt'
UNION ALL
SELECT id, 'MOOG-L-BLACK', 29.99, 39.99, 12, '{"size": "L", "color": "Nero"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt'
UNION ALL
SELECT id, 'MOOG-XL-BLACK', 29.99, 39.99, 8, '{"size": "XL", "color": "Nero"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt'
UNION ALL
SELECT id, 'MOOG-S-WHITE', 29.99, 39.99, 5, '{"size": "S", "color": "Bianco"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt'
UNION ALL
SELECT id, 'MOOG-M-WHITE', 29.99, 39.99, 8, '{"size": "M", "color": "Bianco"}'::jsonb FROM products WHERE slug = 'moog-modular-tshirt';

-- Variants for TR-808
INSERT INTO product_variants (product_id, sku, price, stock_quantity, attributes)
SELECT id, 'TR808-S-BLACK', 34.99, 10, '{"size": "S", "color": "Nero"}'::jsonb FROM products WHERE slug = 'roland-tr808-tshirt'
UNION ALL
SELECT id, 'TR808-M-BLACK', 34.99, 12, '{"size": "M", "color": "Nero"}'::jsonb FROM products WHERE slug = 'roland-tr808-tshirt'
UNION ALL
SELECT id, 'TR808-L-BLACK', 34.99, 8, '{"size": "L", "color": "Nero"}'::jsonb FROM products WHERE slug = 'roland-tr808-tshirt';

-- Variants for Vinyl DJ
INSERT INTO product_variants (product_id, sku, price, stock_quantity, attributes)
SELECT id, 'VINYL-M-GRAY', 24.99, 20, '{"size": "M", "color": "Grigio"}'::jsonb FROM products WHERE slug = 'vinyl-dj-tshirt'
UNION ALL
SELECT id, 'VINYL-L-GRAY', 24.99, 15, '{"size": "L", "color": "Grigio"}'::jsonb FROM products WHERE slug = 'vinyl-dj-tshirt';

-- Placeholder images (use real URLs in production)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT id, 'https://placehold.co/600x600/1a1a1a/white?text=Moog+Modular', 'Moog Modular T-Shirt', true, 0 FROM products WHERE slug = 'moog-modular-tshirt';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT id, 'https://placehold.co/600x600/1a1a1a/orange?text=TR-808', 'Roland TR-808 T-Shirt', true, 0 FROM products WHERE slug = 'roland-tr808-tshirt';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT id, 'https://placehold.co/600x600/333/white?text=Vinyl+DJ', 'Vinyl DJ T-Shirt', true, 0 FROM products WHERE slug = 'vinyl-dj-tshirt';
```

**Step 2: Run seed in Supabase SQL Editor**

**Step 3: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: add seed data for testing"
```

---

## Phase 3: Layout & Navigation

### Task 3.1: Create TypeScript Types

**Files:**
- Create: `src/types/product.ts`
- Create: `src/types/order.ts`
- Create: `src/types/cart.ts`

**Step 1: Create product types**

```typescript
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
```

**Step 2: Create order types**

```typescript
// src/types/order.ts
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  id: string
  product_name: string
  variant_sku: string
  variant_attributes: Record<string, string>
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  shipping_address: {
    name: string
    street: string
    city: string
    province: string
    postal_code: string
    country: string
  }
  subtotal: number
  shipping_cost: number
  total: number
  tracking_number: string | null
  carrier: string | null
  items: OrderItem[]
  created_at: string
}
```

**Step 3: Create cart types**

```typescript
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
```

**Step 4: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript types for products, orders, cart"
```

---

### Task 3.2: Create Cart Store

**Files:**
- Create: `src/stores/cart-store.ts`

**Step 1: Create Zustand store**

```typescript
// src/stores/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/cart'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.variantId === newItem.variantId)

        if (existing) {
          return {
            items: state.items.map(item =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true
          }
        }

        return {
          items: [...state.items, { ...newItem, quantity: 1 }],
          isOpen: true
        }
      }),

      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.variantId !== variantId)
      })),

      updateQuantity: (variantId, quantity) => set((state) => ({
        items: quantity > 0
          ? state.items.map(item =>
              item.variantId === variantId ? { ...item, quantity } : item
            )
          : state.items.filter(i => i.variantId !== variantId)
      })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'swl-cart',
    }
  )
)
```

**Step 2: Commit**

```bash
git add src/stores/cart-store.ts
git commit -m "feat: add Zustand cart store with persistence"
```

---

### Task 3.3: Create Header Component

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/CartIcon.tsx`
- Create: `src/components/layout/UserMenu.tsx`

**Step 1: Create CartIcon**

```typescript
// src/components/layout/CartIcon.tsx
'use client'

import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'

export function CartIcon() {
  const { toggleCart, totalItems } = useCartStore()
  const count = totalItems()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label={`Carrello (${count} articoli)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  )
}
```

**Step 2: Create UserMenu**

```typescript
// src/components/layout/UserMenu.tsx
'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  user: { email: string; isAdmin: boolean } | null
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/login" aria-label="Accedi">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu utente">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">Il mio account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">I miei ordini</Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Panel</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full text-left">
              Esci
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Step 3: Create Header**

```typescript
// src/components/layout/Header.tsx
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartIcon } from './CartIcon'
import { UserMenu } from './UserMenu'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg md:text-xl">Sound Wave Lab</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Catalogo
          </Link>
          <Link href="/products?category=synth" className="text-sm font-medium hover:text-primary transition-colors">
            Synth
          </Link>
          <Link href="/products?category=dj" className="text-sm font-medium hover:text-primary transition-colors">
            DJ
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
            <Link href="/search" aria-label="Cerca">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <CartIcon />
          <UserMenu
            user={user ? {
              email: user.email!,
              isAdmin: profile?.role === 'admin'
            } : null}
          />
        </div>
      </div>
    </header>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header with CartIcon and UserMenu"
```

---

### Task 3.4: Create Mobile Bottom Navigation

**Files:**
- Create: `src/components/layout/MobileNav.tsx`

**Step 1: Create component**

```typescript
// src/components/layout/MobileNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Cerca' },
  { href: '/cart', icon: ShoppingBag, label: 'Carrello', showBadge: true },
  { href: '/account', icon: User, label: 'Account' },
]

export function MobileNav() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.totalItems())

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label, showBadge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] min-h-[48px] text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {showBadge && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {totalItems > 99 ? '99' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/layout/MobileNav.tsx
git commit -m "feat: add mobile bottom navigation"
```

---

### Task 3.5: Create Cart Drawer

**Files:**
- Create: `src/components/cart/CartDrawer.tsx`
- Create: `src/components/cart/CartItem.tsx`

**Step 1: Create CartItem**

```typescript
// src/components/cart/CartItem.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const attributeString = Object.values(item.attributes).join(' / ')

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link href={`/products/${item.productSlug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium hover:underline line-clamp-1"
            >
              {item.productName}
            </Link>
            <p className="text-sm text-muted-foreground">{attributeString}</p>
          </div>
          <p className="font-medium">
            €{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              aria-label="Diminuisci quantità"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              aria-label="Aumenta quantità"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.variantId)}
            aria-label="Rimuovi"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Create CartDrawer**

```typescript
// src/components/cart/CartDrawer.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart-store'
import { CartItem } from './CartItem'

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, totalItems } = useCartStore()
  const sub = subtotal()
  const shippingCost = sub >= 50 ? 0 : 4.99
  const total = sub + shippingCost

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrello ({totalItems()} articoli)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Il tuo carrello è vuoto</p>
            <Button asChild onClick={closeCart}>
              <Link href="/products">Esplora il catalogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 space-y-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotale</span>
                  <span>€{sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spedizione</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `€${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                {sub < 50 && sub > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Aggiungi €{(50 - sub).toFixed(2)} per la spedizione gratuita
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Totale</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full h-12" onClick={closeCart}>
                <Link href="/checkout">Vai al checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/cart/
git commit -m "feat: add CartDrawer and CartItem components"
```

---

### Task 3.6: Create Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Step 1: Create component**

```typescript
// src/components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 hidden md:block">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Sound Wave Lab</h3>
            <p className="text-sm text-muted-foreground">
              Magliette uniche per amanti della musica elettronica e della tecnologia.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">Tutti i prodotti</Link></li>
              <li><Link href="/products?category=synth" className="hover:text-foreground">Synth</Link></li>
              <li><Link href="/products?category=dj" className="hover:text-foreground">DJ</Link></li>
              <li><Link href="/products?category=vintage" className="hover:text-foreground">Vintage</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">Accedi</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Registrati</Link></li>
              <li><Link href="/orders" className="hover:text-foreground">I miei ordini</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium mb-4">Informazioni</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-foreground">Spedizioni</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Resi</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contatti</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sound Wave Lab. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 3.7: Update Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sound Wave Lab - Magliette per amanti della musica',
  description: 'E-commerce di magliette uniche a tema musica elettronica, synth, DJ e tecnologia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </div>
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update root layout with Header, Footer, MobileNav, CartDrawer"
```

---

## Phase 4: Product Catalog (Continue in next implementation session)

The remaining phases include:
- **Phase 4:** Product Catalog (Grid, Filters, Detail Page)
- **Phase 5:** Checkout Flow (Shipping Form, Stripe Integration, Webhooks)
- **Phase 6:** Authentication (Login, Register, Protected Routes)
- **Phase 7:** Admin Panel (Dashboard, Product CRUD, Order Management)
- **Phase 8:** Testing & Polish (E2E tests, Performance optimization)

Each phase follows the same pattern:
1. Write failing test
2. Verify test fails
3. Write minimal implementation
4. Verify test passes
5. Commit

---

## Execution Checklist

- [ ] Phase 1: Project Setup (Tasks 1.1 - 1.7)
- [ ] Phase 2: Database Schema (Tasks 2.1 - 2.5)
- [ ] Phase 3: Layout & Navigation (Tasks 3.1 - 3.7)
- [ ] Phase 4: Product Catalog
- [ ] Phase 5: Checkout Flow
- [ ] Phase 6: Authentication
- [ ] Phase 7: Admin Panel
- [ ] Phase 8: Testing & Polish
