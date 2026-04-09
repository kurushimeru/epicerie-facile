import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { syncAllStores } from '@/adapters/locators/StoreLocatorOrchestrator'

export const maxDuration = 300 // 5 min — Vercel Pro max pour les crons

export async function GET(req: NextRequest) {
  // Auth cron
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const signal = AbortSignal.timeout(240_000) // 4 min — requête unique Overpass ~1-2 min

  let syncResult
  try {
    syncResult = await syncAllStores(signal)
  } catch (err) {
    console.error('[sync-stores] Fatal error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  const { stores, rawCount } = syncResult

  if (stores.length === 0) {
    return NextResponse.json({ ok: false, error: 'No stores found' })
  }

  const supabase = createServiceClient()

  // Upsert chains (ignorer les chaînes déjà existantes)
  const uniqueChains = [...new Set(stores.map(s => s.chain))]
  await supabase
    .from('stores')
    .upsert(
      uniqueChains.map(chain => ({ chain, name: chain })),
      { onConflict: 'chain', ignoreDuplicates: true }
    )

  // Récupérer la map chain → store.id
  const { data: chainRows } = await supabase
    .from('stores')
    .select('id, chain')
  const chainMap = new Map((chainRows ?? []).map(r => [r.chain, r.id]))

  // Upsert store_locations par batch de 200
  let upserted = 0
  const BATCH = 200
  for (let i = 0; i < stores.length; i += BATCH) {
    const batch = stores.slice(i, i + BATCH)
    const rows = batch
      .filter(s => chainMap.has(s.chain))
      .map(s => ({
        store_id: chainMap.get(s.chain)!,
        external_id: s.externalId,
        name: s.name,
        address: s.address,
        city: s.city,
        province: s.province,
        country: s.country,
        postal_code: s.postalCode,
        latitude: s.latitude,
        longitude: s.longitude,
        phone: s.phone ?? null,
        hours: s.hours ?? null,
      }))

    const { error } = await supabase
      .from('store_locations')
      .upsert(rows, { onConflict: 'external_id' })

    if (error) {
      console.error('[sync-stores] Upsert error:', error.message)
    } else {
      upserted += rows.length
    }
  }

  console.log(`[sync-stores] Done: ${upserted} upserted, ${rawCount} raw`)

  return NextResponse.json({
    ok: true,
    rawCount,
    uniqueStores: stores.length,
    upserted,
  })
}
