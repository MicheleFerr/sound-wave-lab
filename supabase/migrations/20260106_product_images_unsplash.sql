-- supabase/migrations/20260106_product_images_unsplash.sql
-- Replace placeholder images with real Unsplash photos and add secondary images for hover effect

-- First, delete existing placeholder images
DELETE FROM product_images WHERE url LIKE '%placehold.co%';

-- Insert real product images from Unsplash (commercial use allowed)
-- Primary images (sort_order = 0) + Secondary images for hover effect (sort_order = 1)

-- Moog Tribute (Nero/Black)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'Moog Tribute T-Shirt Nera', true, 0),
  ('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', 'Moog Tribute T-Shirt Nera - Vista alternativa', false, 1);

-- Vinyl Forever (Bianco/White)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', 'Vinyl Forever T-Shirt Bianca', true, 0),
  ('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'Vinyl Forever T-Shirt Bianca - Indossata', false, 1);

-- Cassette Vibes (Grigio/Grey)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', 'Cassette Vibes T-Shirt Grigia', true, 0),
  ('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80', 'Cassette Vibes T-Shirt - Vista alternativa', false, 1);

-- Waveform (Nero/Black)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', 'Waveform T-Shirt Nera', true, 0),
  ('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'Waveform T-Shirt Nera - Vista alternativa', false, 1);

-- Roland 808 (Rosso/Red - using dark tones)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80', 'Roland 808 T-Shirt', true, 0),
  ('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', 'Roland 808 T-Shirt - Vista alternativa', false, 1);

-- CDJ Pro (Nero/Black)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=800&q=80', 'CDJ Pro T-Shirt Nera', true, 0),
  ('b6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', 'CDJ Pro T-Shirt Nera - Vista alternativa', false, 1);
