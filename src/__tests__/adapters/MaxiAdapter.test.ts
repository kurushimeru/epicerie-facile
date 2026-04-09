import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MaxiAdapter } from '@/adapters/MaxiAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ flyer_items: items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, name: 'Poulet entier', price: 8.99, sale_price: 6.99,
  brand: null, image_url: null, large_image_url: null,
  description: null, unit: 'kg', price_text: null, sale_story: null,
  flyer_page_number: 1, merchant_id: 300, merchant_name: 'Maxi',
  flyer_id: 777, cutout_image_url: null, category: 'Viandes',
  ...overrides,
})

describe('MaxiAdapter', () => {
  let adapter: MaxiAdapter

  beforeEach(() => { vi.useFakeTimers(); adapter = new MaxiAdapter() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('retourne les produits Maxi avec sale_price prioritaire', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([makeItem()])))
    const promise = adapter.search('viande')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results[0]).toMatchObject({ storeChain: 'MAXI', price: { amount: 6.99 } })
  })

  it('filtre les non-Maxi', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([
      makeItem({ id: 1, merchant_name: 'Maxi' }),
      makeItem({ id: 2, merchant_name: 'Super C' }),
    ])))
    const promise = adapter.search('viande')
    await vi.runAllTimersAsync()
    expect(await promise).toHaveLength(1)
  })
})
