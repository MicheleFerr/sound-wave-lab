-- supabase/migrations/20260106_atomic_coupon_increment.sql
-- SECURITY: Atomic increment function for coupon usage to prevent race conditions

CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons
  SET current_uses = COALESCE(current_uses, 0) + 1,
      updated_at = NOW()
  WHERE id = coupon_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO anon;
