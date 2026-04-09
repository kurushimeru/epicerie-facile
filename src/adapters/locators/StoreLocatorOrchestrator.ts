import { fetchAllQuebecStores } from './OverpassLocatorAdapter'
import type { NormalizedStoreLocation } from './types'

export interface SyncResult {
  stores: NormalizedStoreLocation[]
  rawCount: number
}

export async function syncAllStores(signal?: AbortSignal): Promise<SyncResult> {
  const stores = await fetchAllQuebecStores(signal)

  // Déduplication par externalId (au cas où Overpass retourne des doublons)
  const seen = new Set<string>()
  const unique: NormalizedStoreLocation[] = []
  for (const s of stores) {
    if (!seen.has(s.externalId)) {
      seen.add(s.externalId)
      unique.push(s)
    }
  }

  console.log(`[StoreSync] ${unique.length} unique stores (${stores.length} raw)`)
  return { stores: unique, rawCount: stores.length }
}
