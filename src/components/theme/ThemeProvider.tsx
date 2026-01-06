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

  // Fallback to defaults if no theme found
  const themeVars = theme || {
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
