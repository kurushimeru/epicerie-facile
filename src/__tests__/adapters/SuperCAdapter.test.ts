import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SuperCAdapter } from '@/adapters/SuperCAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, flyer_item_id: 1, flyer_id: 666,
  name: 'Bananes', current_price: 1.49, original_price: null,
  pre_price_text: null, post_price_text: null, sale_story: null,
  clean_image_url: null, clipping_image_url: null,
  merchant_id: 400, merchant_name: 'Super C', merchant_logo: null,
  _L1: 'Food', _L2: 'Produce', valid_from: null, valid_to: null,
  item_type: 'flyer',
  ...overrides,
})

describe('SuperCAdapter', () => {
  let adapter: SuperCAdapter

  beforeEach(() => { vi.useFakeTimers(); adapter = new SuperCAdapter() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('retourne les produits Super C normalisés', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([makeItem()])))
    const promise = adapter.search('fruits')
    await vi.runAllTimersAsync()
    const results = await promise
    expect(results[0]).toMatchObject({ storeChain: 'SUPER_C', name: 'Bananes' })
  })

  it('retourne [] si réponse 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })))
    const promise = adapter.search('fruits')
    await vi.runAllTimersAsync()
    expect(await promise).toEqual([])
  })
})
