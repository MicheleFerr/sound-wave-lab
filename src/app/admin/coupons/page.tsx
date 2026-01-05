// src/app/admin/coupons/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CouponList } from '@/components/admin/CouponList'

interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  is_active: boolean
  valid_from: string
  valid_until: string | null
  created_at: string
}

async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient()

  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return (coupons || []) as Coupon[]
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Coupon</h1>
        <p className="text-muted-foreground">
          Gestisci i codici sconto per il tuo negozio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutti i Coupon</CardTitle>
          <CardDescription>
            Crea e gestisci i codici sconto. I clienti possono applicarli al checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CouponList coupons={coupons} />
        </CardContent>
      </Card>
    </div>
  )
}
