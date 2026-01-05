-- supabase/migrations/20260108_coupons.sql
-- Coupon/Discount system

-- =============================================
-- COUPONS TABLE
-- =============================================
CREATE TABLE coupons (
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

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- =============================================
-- ADD COUPON REFERENCE TO ORDERS
-- =============================================
ALTER TABLE orders ADD COLUMN coupon_id UUID REFERENCES coupons(id);
ALTER TABLE orders ADD COLUMN coupon_code TEXT;

CREATE INDEX idx_orders_coupon ON orders(coupon_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Anyone can validate active coupons
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true);

-- Admins can manage all coupons
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- SEED TEST COUPON (100% discount)
-- =============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active)
VALUES
  ('TEST100', 'Test coupon - 100% discount', 'percentage', 100, 0, NULL, true),
  ('WELCOME10', 'Welcome discount - 10%', 'percentage', 10, 0, NULL, true),
  ('SAVE5', 'Save 5€ on your order', 'fixed_amount', 5, 20, NULL, true);
