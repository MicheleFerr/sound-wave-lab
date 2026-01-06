-- supabase/migrations/20260106_order_access_token.sql
-- SECURITY: Add access_token column for guest order verification

-- Add access_token column (nullable, only used for guest orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON orders(access_token) WHERE access_token IS NOT NULL;

-- Comment explaining the purpose
COMMENT ON COLUMN orders.access_token IS 'Security token for guest order access - prevents order enumeration attacks';
