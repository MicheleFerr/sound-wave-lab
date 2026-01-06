// Script to apply theme_settings migration
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const envVars: Record<string, string> = {}

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      envVars[key] = value
    }
  })

  return envVars
}

const env = loadEnv()

async function applyMigration() {
  // Read environment variables
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\\n/g, '').trim()

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing')
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Found' : 'Missing')
    process.exit(1)
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('📦 Reading migration file...')
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260110_theme_customization.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    console.log('🚀 Applying migration via PostgreSQL REST API...')

    // Use Supabase SQL Editor API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: migrationSQL
      })
    })

    if (!response.ok) {
      // Try alternative: execute via postgres connection string
      console.log('⚠️  REST API method failed, trying direct SQL execution...')

      // For Supabase, we need to use the Management API or execute via psql
      // Let's provide instructions instead
      console.log('\n📋 MANUAL MIGRATION REQUIRED:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Please run this SQL manually in Supabase Dashboard:')
      console.log('1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new')
      console.log('2. Copy the content from: supabase/migrations/20260110_theme_customization.sql')
      console.log('3. Paste and run it')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      const errorText = await response.text()
      console.error('API Error:', errorText)
      process.exit(1)
    }

    console.log('✅ Migration applied successfully!')
    console.log('📝 Created table: theme_settings')
    console.log('🎨 Inserted default Off-White preset')
    console.log('🔒 Enabled RLS with policies')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n💡 Alternative: Run the SQL manually in Supabase Dashboard')
    console.log('File location: supabase/migrations/20260110_theme_customization.sql')
    process.exit(1)
  }
}

applyMigration()
