# Sound Wave Lab E-Commerce - Design Document

**Data:** 2026-01-05
**Stato:** Approvato
**Autore:** Claude + Michele

---

## Executive Summary

Piattaforma e-commerce custom per Sound Wave Lab, negozio di tecnologia/musica, per vendere magliette con design unici. Soluzione chiavi in mano, scalabile, con costi operativi contenuti.

| Aspetto | Decisione |
|---------|-----------|
| **Nome Progetto** | Sound Wave Lab E-Commerce |
| **Tipo** | E-commerce Custom per vendita magliette |
| **Stack** | Next.js 15 + React + TypeScript |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Hosting** | Vercel |
| **Pagamenti** | Stripe |
| **UI** | Tailwind CSS + shadcn/ui |
| **State** | Zustand (carrello) + Server Components |
| **Testing** | Vitest + Playwright |

---

## 1. Stack Tecnologico

### Frontend
- **Next.js 15** - App Router, Server Components, Server Actions
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible components
- **Zustand** - Client state (carrello)

### Backend
- **Supabase** - PostgreSQL + Row Level Security
- **Supabase Auth** - Autenticazione utenti
- **Supabase Storage** - Upload immagini prodotti
- **Stripe** - Pagamenti (Checkout, Webhooks)

### Infrastructure
- **Vercel** - Hosting + Edge Functions
- **Vercel Analytics** - Performance monitoring

### Testing
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **Testing Library** - Integration tests

---

## 2. Architettura Progetto

```
sound-wave-lab/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Routes pubbliche
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # Catalogo con filtri
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   └── checkout/
│   │   │       ├── page.tsx
│   │   │       └── success/page.tsx
│   │   │
│   │   ├── (auth)/               # Autenticazione
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (protected)/          # Routes utenti loggati
│   │   │   ├── account/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── admin/                # Pannello Admin
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts
│   │   │   │   └── webhook/route.ts
│   │   │   └── admin/
│   │   │
│   │   ├── layout.tsx
│   │   └── middleware.ts
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui
│   │   ├── layout/               # Header, Footer, Nav
│   │   ├── products/             # ProductCard, Grid, Filters
│   │   ├── cart/                 # CartDrawer, CartItem
│   │   ├── checkout/             # Forms, Summary
│   │   └── admin/                # Dashboard, Tables
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── admin.ts
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── utils/
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useProducts.ts
│   │
│   ├── stores/
│   │   └── cart-store.ts
│   │
│   ├── services/
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   └── cart.service.ts
│   │
│   └── types/
│       ├── database.types.ts
│       ├── product.ts
│       └── order.ts
│
├── public/
├── e2e/                          # Playwright tests
├── __tests__/                    # Unit tests
├── .env.local
├── .env.example
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 3. Schema Database

### Tabelle Principali

```sql
-- PROFILI UTENTI
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDIRIZZI
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- CATEGORIE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODOTTI
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- VARIANTI PRODOTTO (SKU)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- IMMAGINI PRODOTTO
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARRELLO
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(session_id)
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

-- ORDINI
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

### Indici Performance

```sql
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_attributes ON product_variants USING GIN (attributes);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Prodotti: tutti leggono, solo admin scrive
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Ordini: utenti vedono propri, admin vede tutti
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 4. User Personas

### Persona 1: Marco - Il Cliente Tipo (Mobile)

| Attributo | Valore |
|-----------|--------|
| **Età** | 28 anni |
| **Occupazione** | Graphic Designer |
| **Device** | iPhone 14 Pro (85% mobile) |
| **Obiettivo** | Acquistare velocemente senza perdere tempo |
| **Frustrazione** | Form lunghi, costi nascosti, account obbligatorio |
| **Scenario** | "Vedo un ad su Instagram, voglio comprare subito con Apple Pay" |

### Persona 2: Giulia - La Cliente Esigente (Desktop)

| Attributo | Valore |
|-----------|--------|
| **Età** | 35 anni |
| **Occupazione** | Marketing Manager |
| **Device** | MacBook (60% desktop) |
| **Obiettivo** | Acquistare regali originali, vedere dettagli |
| **Frustrazione** | Foto bassa qualità, guida taglie assente |
| **Scenario** | "Devo fare un regalo, voglio vedere bene il prodotto" |

### Persona 3: Alessandro - L'Admin

| Attributo | Valore |
|-----------|--------|
| **Età** | 42 anni |
| **Occupazione** | Proprietario negozio |
| **Competenze Tech** | Medio-basse |
| **Obiettivo** | Gestire ordini e inventario senza errori |
| **Frustrazione** | Dashboard complicate, overselling |
| **Scenario** | "È venerdì sera, voglio controllare un ordine dal telefono" |

---

## 5. User Flows

### Flow Cliente: Acquisto Mobile

```
Instagram Ad → Product Page → Select Variant → Add to Cart
→ Cart Drawer → Checkout (Guest) → Shipping Form
→ Apple Pay → Confirmation → Email
```

**Tempo target:** < 3 minuti

### Flow Cliente: Acquisto Desktop

```
Google Search → Homepage → Browse Categories → Filter Products
→ Product Detail → Check Size Guide → Add to Wishlist
→ Return Later → Checkout (Account) → Apply Coupon
→ Payment → Track Order
```

### Flow Admin: Gestione Ordini

```
Login → Dashboard → View New Orders → Click Order
→ Verify Payment → Mark as Shipped → Enter Tracking
→ Auto Email to Customer
```

### Flow Admin: Nuovo Prodotto

```
Login → Products → New Product → Fill Form
→ Upload Images (Drag & Drop) → Add Variants
→ Set Stock per Variant → Preview → Publish
```

---

## 6. Edge Cases & Soluzioni

### Lato Cliente

| ID | Problema | Soluzione |
|----|----------|-----------|
| C01 | Prodotto esaurito durante checkout | Lock inventario temporaneo (5 min) |
| C02 | Pagamento fallito | Retry automatico, messaggio specifico |
| C03 | Codice sconto non funziona | Validazione real-time, auto-uppercase |
| C04 | Spedizione nascosta | Mostrare costi già in ProductCard |
| C05 | Form mobile lungo | Autofill aggressivo, campi minimi |
| C06 | Taglia sbagliata | Guida taglie chiara con misure cm |
| C07 | Immagini lente | Lazy loading, WebP, CDN |
| C08 | Doppio click = doppio ordine | Disable button, idempotency key |
| C09 | Session timeout | Persistenza carrello localStorage |
| C10 | Email in spam | SPF/DKIM configurati |
| C11 | Filtri senza risultati | Suggerimenti, "rimuovi filtri" |
| C12 | Prezzo cambia | Lock prezzo al add to cart |

### Lato Admin

| ID | Problema | Soluzione |
|----|----------|-----------|
| A01 | Overselling | Lock ottimistico DB, verifica al pagamento |
| A02 | Stock non sincronizzato | Source of truth unico (Supabase) |
| A03 | Upload foto fallito | Resize client-side, retry, progress bar |
| A04 | Perdita dati form | Auto-save draft ogni 30s |
| A05 | Ordine non trovato | Ricerca full-text multi-campo |
| A06 | Stato pagamento ambiguo | Stato chiaro con timestamp |
| A07 | Errore varianti | Preview prima di salvare |
| A08 | Email non valida | Validazione real-time |
| A09 | Accesso non autorizzato | 2FA obbligatorio |
| A10 | Report sbagliato | Calcoli server-side |
| A11 | Prodotto incompleto | Checklist obbligatoria |
| A12 | Notifica mancata | Multi-canale (push + email) |

---

## 7. Mobile-First Design

### Breakpoints Tailwind

```typescript
screens: {
  'sm': '640px',   // Tablet small
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Desktop large
  '2xl': '1536px', // Ultra-wide
}
```

### Product Grid Responsive

```html
<div class="grid gap-4 p-4
  grid-cols-2        /* Mobile: 2 col */
  md:grid-cols-3     /* Tablet: 3 col */
  lg:grid-cols-4     /* Desktop: 4 col */
">
```

### Touch Targets

- Bottoni: minimo 48x48px
- Spacing tra elementi: minimo 8px
- Bottom navigation: 64px height
- Form inputs: 48px height

### Bottom Navigation (Mobile)

```
[Home] [Cerca] [Carrello] [Account]
```

---

## 8. State Management

### Cart Store (Zustand)

```typescript
interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item) => void
  removeItem: (variantId) => void
  updateQuantity: (variantId, quantity) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}
```

**Persistenza:** localStorage con Zustand persist middleware

### Server State

- **Products:** Server Components + Supabase queries
- **Orders:** Server Actions + RLS
- **Real-time:** Supabase subscriptions (admin)

---

## 9. Testing Strategy

### Test Pyramid

```
        E2E (Playwright)
       /               \
    Integration (Vitest)
   /                     \
  Unit Tests (Vitest)
```

### Critical Paths E2E

1. **Happy path checkout mobile** (Marco)
2. **Prodotto esaurito** - messaggio corretto
3. **Pagamento fallito** - retry funziona
4. **Admin crea prodotto** - visibile su frontend
5. **Admin gestisce ordine** - email inviata

---

## 10. Metriche Target

| Metrica | Target |
|---------|--------|
| Time to checkout (mobile) | < 3 min |
| Page load (LCP) | < 2.5s |
| Cart abandonment | < 70% |
| Mobile conversion | > 2% |
| Order processing | < 5 min |

---

## 11. Costi Stimati

### Mensili (Piano Free/Starter)

| Servizio | Costo |
|----------|-------|
| Vercel | €0 (Hobby) / €20 (Pro) |
| Supabase | €0 (Free) / €25 (Pro) |
| Stripe | 1.4% + €0.25 per transazione |
| Dominio | ~€15/anno |

**Totale iniziale:** ~€0-45/mese + commissioni Stripe

---

## 12. Timeline Stimata

| Fase | Durata |
|------|--------|
| Setup progetto + DB | 2 giorni |
| Catalogo prodotti | 3 giorni |
| Carrello + Checkout | 3 giorni |
| Pannello Admin | 4 giorni |
| Auth + Account | 2 giorni |
| Testing + Fix | 3 giorni |
| Deploy + Go-live | 1 giorno |

**Totale:** ~2.5-3 settimane

---

## Approvazione

- [x] Stack tecnologico approvato
- [x] Schema database approvato
- [x] User personas validate
- [x] Edge cases documentati
- [x] Design mobile-first confermato

**Pronto per implementazione.**
