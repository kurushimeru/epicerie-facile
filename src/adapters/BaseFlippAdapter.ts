// Classe de base pour tous les adapteurs Flipp
// Chaque sous-classe définit uniquement : chain, merchantNames, searchTerms

import { FlippClient } from './flipp/FlippClient'
import type { FlippClientOptions } from './flipp/types'
import type { NormalizedProduct, StoreAdapter } from '@/types'
import type { StoreChain } from '@/types/database'

const DEFAULT_SEARCH_TERMS = [
  'lait', 'pain', 'viande', 'légumes', 'fruits',
  'épicerie', 'boisson',
]

export abstract class BaseFlippAdapter implements StoreAdapter {
  abstract readonly chain: StoreChain
  /** Noms de marchands tels qu'ils apparaissent dans les réponses Flipp */
  abstract readonly merchantNames: string[]
  protected readonly searchTerms: string[] = DEFAULT_SEARCH_TERMS

  private readonly client: FlippClient

  constructor(options: FlippClientOptions = {}) {
    this.client = new FlippClient(options)
  }

  async search(term: string, signal?: AbortSignal): Promise<NormalizedProduct[]> {
    const items = await this.client.search(term, signal).catch(err => {
      console.warn(`[${this.chain}] Flipp inaccessible pour "${term}":`, err)
      return []
    })

    const filtered = this.client.filterByMerchant(items, this.merchantNames)
    const seen = new Set<string>()
    const results: NormalizedProduct[] = []

    for (const item of filtered) {
      if (!item.name) continue
      const id = String(item.id)
      if (seen.has(id)) continue
      seen.add(id)

      const price = this.client.resolvePrice(item)
      if (price === null) continue

      const originalPrice = item.original_price !== null && item.original_price !== undefined && item.original_price > price
        ? { amount: item.original_price, currency: 'CAD' as const }
        : undefined

      results.push({
        externalId: id,
        storeChain: this.chain,
        name: item.name,
        price: { amount: price, currency: 'CAD' },
        originalPrice,
        imageUrl: item.clean_image_url ?? undefined,
        productUrl: `https://flipp.com/flyers/${item.flyer_id}`,
        scrapedAt: new Date(),
      })
    }

    return results
  }

  /** Recherche multi-termes avec déduplication globale — utilisé par l'orchestrateur */
  async searchAll(signal?: AbortSignal): Promise<NormalizedProduct[]> {
    const seen = new Set<string>()
    const all: NormalizedProduct[] = []

    for (const term of this.searchTerms) {
      const results = await this.search(term, signal)
      for (const product of results) {
        if (!seen.has(product.externalId)) {
          seen.add(product.externalId)
          all.push(product)
        }
      }
    }

    return all
  }
}
