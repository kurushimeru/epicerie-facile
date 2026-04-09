import type { StoreAdapter, NormalizedProduct } from '@/types'
import { IgaAdapter } from './IgaAdapter'
import { MetroAdapter } from './MetroAdapter'
import { MaxiAdapter } from './MaxiAdapter'
import { SuperCAdapter } from './SuperCAdapter'
import { ProvigoAdapter } from './ProvigoAdapter'
import { WalmartAdapter } from './WalmartAdapter'

// Ajouter un nouvel adapteur ici uniquement
const ADAPTERS: StoreAdapter[] = [
  new IgaAdapter(),
  new MetroAdapter(),
  new MaxiAdapter(),
  new SuperCAdapter(),
  new ProvigoAdapter(),
  new WalmartAdapter(),
]

export interface ScrapeResult {
  chain: string
  count: number
  durationMs: number
  error?: string
}

export async function scrapeAll(signal?: AbortSignal): Promise<{
  products: NormalizedProduct[]
  results: ScrapeResult[]
}> {
  const products: NormalizedProduct[] = []
  const results: ScrapeResult[] = []

  for (const adapter of ADAPTERS) {
    const start = Date.now()
    try {
      // BaseFlippAdapter expose searchAll(), StoreAdapter expose search()
      const items = 'searchAll' in adapter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? await (adapter as any).searchAll(signal)
        : await adapter.search('épicerie', signal)

      products.push(...items)
      results.push({ chain: adapter.chain, count: items.length, durationMs: Date.now() - start })
    } catch (err) {
      results.push({
        chain: adapter.chain,
        count: 0,
        durationMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return { products, results }
}
