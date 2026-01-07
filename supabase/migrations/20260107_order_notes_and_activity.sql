-- Migration: Add order notes and activity log tables
-- Created: 2026-01-07

-- Order Notes Table
-- Stores both internal notes (admin only) and customer notes (sent via email)
CREATE TABLE order_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('internal', 'customer')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Activity Log Table
-- Tracks all actions performed on an order (status changes, refunds, emails, etc.)
CREATE TABLE order_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'status_change',
    'refund',
    'cancellation',
    'shipment',
    'email_sent',
    'note_added',
    'order_edited',
    'payment_captured'
  )),
  previous_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX idx_order_notes_created_at ON order_notes(created_at DESC);
CREATE INDEX idx_order_activity_log_order_id ON order_activity_log(order_id);
CREATE INDEX idx_order_activity_log_created_at ON order_activity_log(created_at DESC);
CREATE INDEX idx_order_activity_log_action_type ON order_activity_log(action_type);

-- Enable Row Level Security
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_notes
-- Admins can see all notes, customers can only see customer-facing notes for their orders
CREATE POLICY "Admins can view all order notes"
  ON order_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Customers can view their customer notes"
  ON order_notes FOR SELECT
  USING (
    note_type = 'customer'
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_notes.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create order notes"
  ON order_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update order notes"
  ON order_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete order notes"
  ON order_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for order_activity_log
-- Admins can see all activity, customers can see activity for their orders
CREATE POLICY "Admins can view all order activity"
  ON order_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Customers can view their order activity"
  ON order_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_activity_log.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create order activity"
  ON order_activity_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_notes_updated_at
  BEFORE UPDATE ON order_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_order_notes_updated_at();

-- Comments for documentation
COMMENT ON TABLE order_notes IS 'Stores notes added to orders by admins. Can be internal (admin only) or customer-facing (sent via email).';
COMMENT ON TABLE order_activity_log IS 'Audit log tracking all actions performed on orders (status changes, refunds, emails, etc.).';
COMMENT ON COLUMN order_notes.note_type IS 'Type of note: internal (admin only) or customer (sent to customer via email)';
COMMENT ON COLUMN order_activity_log.action_type IS 'Type of action performed: status_change, refund, cancellation, shipment, email_sent, note_added, order_edited, payment_captured';
COMMENT ON COLUMN order_activity_log.metadata IS 'Additional context about the action (e.g., email subject, refund reason, etc.)';
