-- supabase/migrations/20260106_guest_order_association.sql
-- Auto-associate guest orders when user registers with same email
-- Also adds newsletter subscription field

-- =============================================
-- STEP 1: Add newsletter subscription to profiles
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT false;

-- =============================================
-- STEP 2: Update handle_new_user function to associate guest orders
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile (existing behavior)
  INSERT INTO public.profiles (id, email, full_name, newsletter_subscribed)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'newsletter_subscribed')::boolean, false)
  );

  -- NEW: Associate guest orders with same email to this new user
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE user_id IS NULL
    AND shipping_address->>'email' = NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 3: Function to send welcome email via Edge Function (optional)
-- This can be called by a trigger or manually
-- =============================================
-- Note: For welcome emails, we'll use the API route approach instead
-- as it's more reliable with Next.js/Vercel deployment

-- =============================================
-- STEP 4: Add RLS policy for users to see their associated orders
-- (orders that were guest orders but now have their user_id)
-- =============================================
-- The existing policy already handles this since we're updating user_id
