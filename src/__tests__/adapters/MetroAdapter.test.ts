import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MetroAdapter } from '@/adapters/MetroAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ flyer_items: items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, name: 'Pain blanc', price: 3.49, sale_price: null,
  brand: 'Gadoua', image_url: null, large_image_url: null,
  description: null, unit: '675g', price_text: null, sale_story: null,
  flyer_page_number: 1, merchant_id: 200, merchant_name: 'Metro',
  flyer_id: 888, cutout_image_url: null, category: 'Boulangerie',
  ...overrides,
})

describe('MetroAdapter', () => {
  let adapter: MetroAdapter

  beforeEach(() => { vi.useFakeTimers(); adapter = new MetroAdapter() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('retourne les produits Metro normalisés', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([makeItem()])))
    const promise = adapter.search('pain')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results[0]).toMatchObject({ storeChain: 'METRO', name: 'Pain blanc', price: { amount: 3.49, currency: 'CAD' } })
  })

  it('accepte Metro Plus', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([
      makeItem({ id: 1, merchant_name: 'Metro Plus' }),
      makeItem({ id: 2, merchant_name: 'IGA' }),
    ])))
    const promise = adapter.search('pain')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results).toHaveLength(1)
    expect(results[0].externalId).toBe('1')
  })

  it('retourne [] si fetch échoue', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const promise = adapter.search('pain')
    await vi.runAllTimersAsync()
    expect(await promise).toEqual([])
  })
})
