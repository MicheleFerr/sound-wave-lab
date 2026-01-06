-- Theme Customization Settings
-- Single source of truth for all theme styling

-- Create theme_settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Font Configuration
  font_primary TEXT NOT NULL DEFAULT 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_heading TEXT NOT NULL DEFAULT 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_mono TEXT NOT NULL DEFAULT 'SF Mono, Monaco, Courier New, monospace',

  -- Brand Colors (HEX)
  color_brand_primary TEXT NOT NULL DEFAULT '#000000',
  color_brand_accent TEXT NOT NULL DEFAULT '#FFFF00',
  color_brand_secondary TEXT NOT NULL DEFAULT '#FF0000',
  color_background TEXT NOT NULL DEFAULT '#FFFFFF',
  color_text TEXT NOT NULL DEFAULT '#000000',

  -- Typography Settings
  text_transform TEXT NOT NULL DEFAULT 'uppercase',
  letter_spacing_base NUMERIC NOT NULL DEFAULT 0.02,
  letter_spacing_heading NUMERIC NOT NULL DEFAULT 0.08,
  letter_spacing_button NUMERIC NOT NULL DEFAULT 0.05,
  font_weight_heading INTEGER NOT NULL DEFAULT 700,
  font_weight_button INTEGER NOT NULL DEFAULT 600,

  -- Border & Spacing
  border_radius NUMERIC NOT NULL DEFAULT 2,
  border_width INTEGER NOT NULL DEFAULT 1,

  -- Active preset name (for UI reference)
  preset_name TEXT DEFAULT 'Custom',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default Off-White preset
INSERT INTO theme_settings (
  preset_name,
  font_primary,
  font_heading,
  font_mono,
  color_brand_primary,
  color_brand_accent,
  color_brand_secondary,
  color_background,
  color_text,
  text_transform,
  letter_spacing_base,
  letter_spacing_heading,
  letter_spacing_button,
  font_weight_heading,
  font_weight_button,
  border_radius,
  border_width
) VALUES (
  'Off-White',
  'Helvetica Neue, Helvetica, Arial, sans-serif',
  'Helvetica Neue, Helvetica, Arial, sans-serif',
  'SF Mono, Monaco, Courier New, monospace',
  '#000000',
  '#FFFF00',
  '#FF0000',
  '#FFFFFF',
  '#000000',
  'uppercase',
  0.02,
  0.08,
  0.05,
  700,
  600,
  2,
  1
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read theme settings
CREATE POLICY "Anyone can view theme settings" ON theme_settings FOR SELECT USING (true);

-- Only admins can update theme settings
CREATE POLICY "Admins can update theme settings" ON theme_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create index for faster queries
CREATE INDEX idx_theme_settings_updated ON theme_settings(updated_at DESC);
