-- supabase/migrations/20260106_fix_orders_checkout.sql
-- FIX: Ensure orders table has all required columns for checkout with coupons

-- =============================================
-- STEP 1: Ensure coupons table exists
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INT, -- NULL = unlimited
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 2: Add missing columns to orders table
-- =============================================

-- Add access_token for guest order verification
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token TEXT;

-- Add coupon tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- =============================================
-- STEP 3: Create indexes if they don't exist
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON orders(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_coupon ON orders(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- =============================================
-- STEP 4: Create atomic coupon increment function
-- =============================================
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons
  SET current_uses = COALESCE(current_uses, 0) + 1,
      updated_at = NOW()
  WHERE id = coupon_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO anon;

-- =============================================
-- STEP 5: Enable RLS on coupons if not enabled
-- =============================================
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist (use DO block for conditional creation)
DO $$
BEGIN
  -- Policy for viewing active coupons
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'coupons' AND policyname = 'Anyone can view active coupons'
  ) THEN
    CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true);
  END IF;

  -- Policy for admin management
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'coupons' AND policyname = 'Admins can manage coupons'
  ) THEN
    CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;
