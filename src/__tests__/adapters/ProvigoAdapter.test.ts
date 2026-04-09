import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProvigoAdapter } from '@/adapters/ProvigoAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, flyer_item_id: 1, flyer_id: 555,
  name: 'Fromage cheddar', current_price: 12.99, original_price: null,
  pre_price_text: null, post_price_text: null, sale_story: null,
  clean_image_url: null, clipping_image_url: null,
  merchant_id: 500, merchant_name: 'Provigo', merchant_logo: null,
  _L1: 'Food', _L2: 'Dairy', valid_from: null, valid_to: null,
  item_type: 'flyer',
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
    expect(await promise).toHaveLength(1)
  })
})
