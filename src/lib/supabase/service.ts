import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Client service role — SERVEUR UNIQUEMENT
// Usage : cron scraping, analytics B2B (bypass RLS)
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
