-- Site Settings for customizable content
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default settings
INSERT INTO site_settings (key, value, category) VALUES
-- Hero Section
('hero_title', '"Indossa la tua"', 'homepage'),
('hero_subtitle', '"passione"', 'homepage'),
('hero_description', '"Magliette uniche con design originali. Qualità premium, spedizione gratuita."', 'homepage'),
('hero_cta_primary', '{"text": "Esplora il catalogo", "link": "/products"}', 'homepage'),
('hero_cta_secondary', '{"text": "Novità", "link": "/products"}', 'homepage'),

-- Trust Section
('trust_items', '[
  {"title": "Qualità Premium", "description": "100% cotone organico, stampa di alta qualità che dura nel tempo", "icon": "check"},
  {"title": "Spedizione Gratuita", "description": "Spedizione gratuita per ordini superiori a €50 in tutta Italia", "icon": "package"},
  {"title": "Reso Facile", "description": "30 giorni per cambiare idea con reso gratuito", "icon": "refresh"}
]', 'homepage'),

-- Footer
('footer_about', '"Sound Wave Lab - Magliette uniche per chi ama distinguersi"', 'footer'),
('footer_social', '{"instagram": "#", "facebook": "#", "tiktok": "#"}', 'footer'),

-- Contact Info
('contact_email', '"info@soundwavelab.it"', 'contact'),
('contact_phone', '"+39 02 1234567"', 'contact'),
('contact_address', '"Via della Musica 42, 20121 Milano, Italia"', 'contact'),

-- Pages Content
('page_chi_siamo', '{"title": "Chi Siamo", "content": "Sound Wave Lab nasce dalla passione per il design e la qualità. Creiamo magliette uniche per chi ama distinguersi."}', 'pages'),
('page_spedizioni', '{"title": "Spedizioni", "content": "Spediamo in tutta Italia con corriere espresso. Consegna in 2-4 giorni lavorativi. Spedizione gratuita per ordini superiori a €50."}', 'pages'),
('page_contatti', '{"title": "Contatti", "content": "Hai domande? Contattaci! Siamo sempre disponibili per aiutarti."}', 'pages'),
('page_privacy', '{"title": "Privacy Policy", "content": "La tua privacy è importante per noi. Questa policy descrive come raccogliamo e utilizziamo i tuoi dati."}', 'pages'),
('page_termini', '{"title": "Termini e Condizioni", "content": "Benvenuto su Sound Wave Lab. Utilizzando il nostro sito accetti i seguenti termini e condizioni."}', 'pages'),

-- Store Settings
('store_name', '"Sound Wave Lab"', 'store'),
('store_currency', '"EUR"', 'store'),
('store_free_shipping_threshold', '50', 'store'),
('store_shipping_cost', '4.99', 'store');
