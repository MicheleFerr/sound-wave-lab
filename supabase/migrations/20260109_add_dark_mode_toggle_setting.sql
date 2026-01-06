-- Add dark mode toggle setting to header category
INSERT INTO site_settings (key, value, category) VALUES
('header_dark_mode_enabled', 'true', 'header')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    category = EXCLUDED.category,
    updated_at = NOW();
