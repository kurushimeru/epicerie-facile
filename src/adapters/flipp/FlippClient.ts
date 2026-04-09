import type { FlippItem, FlippSearchResponse, FlippClientOptions } from './types'

const FLIPP_SEARCH_URL = 'https://flipp.com/flyerItems/search.json'
const DEFAULT_POSTAL_CODE = 'H2X1Y1'  // Montréal centre — flipp retourne les résultats provinciaux
const DEFAULT_TIMEOUT_MS = 10_000
const RATE_LIMIT_MS = 1_000  // 1 req/s

const USER_AGENT = 'EpiceriesFaciles/1.0 (+https://epiceriesfaciles.com/robots)'

export class FlippClient {
  private readonly postalCode: string
  private readonly locale: string
  private readonly timeoutMs: number
  private lastRequestAt = 0

  constructor(options: FlippClientOptions = {}) {
    this.postalCode = options.postalCode ?? DEFAULT_POSTAL_CODE
    this.locale = options.locale ?? 'fr-CA'
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  }

  async search(term: string, signal?: AbortSignal): Promise<FlippItem[]> {
    await this.rateLimit()

    const url = new URL(FLIPP_SEARCH_URL)
    url.searchParams.set('q', term)
    url.searchParams.set('locale', this.locale)
    url.searchParams.set('postal_code', this.postalCode)

    const timeoutSignal = AbortSignal.timeout(this.timeoutMs)
    const combinedSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
        'Accept-Language': this.locale,
      },
      signal: combinedSignal,
    })

    if (!res.ok) {
      console.warn(`[FlippClient] ${res.status} pour "${term}"`)
      return []
    }

    const data: FlippSearchResponse = await res.json()
    return data.flyer_items ?? data.items ?? []
  }

  /** Filtre les items par noms de marchands (insensible à la casse, substring match) */
  filterByMerchant(items: FlippItem[], merchantNames: string[]): FlippItem[] {
    const lower = merchantNames.map(n => n.toLowerCase())
    return items.filter(item =>
      lower.some(n => item.merchant_name.toLowerCase().includes(n))
    )
  }

  /** Extraire le prix effectif (sale_price prioritaire) */
  resolvePrice(item: FlippItem): number | null {
    return item.sale_price ?? item.price
  }

  private async rateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt
    if (elapsed < RATE_LIMIT_MS) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - elapsed))
    }
    this.lastRequestAt = Date.now()
  }
}
