// src/components/theme/ThemeProvider.tsx
import { createClient } from '@/lib/supabase/server'

interface ThemeSettings {
  font_primary: string
  font_heading: string
  font_mono: string
  color_brand_primary: string
  color_brand_accent: string
  color_brand_secondary: string
  color_background: string
  color_text: string
  text_transform: string
  letter_spacing_base: number
  letter_spacing_heading: number
  letter_spacing_button: number
  font_weight_heading: number
  font_weight_button: number
  border_radius: number
  border_width: number
}

// SECURITY: Validation patterns for CSS values to prevent CSS injection
const VALID_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/
const VALID_FONT_REGEX = /^[a-zA-Z0-9\s,'-]+$/
const VALID_TEXT_TRANSFORM = ['none', 'uppercase', 'lowercase', 'capitalize']

function sanitizeColor(value: string | undefined | null, fallback: string): string {
  if (!value || typeof value !== 'string') return fallback
  return VALID_COLOR_REGEX.test(value) ? value : fallback
}

function sanitizeFont(value: string | undefined | null, fallback: string): string {
  if (!value || typeof value !== 'string') return fallback
  // Remove any potentially dangerous characters and validate
  const cleaned = value.replace(/[;{}()<>]/g, '')
  return VALID_FONT_REGEX.test(cleaned) ? cleaned : fallback
}

function sanitizeTextTransform(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') return 'none'
  return VALID_TEXT_TRANSFORM.includes(value.toLowerCase()) ? value.toLowerCase() : 'none'
}

function sanitizeNumber(value: number | undefined | null, min: number, max: number, fallback: number): number {
  if (value === undefined || value === null) return fallback
  const num = Number(value)
  if (isNaN(num) || num < min || num > max) return fallback
  return num
}

// Default theme values
const defaults = {
  font_primary: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_heading: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  font_mono: 'SF Mono, Monaco, Courier New, monospace',
  color_brand_primary: '#000000',
  color_brand_accent: '#FFFF00',
  color_brand_secondary: '#FF0000',
  color_background: '#FFFFFF',
  color_text: '#000000',
  text_transform: 'uppercase',
  letter_spacing_base: 0.02,
  letter_spacing_heading: 0.08,
  letter_spacing_button: 0.05,
  font_weight_heading: 700,
  font_weight_button: 600,
  border_radius: 2,
  border_width: 1,
}

async function getThemeSettings(): Promise<ThemeSettings | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('theme_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = await getThemeSettings()

  // SECURITY: Sanitize all values from database to prevent CSS injection
  const themeVars = {
    font_primary: sanitizeFont(theme?.font_primary, defaults.font_primary),
    font_heading: sanitizeFont(theme?.font_heading, defaults.font_heading),
    font_mono: sanitizeFont(theme?.font_mono, defaults.font_mono),
    color_brand_primary: sanitizeColor(theme?.color_brand_primary, defaults.color_brand_primary),
    color_brand_accent: sanitizeColor(theme?.color_brand_accent, defaults.color_brand_accent),
    color_brand_secondary: sanitizeColor(theme?.color_brand_secondary, defaults.color_brand_secondary),
    color_background: sanitizeColor(theme?.color_background, defaults.color_background),
    color_text: sanitizeColor(theme?.color_text, defaults.color_text),
    text_transform: sanitizeTextTransform(theme?.text_transform),
    letter_spacing_base: sanitizeNumber(theme?.letter_spacing_base, 0, 1, defaults.letter_spacing_base),
    letter_spacing_heading: sanitizeNumber(theme?.letter_spacing_heading, 0, 1, defaults.letter_spacing_heading),
    letter_spacing_button: sanitizeNumber(theme?.letter_spacing_button, 0, 1, defaults.letter_spacing_button),
    font_weight_heading: sanitizeNumber(theme?.font_weight_heading, 100, 900, defaults.font_weight_heading),
    font_weight_button: sanitizeNumber(theme?.font_weight_button, 100, 900, defaults.font_weight_button),
    border_radius: sanitizeNumber(theme?.border_radius, 0, 50, defaults.border_radius),
    border_width: sanitizeNumber(theme?.border_width, 0, 10, defaults.border_width),
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Dynamic Theme Variables */
              --theme-font-primary: ${themeVars.font_primary};
              --theme-font-heading: ${themeVars.font_heading};
              --theme-font-mono: ${themeVars.font_mono};

              --theme-color-brand-primary: ${themeVars.color_brand_primary};
              --theme-color-brand-accent: ${themeVars.color_brand_accent};
              --theme-color-brand-secondary: ${themeVars.color_brand_secondary};
              --theme-color-background: ${themeVars.color_background};
              --theme-color-text: ${themeVars.color_text};

              --theme-text-transform: ${themeVars.text_transform};
              --theme-letter-spacing-base: ${themeVars.letter_spacing_base}em;
              --theme-letter-spacing-heading: ${themeVars.letter_spacing_heading}em;
              --theme-letter-spacing-button: ${themeVars.letter_spacing_button}em;
              --theme-font-weight-heading: ${themeVars.font_weight_heading};
              --theme-font-weight-button: ${themeVars.font_weight_button};

              --theme-border-radius: ${themeVars.border_radius}px;
              --theme-border-width: ${themeVars.border_width}px;

              /* Override CSS variables */
              --pure-black: var(--theme-color-brand-primary);
              --accent-yellow: var(--theme-color-brand-accent);
              --accent-red: var(--theme-color-brand-secondary);
            }

            body {
              font-family: var(--theme-font-primary) !important;
              letter-spacing: var(--theme-letter-spacing-base) !important;
            }

            h1, h2, h3, h4, h5, h6 {
              font-family: var(--theme-font-heading) !important;
              text-transform: var(--theme-text-transform) !important;
              letter-spacing: var(--theme-letter-spacing-heading) !important;
              font-weight: var(--theme-font-weight-heading) !important;
            }

            button, a {
              letter-spacing: var(--theme-letter-spacing-button) !important;
              font-weight: var(--theme-font-weight-button) !important;
            }

            .text-heading-minimal {
              font-family: var(--theme-font-heading) !important;
              text-transform: var(--theme-text-transform) !important;
            }

            .text-label-caps {
              font-family: var(--theme-font-heading) !important;
            }

            .text-price-mono {
              font-family: var(--theme-font-mono) !important;
            }

            .btn-outline, .btn-filled {
              font-family: var(--theme-font-primary) !important;
              text-transform: var(--theme-text-transform) !important;
            }
          `,
        }}
      />
      {children}
    </>
  )
}
