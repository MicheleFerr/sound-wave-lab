// src/components/admin/SettingsForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Setting {
  id: string
  key: string
  value: unknown
  category: string
}

interface SettingsFormProps {
  settings: Setting[]
  category: string
}

// Field configurations for each setting key
const fieldConfigs: Record<string, { label: string; description?: string; type?: 'text' | 'textarea' | 'number' | 'email' | 'tel' | 'checkbox' }> = {
  // Homepage
  hero_title: { label: 'Titolo Hero (prima riga)', description: 'Es: "Indossa la tua"' },
  hero_subtitle: { label: 'Titolo Hero (seconda riga)', description: 'Es: "passione"' },
  hero_description: { label: 'Descrizione Hero', type: 'textarea' },
  hero_cta_primary: { label: 'Testo Pulsante Principale', description: 'Es: "Esplora il catalogo"' },
  hero_cta_secondary: { label: 'Testo Pulsante Secondario', description: 'Es: "Novità"' },

  // Footer
  footer_about: { label: 'Descrizione Footer', type: 'textarea' },
  footer_instagram: { label: 'Link Instagram', description: 'URL completo o lascia vuoto' },
  footer_facebook: { label: 'Link Facebook', description: 'URL completo o lascia vuoto' },
  footer_tiktok: { label: 'Link TikTok', description: 'URL completo o lascia vuoto' },

  // Contact
  contact_email: { label: 'Email', type: 'email' },
  contact_phone: { label: 'Telefono', type: 'tel' },
  contact_address: { label: 'Indirizzo', type: 'textarea' },

  // Store
  store_name: { label: 'Nome Negozio' },
  store_currency: { label: 'Valuta', description: 'Es: EUR, USD' },
  store_free_shipping_threshold: { label: 'Soglia Spedizione Gratuita (€)', type: 'number' },
  store_shipping_cost: { label: 'Costo Spedizione (€)', type: 'number' },

  // Trust Items
  trust_item_1_title: { label: 'Caratteristica 1 - Titolo' },
  trust_item_1_description: { label: 'Caratteristica 1 - Descrizione', type: 'textarea' },
  trust_item_2_title: { label: 'Caratteristica 2 - Titolo' },
  trust_item_2_description: { label: 'Caratteristica 2 - Descrizione', type: 'textarea' },
  trust_item_3_title: { label: 'Caratteristica 3 - Titolo' },
  trust_item_3_description: { label: 'Caratteristica 3 - Descrizione', type: 'textarea' },

  // Pages
  page_chi_siamo_title: { label: 'Titolo Pagina' },
  page_chi_siamo_content: { label: 'Contenuto', type: 'textarea' },
  page_spedizioni_title: { label: 'Titolo Pagina' },
  page_spedizioni_content: { label: 'Contenuto', type: 'textarea' },
  page_contatti_title: { label: 'Titolo Pagina' },
  page_contatti_content: { label: 'Contenuto', type: 'textarea' },
  page_privacy_title: { label: 'Titolo Pagina' },
  page_privacy_content: { label: 'Contenuto', type: 'textarea' },
  page_termini_title: { label: 'Titolo Pagina' },
  page_termini_content: { label: 'Contenuto', type: 'textarea' },

  // Header
  header_nav_1_text: { label: 'Link 1 - Testo' },
  header_nav_1_url: { label: 'Link 1 - URL', description: 'Es: /products' },
  header_nav_2_text: { label: 'Link 2 - Testo' },
  header_nav_2_url: { label: 'Link 2 - URL', description: 'Es: /products?sort=newest' },
  header_nav_3_text: { label: 'Link 3 - Testo' },
  header_nav_3_url: { label: 'Link 3 - URL', description: 'Es: /chi-siamo' },
  header_announcement: { label: 'Banner Annuncio', description: 'Testo mostrato sopra l\'header (lascia vuoto per nascondere)' },
  header_dark_mode_enabled: { label: 'Abilita Dark Mode Toggle', type: 'checkbox', description: 'Mostra il pulsante sole/luna per cambiare tema' },
}

// Extract simple value from setting
function extractValue(setting: Setting): Record<string, string | boolean> {
  const value = setting.value
  const result: Record<string, string | boolean> = {}

  // Handle boolean settings (checkboxes)
  if (setting.key === 'header_dark_mode_enabled') {
    result[setting.key] = Boolean(value)
    return result
  }

  // Handle CTA buttons - extract just the text
  if (setting.key === 'hero_cta_primary' || setting.key === 'hero_cta_secondary') {
    if (typeof value === 'object' && value !== null && 'text' in value) {
      result[setting.key] = String((value as { text: string }).text)
    } else {
      result[setting.key] = String(value)
    }
    return result
  }

  // Handle footer social - split into individual fields
  if (setting.key === 'footer_social') {
    if (typeof value === 'object' && value !== null) {
      const social = value as Record<string, string>
      result['footer_instagram'] = social.instagram || ''
      result['footer_facebook'] = social.facebook || ''
      result['footer_tiktok'] = social.tiktok || ''
    }
    return result
  }

  // Handle trust items - split into individual fields
  if (setting.key === 'trust_items') {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          result[`trust_item_${index + 1}_title`] = item.title || ''
          result[`trust_item_${index + 1}_description`] = item.description || ''
        }
      })
    }
    return result
  }

  // Handle page content - split title and content
  if (setting.key.startsWith('page_')) {
    if (typeof value === 'object' && value !== null) {
      const page = value as { title?: string; content?: string }
      result[`${setting.key}_title`] = page.title || ''
      result[`${setting.key}_content`] = page.content || ''
    }
    return result
  }

  // Handle header nav links - split into individual fields
  if (setting.key === 'header_nav_links') {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          result[`header_nav_${index + 1}_text`] = item.text || ''
          result[`header_nav_${index + 1}_url`] = item.url || ''
        }
      })
    }
    return result
  }

  // Simple values - remove quotes if JSON string
  if (typeof value === 'string') {
    result[setting.key] = value
  } else if (typeof value === 'number') {
    result[setting.key] = String(value)
  } else {
    result[setting.key] = String(value)
  }

  return result
}

// Reconstruct setting value from form fields
function reconstructValue(setting: Setting, formValues: Record<string, string | boolean>): unknown {
  // CTA buttons - reconstruct with fixed link
  if (setting.key === 'hero_cta_primary') {
    return { text: formValues['hero_cta_primary'], link: '/products' }
  }
  if (setting.key === 'hero_cta_secondary') {
    return { text: formValues['hero_cta_secondary'], link: '/products?sort=newest' }
  }

  // Footer social - reconstruct object
  if (setting.key === 'footer_social') {
    return {
      instagram: formValues['footer_instagram'] || '#',
      facebook: formValues['footer_facebook'] || '#',
      tiktok: formValues['footer_tiktok'] || '#',
    }
  }

  // Trust items - reconstruct array
  if (setting.key === 'trust_items') {
    return [
      { title: formValues['trust_item_1_title'], description: formValues['trust_item_1_description'], icon: 'check' },
      { title: formValues['trust_item_2_title'], description: formValues['trust_item_2_description'], icon: 'package' },
      { title: formValues['trust_item_3_title'], description: formValues['trust_item_3_description'], icon: 'refresh' },
    ]
  }

  // Page content - reconstruct object
  if (setting.key.startsWith('page_')) {
    return {
      title: formValues[`${setting.key}_title`],
      content: formValues[`${setting.key}_content`],
    }
  }

  // Header nav links - reconstruct array
  if (setting.key === 'header_nav_links') {
    const links = []
    for (let i = 1; i <= 3; i++) {
      const text = formValues[`header_nav_${i}_text`]
      const url = formValues[`header_nav_${i}_url`]
      if (text && url) {
        links.push({ text, url })
      }
    }
    return links
  }

  // Boolean values (checkboxes)
  if (setting.key === 'header_dark_mode_enabled') {
    const val = formValues[setting.key]
    return val === true || val === 'true'
  }

  // Numbers
  if (setting.key === 'store_free_shipping_threshold' || setting.key === 'store_shipping_cost') {
    return parseFloat(String(formValues[setting.key])) || 0
  }

  // Simple string values
  return formValues[setting.key]
}

export function SettingsForm({ settings, category }: SettingsFormProps) {
  // Extract all form values from settings
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initial: Record<string, string | boolean> = {}
    settings.forEach(setting => {
      const extracted = extractValue(setting)
      Object.assign(initial, extracted)
    })
    return initial
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (key: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [key]: value }))
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()

      for (const setting of settings) {
        const reconstructedValue = reconstructValue(setting, values)

        const { error } = await supabase
          .from('site_settings')
          .update({ value: reconstructedValue, updated_at: new Date().toISOString() })
          .eq('id', setting.id)

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Impostazioni salvate con successo!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Errore durante il salvataggio' })
    } finally {
      setSaving(false)
    }
  }

  // Get ordered field keys for this category
  const getFieldKeys = (): string[] => {
    const keys: string[] = []
    settings.forEach(setting => {
      const extracted = extractValue(setting)
      Object.keys(extracted).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key)
        }
      })
    })
    return keys
  }

  const fieldKeys = getFieldKeys()

  // Group fields for pages category
  const renderFields = () => {
    if (category === 'pages') {
      // Group by page
      const pages = ['chi_siamo', 'spedizioni', 'contatti', 'privacy', 'termini']
      const pageLabels: Record<string, string> = {
        chi_siamo: 'Chi Siamo',
        spedizioni: 'Spedizioni',
        contatti: 'Contatti',
        privacy: 'Privacy Policy',
        termini: 'Termini e Condizioni',
      }

      return pages.map(page => {
        const titleKey = `page_${page}_title`
        const contentKey = `page_${page}_content`

        if (!(titleKey in values)) return null

        return (
          <div key={page} className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">{pageLabels[page]}</h3>
            <div className="space-y-2">
              <Label htmlFor={titleKey}>Titolo</Label>
              <Input
                id={titleKey}
                value={String(values[titleKey] ?? '')}
                onChange={(e) => handleChange(titleKey, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={contentKey}>Contenuto</Label>
              <Textarea
                id={contentKey}
                value={String(values[contentKey] ?? '')}
                onChange={(e) => handleChange(contentKey, e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )
      })
    }

    // Regular fields
    return fieldKeys.map(key => {
      const config = fieldConfigs[key] || { label: key, type: 'text' as const }
      const value = values[key] || ''

      return (
        <div key={key} className="space-y-2">
          {config.type === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={Boolean(value)}
                onCheckedChange={(checked) => handleChange(key, checked)}
              />
              <div className="space-y-1">
                <Label htmlFor={key} className="font-normal cursor-pointer">{config.label}</Label>
                {config.description && (
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <Label htmlFor={key}>{config.label}</Label>
              {config.type === 'textarea' ? (
                <Textarea
                  id={key}
                  value={String(value)}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  id={key}
                  type={config.type || 'text'}
                  value={String(value)}
                  onChange={(e) => handleChange(key, e.target.value)}
                  step={config.type === 'number' ? '0.01' : undefined}
                />
              )}
              {config.description && (
                <p className="text-xs text-muted-foreground">{config.description}</p>
              )}
            </>
          )}
        </div>
      )
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFields()}

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={saving}
        className="bg-brand-gradient bg-brand-gradient-hover !text-white"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvataggio...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salva Modifiche
          </>
        )}
      </Button>
    </form>
  )
}
