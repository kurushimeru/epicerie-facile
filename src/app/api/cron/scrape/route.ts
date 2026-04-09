import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { scrapeAll } from '@/adapters/ScraperOrchestrator'
import type { NormalizedProduct, StoreChain } from '@/types'

// Vercel Cron appelle cette route — protégée par CRON_SECRET
export const maxDuration = 300  // 5 min (Vercel Pro)

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = Date.now()
  const supabase = createServiceClient()

  // 1. Charger la map chain → store_id une seule fois
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('id, chain')

  if (storesError || !stores) {
    return NextResponse.json({ error: 'Failed to load stores', detail: storesError?.message }, { status: 500 })
  }

  const storeIdByChain = new Map<StoreChain, string>(
    stores.map(s => [s.chain as StoreChain, s.id])
  )

  // 2. Scraper toutes les enseignes
  const { products, results: scrapeResults } = await scrapeAll()

  if (products.length === 0) {
    return NextResponse.json({
      message: 'No products scraped',
      scrapeResults,
      durationMs: Date.now() - startedAt,
    })
  }

  // 3. Upsert produits + insérer price_snapshots (par batch de 500)
  const upsertErrors: string[] = []
  let upsertedProducts = 0
  let insertedSnapshots = 0

  const byChain = groupByChain(products)

  for (const [chain, items] of byChain) {
    const storeId = storeIdByChain.get(chain)
    if (!storeId) {
      upsertErrors.push(`Store non trouvé pour chain: ${chain}`)
      continue
    }

    // Upsert produits par batch
    for (const batch of chunks(items, 500)) {
      const productRows = batch.map(p => ({
        store_id: storeId,
        external_id: p.externalId,
        name: p.name,
        image_url: p.imageUrl ?? null,
        product_url: p.productUrl,
        unit: p.unit ?? null,
      }))

      const { data: upserted, error: upsertError } = await supabase
        .from('products')
        .upsert(productRows, { onConflict: 'store_id,external_id', ignoreDuplicates: false })
        .select('id, external_id')

      if (upsertError || !upserted) {
        upsertErrors.push(`Upsert ${chain}: ${upsertError?.message}`)
        continue
      }

      upsertedProducts += upserted.length

      // Map external_id → product id
      const idByExternalId = new Map(upserted.map(p => [p.external_id, p.id]))

      // Insert price_snapshots (append-only)
      const snapshotRows = batch
        .filter(p => idByExternalId.has(p.externalId))
        .map(p => ({
          product_id: idByExternalId.get(p.externalId)!,
          amount: p.price.amount,
          currency: p.price.currency,
          on_sale: false,
          scraped_at: p.scrapedAt.toISOString(),
        }))

      const { error: snapshotError } = await supabase
        .from('price_snapshots')
        .insert(snapshotRows)

      if (snapshotError) {
        upsertErrors.push(`Snapshots ${chain}: ${snapshotError.message}`)
      } else {
        insertedSnapshots += snapshotRows.length
      }
    }
  }

  // 4. Invalider le cache ISR
  revalidateTag('prices')

  return NextResponse.json({
    success: true,
    upsertedProducts,
    insertedSnapshots,
    scrapeResults,
    errors: upsertErrors.length > 0 ? upsertErrors : undefined,
    durationMs: Date.now() - startedAt,
  })
}

function groupByChain(products: NormalizedProduct[]): Map<StoreChain, NormalizedProduct[]> {
  const map = new Map<StoreChain, NormalizedProduct[]>()
  for (const p of products) {
    const existing = map.get(p.storeChain) ?? []
    existing.push(p)
    map.set(p.storeChain, existing)
  }
  return map
}

function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
