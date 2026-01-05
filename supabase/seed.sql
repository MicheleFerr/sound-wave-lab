-- supabase/seed.sql
-- Sample data for Sound Wave Lab

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Synth', 'synth', 'Magliette ispirate ai sintetizzatori', 1),
  ('a2222222-2222-2222-2222-222222222222', 'DJ', 'dj', 'Magliette per DJ e produttori', 2),
  ('a3333333-3333-3333-3333-333333333333', 'Vintage', 'vintage', 'Design retrò e vintage audio', 3),
  ('a4444444-4444-4444-4444-444444444444', 'Minimal', 'minimal', 'Design minimalisti', 4);

-- Products
INSERT INTO products (id, name, slug, description, category_id, is_active, is_featured) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Moog Tribute', 'moog-tribute', 'Omaggio al leggendario Moog', 'a1111111-1111-1111-1111-111111111111', true, true),
  ('b2222222-2222-2222-2222-222222222222', 'Vinyl Forever', 'vinyl-forever', 'Per chi ama il vinile', 'a2222222-2222-2222-2222-222222222222', true, true),
  ('b3333333-3333-3333-3333-333333333333', 'Cassette Vibes', 'cassette-vibes', 'Nostalgia anni 80', 'a3333333-3333-3333-3333-333333333333', true, false),
  ('b4444444-4444-4444-4444-444444444444', 'Waveform', 'waveform', 'Design minimalista con forma d''onda', 'a4444444-4444-4444-4444-444444444444', true, true),
  ('b5555555-5555-5555-5555-555555555555', 'Roland 808', 'roland-808', 'Tributo alla drum machine leggendaria', 'a1111111-1111-1111-1111-111111111111', true, false),
  ('b6666666-6666-6666-6666-666666666666', 'CDJ Pro', 'cdj-pro', 'Per i DJ professionisti', 'a2222222-2222-2222-2222-222222222222', true, false);

-- Product Variants (sizes: S, M, L, XL)
INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, attributes) VALUES
  -- Moog Tribute
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'MOOG-BLK-S', 29.99, 15, '{"size": "S", "color": "Nero"}'),
  ('c1111111-1111-1111-1111-111111111112', 'b1111111-1111-1111-1111-111111111111', 'MOOG-BLK-M', 29.99, 20, '{"size": "M", "color": "Nero"}'),
  ('c1111111-1111-1111-1111-111111111113', 'b1111111-1111-1111-1111-111111111111', 'MOOG-BLK-L', 29.99, 18, '{"size": "L", "color": "Nero"}'),
  ('c1111111-1111-1111-1111-111111111114', 'b1111111-1111-1111-1111-111111111111', 'MOOG-BLK-XL', 29.99, 10, '{"size": "XL", "color": "Nero"}'),

  -- Vinyl Forever
  ('c2222222-2222-2222-2222-222222222221', 'b2222222-2222-2222-2222-222222222222', 'VINYL-WHT-S', 27.99, 12, '{"size": "S", "color": "Bianco"}'),
  ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'VINYL-WHT-M', 27.99, 25, '{"size": "M", "color": "Bianco"}'),
  ('c2222222-2222-2222-2222-222222222223', 'b2222222-2222-2222-2222-222222222222', 'VINYL-WHT-L', 27.99, 20, '{"size": "L", "color": "Bianco"}'),
  ('c2222222-2222-2222-2222-222222222224', 'b2222222-2222-2222-2222-222222222222', 'VINYL-WHT-XL', 27.99, 8, '{"size": "XL", "color": "Bianco"}'),

  -- Cassette Vibes
  ('c3333333-3333-3333-3333-333333333331', 'b3333333-3333-3333-3333-333333333333', 'CASS-GRY-S', 24.99, 10, '{"size": "S", "color": "Grigio"}'),
  ('c3333333-3333-3333-3333-333333333332', 'b3333333-3333-3333-3333-333333333333', 'CASS-GRY-M', 24.99, 15, '{"size": "M", "color": "Grigio"}'),
  ('c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'CASS-GRY-L', 24.99, 12, '{"size": "L", "color": "Grigio"}'),
  ('c3333333-3333-3333-3333-333333333334', 'b3333333-3333-3333-3333-333333333333', 'CASS-GRY-XL', 24.99, 6, '{"size": "XL", "color": "Grigio"}'),

  -- Waveform
  ('c4444444-4444-4444-4444-444444444441', 'b4444444-4444-4444-4444-444444444444', 'WAVE-BLK-S', 32.99, 8, '{"size": "S", "color": "Nero"}'),
  ('c4444444-4444-4444-4444-444444444442', 'b4444444-4444-4444-4444-444444444444', 'WAVE-BLK-M', 32.99, 14, '{"size": "M", "color": "Nero"}'),
  ('c4444444-4444-4444-4444-444444444443', 'b4444444-4444-4444-4444-444444444444', 'WAVE-BLK-L', 32.99, 16, '{"size": "L", "color": "Nero"}'),
  ('c4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'WAVE-BLK-XL', 32.99, 5, '{"size": "XL", "color": "Nero"}'),

  -- Roland 808
  ('c5555555-5555-5555-5555-555555555551', 'b5555555-5555-5555-5555-555555555555', '808-RED-S', 29.99, 10, '{"size": "S", "color": "Rosso"}'),
  ('c5555555-5555-5555-5555-555555555552', 'b5555555-5555-5555-5555-555555555555', '808-RED-M', 29.99, 18, '{"size": "M", "color": "Rosso"}'),
  ('c5555555-5555-5555-5555-555555555553', 'b5555555-5555-5555-5555-555555555555', '808-RED-L', 29.99, 14, '{"size": "L", "color": "Rosso"}'),
  ('c5555555-5555-5555-5555-555555555554', 'b5555555-5555-5555-5555-555555555555', '808-RED-XL', 29.99, 7, '{"size": "XL", "color": "Rosso"}'),

  -- CDJ Pro
  ('c6666666-6666-6666-6666-666666666661', 'b6666666-6666-6666-6666-666666666666', 'CDJ-BLK-S', 34.99, 6, '{"size": "S", "color": "Nero"}'),
  ('c6666666-6666-6666-6666-666666666662', 'b6666666-6666-6666-6666-666666666666', 'CDJ-BLK-M', 34.99, 12, '{"size": "M", "color": "Nero"}'),
  ('c6666666-6666-6666-6666-666666666663', 'b6666666-6666-6666-6666-666666666666', 'CDJ-BLK-L', 34.99, 10, '{"size": "L", "color": "Nero"}'),
  ('c6666666-6666-6666-6666-666666666664', 'b6666666-6666-6666-6666-666666666666', 'CDJ-BLK-XL', 34.99, 4, '{"size": "XL", "color": "Nero"}');

-- Product Images (using placeholder URLs - replace with real images later)
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'https://placehold.co/800x800/1a1a1a/white?text=Moog+Tribute', 'Moog Tribute T-Shirt', true, 0),
  ('b2222222-2222-2222-2222-222222222222', 'https://placehold.co/800x800/ffffff/1a1a1a?text=Vinyl+Forever', 'Vinyl Forever T-Shirt', true, 0),
  ('b3333333-3333-3333-3333-333333333333', 'https://placehold.co/800x800/4a4a4a/white?text=Cassette+Vibes', 'Cassette Vibes T-Shirt', true, 0),
  ('b4444444-4444-4444-4444-444444444444', 'https://placehold.co/800x800/0a0a0a/00ff00?text=Waveform', 'Waveform T-Shirt', true, 0),
  ('b5555555-5555-5555-5555-555555555555', 'https://placehold.co/800x800/8b0000/white?text=Roland+808', 'Roland 808 T-Shirt', true, 0),
  ('b6666666-6666-6666-6666-666666666666', 'https://placehold.co/800x800/1a1a1a/00bfff?text=CDJ+Pro', 'CDJ Pro T-Shirt', true, 0);
