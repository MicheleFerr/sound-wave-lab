-- supabase/migrations/20260112_add_tracking_url.sql
-- Add tracking URL field to orders

-- Add tracking_url column to orders table
ALTER TABLE orders ADD COLUMN tracking_url TEXT;

-- Add index for quick lookup of orders with tracking URL
CREATE INDEX idx_orders_tracking_url ON orders(tracking_url) WHERE tracking_url IS NOT NULL;
