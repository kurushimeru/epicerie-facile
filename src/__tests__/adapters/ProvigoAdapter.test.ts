import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProvigoAdapter } from '@/adapters/ProvigoAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ flyer_items: items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, name: 'Fromage cheddar', price: 12.99, sale_price: null,
  brand: 'Black Diamond', image_url: null, large_image_url: null,
  description: null, unit: '400g', price_text: null, sale_story: null,
  flyer_page_number: 1, merchant_id: 500, merchant_name: 'Provigo',
  flyer_id: 555, cutout_image_url: null, category: 'Fromagerie',
  ...overrides,
})

describe('ProvigoAdapter', () => {
  let adapter: ProvigoAdapter

  beforeEach(() => { vi.useFakeTimers(); adapter = new ProvigoAdapter() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('retourne les produits Provigo normalisés', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([makeItem()])))
    const promise = adapter.search('épicerie')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results[0]).toMatchObject({ storeChain: 'PROVIGO', name: 'Fromage cheddar' })
  })

  it('accepte Provigo Le Marché', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([
      makeItem({ id: 1, merchant_name: 'Provigo Le Marché' }),
      makeItem({ id: 2, merchant_name: 'Maxi' }),
    ])))
    const promise = adapter.search('épicerie')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results).toHaveLength(1)
  })
})
