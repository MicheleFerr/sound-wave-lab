// src/app/admin/personalizzazione/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ThemeCustomizer } from '@/components/admin/ThemeCustomizer'

async function getThemeSettings() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('theme_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  return data || {
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
    preset_name: 'Off-White',
  }
}

export default async function PersonalizzazionePage() {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const theme = await getThemeSettings()

  return (
    <div className="container mx-auto px-4 py-8">
      <ThemeCustomizer initialTheme={theme} />
    </div>
  )
}
