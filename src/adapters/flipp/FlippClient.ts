import type { FlippItem, FlippSearchResponse, FlippClientOptions } from './types'

const FLIPP_SEARCH_URL = 'https://backflipp.wishabi.com/flipp/items/search'
const DEFAULT_POSTAL_CODE = 'H2X1Y1'
const DEFAULT_TIMEOUT_MS = 10_000
const RATE_LIMIT_MS = 1_000

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

    let res: Response
    try {
      res = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': this.locale,
          'Referer': 'https://flipp.com/',
          'Origin': 'https://flipp.com',
        },
        signal: combinedSignal,
      })
    } catch (err) {
      console.warn(`[FlippClient] fetch échoué pour "${term}":`, err)
      return []
    }

    if (!res.ok) {
      console.warn(`[FlippClient] ${res.status} pour "${term}"`)
      return []
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      const preview = await res.text().then(t => t.slice(0, 120))
      console.warn(`[FlippClient] Réponse non-JSON pour "${term}": ${preview}`)
      return []
    }

    const data: FlippSearchResponse = await res.json()
    return data.items ?? []
  }

  filterByMerchant(items: FlippItem[], merchantNames: string[]): FlippItem[] {
    const lower = merchantNames.map(n => n.toLowerCase())
    return items.filter(item =>
      lower.some(n => item.merchant_name.toLowerCase().includes(n))
    )
  }

  /** Retourne le prix effectif — current_price en promo, original_price sinon */
  resolvePrice(item: FlippItem): number | null {
    return item.current_price ?? item.original_price
  }

  private async rateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt
    if (elapsed < RATE_LIMIT_MS) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - elapsed))
    }
    this.lastRequestAt = Date.now()
  }
}
