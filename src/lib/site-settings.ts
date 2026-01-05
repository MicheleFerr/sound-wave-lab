// src/lib/site-settings.ts
import { createClient } from '@/lib/supabase/server'

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  return data?.value as T | null
}

export async function getSiteSettings(keys: string[]): Promise<Record<string, unknown>> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', keys)

  if (!data) return {}

  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, unknown>)
}

export async function getSettingsByCategory(category: string): Promise<Record<string, unknown>> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('category', category)

  if (!data) return {}

  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, unknown>)
}

// Type definitions for settings
export interface PageContent {
  title: string
  content: string
}

export interface HeroContent {
  text: string
  link: string
}

export interface TrustItem {
  title: string
  description: string
  icon: string
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export interface FooterSocial {
  instagram?: string
  facebook?: string
  tiktok?: string
  twitter?: string
}
