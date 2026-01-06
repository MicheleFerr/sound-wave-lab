-- supabase/migrations/20260111_coupon_banner.sql
-- Add banner functionality to coupons

-- Add banner_enabled column to coupons table
ALTER TABLE coupons ADD COLUMN banner_enabled BOOLEAN DEFAULT false;

-- Create index for quick banner lookup
CREATE INDEX idx_coupons_banner ON coupons(banner_enabled) WHERE banner_enabled = true;

-- Function to ensure only one coupon has banner enabled at a time
CREATE OR REPLACE FUNCTION ensure_single_banner_coupon()
RETURNS TRIGGER AS $$
BEGIN
  -- If enabling banner for this coupon, disable all others
  IF NEW.banner_enabled = true THEN
    UPDATE coupons
    SET banner_enabled = false
    WHERE id != NEW.id AND banner_enabled = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single banner coupon
CREATE TRIGGER single_banner_coupon
  BEFORE UPDATE OF banner_enabled ON coupons
  FOR EACH ROW
  WHEN (NEW.banner_enabled = true)
  EXECUTE FUNCTION ensure_single_banner_coupon();
