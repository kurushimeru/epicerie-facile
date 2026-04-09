import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MaxiAdapter } from '@/adapters/MaxiAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, flyer_item_id: 1, flyer_id: 777,
  name: 'Poulet entier', current_price: 6.99, original_price: 8.99,
  pre_price_text: null, post_price_text: null, sale_story: null,
  clean_image_url: null, clipping_image_url: null,
  merchant_id: 300, merchant_name: 'Maxi', merchant_logo: null,
  _L1: 'Food', _L2: 'Meat', valid_from: null, valid_to: null,
  item_type: 'flyer',
  ...overrides,
})

describe('MaxiAdapter', () => {
  let adapter: MaxiAdapter

  beforeEach(() => { vi.useFakeTimers(); adapter = new MaxiAdapter() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('retourne les produits Maxi avec current_price', async () => {
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
