// src/app/admin/settings/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Setting {
  id: string
  key: string
  value: unknown
  category: string
}

async function getSettings(): Promise<Setting[]> {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .order('category')
    .order('key')

  return (settings || []) as Setting[]
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  // Group settings by category
  const settingsByCategory = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = []
    }
    acc[setting.category].push(setting)
    return acc
  }, {} as Record<string, typeof settings>)

  const categoryLabels: Record<string, string> = {
    homepage: 'Homepage',
    footer: 'Footer',
    contact: 'Contatti',
    pages: 'Pagine',
    store: 'Negozio',
    general: 'Generale',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Impostazioni</h1>
        <p className="text-muted-foreground">
          Gestisci i contenuti e le impostazioni del sito
        </p>
      </div>

      <Tabs defaultValue={Object.keys(settingsByCategory)[0] || 'homepage'}>
        <TabsList className="mb-4">
          {Object.keys(settingsByCategory).map((category) => (
            <TabsTrigger key={category} value={category}>
              {categoryLabels[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(settingsByCategory).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>{categoryLabels[category] || category}</CardTitle>
                <CardDescription>
                  Modifica le impostazioni per {categoryLabels[category]?.toLowerCase() || category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm settings={categorySettings} category={category} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
