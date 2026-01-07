-- supabase/migrations/20260112_add_estimated_delivery_date.sql
-- Add estimated delivery date field to orders

-- Add estimated_delivery_date column to orders table
ALTER TABLE orders ADD COLUMN estimated_delivery_date TIMESTAMPTZ;

-- Add index for quick lookup of orders by estimated delivery date
CREATE INDEX idx_orders_estimated_delivery ON orders(estimated_delivery_date) WHERE estimated_delivery_date IS NOT NULL;
