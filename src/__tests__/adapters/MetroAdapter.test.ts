import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MetroAdapter } from '@/adapters/MetroAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, flyer_item_id: 1, flyer_id: 888,
  name: 'Pain blanc', current_price: 3.49, original_price: null,
  pre_price_text: null, post_price_text: null, sale_story: null,
  clean_image_url: null, clipping_image_url: null,
  merchant_id: 200, merchant_name: 'Metro', merchant_logo: null,
  _L1: 'Food', _L2: 'Bakery', valid_from: null, valid_to: null,
  item_type: 'flyer',
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
    expect(results[0]).toMatchObject({ storeChain: 'METRO', name: 'Pain blanc', price: { amount: 3.49 } })
  })

  it('accepte Metro Plus', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([
      makeItem({ id: 1, merchant_name: 'Metro Plus' }),
      makeItem({ id: 2, merchant_name: 'IGA' }),
    ])))
    const promise = adapter.search('pain')
    await vi.runAllTimersAsync()
    expect(await promise).toHaveLength(1)
  })

  it('retourne [] si fetch échoue', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const promise = adapter.search('pain')
    await vi.runAllTimersAsync()
    expect(await promise).toEqual([])
  })
})
