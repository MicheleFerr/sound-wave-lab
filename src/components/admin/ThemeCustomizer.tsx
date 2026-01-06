// src/components/admin/ThemeCustomizer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Save, RotateCcw, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ThemeSettings {
  id?: string
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
  preset_name: string
}

const FONT_OPTIONS = [
  { value: 'Helvetica Neue, Helvetica, Arial, sans-serif', label: 'Helvetica Neue (Off-White Style)' },
  { value: 'Inter, system-ui, sans-serif', label: 'Inter (Modern)' },
  { value: 'Georgia, serif', label: 'Georgia (Classico)' },
  { value: 'Courier New, monospace', label: 'Courier (Typewriter)' },
  { value: 'Arial, sans-serif', label: 'Arial (Standard)' },
]

const PRESETS: Record<string, Partial<ThemeSettings>> = {
  'Off-White': {
    font_primary: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    font_heading: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    color_brand_primary: '#000000',
    color_brand_accent: '#FFFF00',
    color_brand_secondary: '#FF0000',
    text_transform: 'uppercase',
    letter_spacing_heading: 0.12,
    font_weight_heading: 700,
    border_radius: 2,
  },
  'Minimal': {
    font_primary: 'Inter, system-ui, sans-serif',
    font_heading: 'Inter, system-ui, sans-serif',
    color_brand_primary: '#1a1a1a',
    color_brand_accent: '#6366f1',
    color_brand_secondary: '#ec4899',
    text_transform: 'none',
    letter_spacing_heading: 0.02,
    font_weight_heading: 600,
    border_radius: 8,
  },
  'Classic': {
    font_primary: 'Georgia, serif',
    font_heading: 'Georgia, serif',
    color_brand_primary: '#2d3748',
    color_brand_accent: '#d4af37',
    color_brand_secondary: '#8b4513',
    text_transform: 'capitalize',
    letter_spacing_heading: 0.01,
    font_weight_heading: 500,
    border_radius: 4,
  },
}

interface ThemeCustomizerProps {
  initialTheme: ThemeSettings
}

export function ThemeCustomizer({ initialTheme }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to preview when shown
  useEffect(() => {
    if (showPreview && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showPreview])

  const handleChange = (key: keyof ThemeSettings, value: string | number) => {
    setTheme(prev => ({
      ...prev,
      [key]: value,
      preset_name: 'Custom' // Mark as custom when manually edited
    }))
  }

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName]
    if (preset) {
      setTheme(prev => ({
        ...prev,
        ...preset,
        preset_name: presetName
      }))
      toast.success(`Preset "${presetName}" applicato`)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('theme_settings')
        .upsert({
          ...theme,
          id: theme.id,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Tema salvato! Ricarica la pagina per vedere le modifiche.')
    } catch (error) {
      console.error('Error saving theme:', error)
      toast.error('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = () => {
    applyPreset('Off-White')
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personalizzazione Tema</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Modifica i colori, font e stile del tuo sito
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Nascondi' : 'Mostra'} Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Preset Selection */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">🎨 Preset Veloci</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(PRESETS).map((presetName) => (
                <Button
                  key={presetName}
                  variant={theme.preset_name === presetName ? 'default' : 'outline'}
                  onClick={() => applyPreset(presetName)}
                  className="text-xs"
                >
                  {presetName}
                </Button>
              ))}
            </div>
            {theme.preset_name === 'Custom' && (
              <p className="text-xs text-muted-foreground mt-2">Tema personalizzato</p>
            )}
          </Card>

          {/* Colors */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">🎨 Colori Brand</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2 block">Colore Principale</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.color_brand_primary}
                      onChange={(e) => handleChange('color_brand_primary', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={theme.color_brand_primary}
                      onChange={(e) => handleChange('color_brand_primary', e.target.value)}
                      className="flex-1 font-mono text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Colore Accento</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.color_brand_accent}
                      onChange={(e) => handleChange('color_brand_accent', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={theme.color_brand_accent}
                      onChange={(e) => handleChange('color_brand_accent', e.target.value)}
                      className="flex-1 font-mono text-xs"
                      placeholder="#FFFF00"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Colore Secondario</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.color_brand_secondary}
                      onChange={(e) => handleChange('color_brand_secondary', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={theme.color_brand_secondary}
                      onChange={(e) => handleChange('color_brand_secondary', e.target.value)}
                      className="flex-1 font-mono text-xs"
                      placeholder="#FF0000"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Colore Testo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.color_text}
                      onChange={(e) => handleChange('color_text', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={theme.color_text}
                      onChange={(e) => handleChange('color_text', e.target.value)}
                      className="flex-1 font-mono text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">🔤 Tipografia</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-2 block">Font Principale</Label>
                <Select
                  value={theme.font_primary}
                  onValueChange={(value) => handleChange('font_primary', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Font Titoli</Label>
                <Select
                  value={theme.font_heading}
                  onValueChange={(value) => handleChange('font_heading', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Stile Testo</Label>
                <Select
                  value={theme.text_transform}
                  onValueChange={(value) => handleChange('text_transform', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uppercase">TUTTO MAIUSCOLO</SelectItem>
                    <SelectItem value="capitalize">Prima Lettera Maiuscola</SelectItem>
                    <SelectItem value="none">Normale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2 block">
                    Spaziatura Titoli: {theme.letter_spacing_heading}em
                  </Label>
                  <Input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={theme.letter_spacing_heading}
                    onChange={(e) => handleChange('letter_spacing_heading', parseFloat(e.target.value))}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">
                    Peso Titoli: {theme.font_weight_heading}
                  </Label>
                  <Select
                    value={String(theme.font_weight_heading)}
                    onValueChange={(value) => handleChange('font_weight_heading', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Normale (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semi-Bold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                      <SelectItem value="800">Extra-Bold (800)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Borders */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">📐 Bordi e Forme</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-2 block">
                  Arrotondamento Bordi: {theme.border_radius}px
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={theme.border_radius}
                  onChange={(e) => handleChange('border_radius', parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {theme.border_radius === 0 ? 'Quadrato' : theme.border_radius < 5 ? 'Minimal' : theme.border_radius < 10 ? 'Arrotondato' : 'Molto arrotondato'}
                </p>
              </div>

              <div>
                <Label className="text-xs mb-2 block">
                  Spessore Bordi: {theme.border_width}px
                </Label>
                <Input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={theme.border_width}
                  onChange={(e) => handleChange('border_width', parseInt(e.target.value))}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        {showPreview && (
          <div ref={previewRef} className="space-y-6">
            <div className="sticky top-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">👁️ Anteprima</h3>
              <div className="space-y-6">
                {/* Preview styles */}
                <div
                  style={{
                    fontFamily: theme.font_primary,
                    letterSpacing: `${theme.letter_spacing_base}em`,
                  }}
                >
                  <h1
                    style={{
                      fontFamily: theme.font_heading,
                      textTransform: theme.text_transform as any,
                      letterSpacing: `${theme.letter_spacing_heading}em`,
                      fontWeight: theme.font_weight_heading,
                      color: theme.color_brand_primary,
                      fontSize: '24px',
                      marginBottom: '12px',
                    }}
                  >
                    Esempio Titolo
                  </h1>
                  <p style={{ color: theme.color_text, marginBottom: '16px' }}>
                    Questo è un esempio di testo normale con il font principale che hai scelto.
                  </p>

                  <button
                    style={{
                      background: theme.color_brand_primary,
                      color: '#fff',
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: `${theme.border_radius}px`,
                      fontWeight: theme.font_weight_button,
                      letterSpacing: `${theme.letter_spacing_button}em`,
                      textTransform: theme.text_transform as any,
                      cursor: 'pointer',
                      marginRight: '8px',
                    }}
                  >
                    Pulsante Principale
                  </button>

                  <button
                    style={{
                      background: 'transparent',
                      color: theme.color_brand_primary,
                      padding: '12px 24px',
                      border: `${theme.border_width}px solid ${theme.color_brand_primary}`,
                      borderRadius: `${theme.border_radius}px`,
                      fontWeight: theme.font_weight_button,
                      letterSpacing: `${theme.letter_spacing_button}em`,
                      textTransform: theme.text_transform as any,
                      cursor: 'pointer',
                    }}
                  >
                    Pulsante Outline
                  </button>

                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      border: `${theme.border_width}px solid ${theme.color_brand_primary}`,
                      borderRadius: `${theme.border_radius}px`,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: theme.font_heading,
                        textTransform: theme.text_transform as any,
                        fontSize: '18px',
                        marginBottom: '8px',
                        color: theme.color_brand_primary,
                      }}
                    >
                      Card Esempio
                    </h3>
                    <p style={{ fontSize: '14px', color: theme.color_text }}>
                      Contenuto della card con il tuo tema personalizzato
                    </p>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        background: theme.color_brand_accent,
                        color: '#000',
                        padding: '4px 12px',
                        borderRadius: `${theme.border_radius}px`,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      Colore Accento
                    </span>
                    <span
                      style={{
                        background: theme.color_brand_secondary,
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: `${theme.border_radius}px`,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      Colore Secondario
                    </span>
                  </div>
                </div>
              </div>
            </Card>

              <Card className="p-6 bg-blue-50 border-blue-200 mt-6">
                <h4 className="font-semibold text-sm mb-2 text-blue-900">💡 Suggerimento</h4>
                <p className="text-xs text-blue-700">
                  Dopo aver salvato le modifiche, <strong>ricarica la pagina</strong> per vedere il tema applicato in tutto il sito.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
