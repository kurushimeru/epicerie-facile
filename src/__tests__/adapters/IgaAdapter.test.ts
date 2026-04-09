import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IgaAdapter } from '@/adapters/IgaAdapter'
import type { FlippSearchResponse } from '@/adapters/flipp/types'

const mockResponse = (items: FlippSearchResponse['items']) =>
  new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1,
  flyer_item_id: 1,
  flyer_id: 999,
  name: 'Lait 2% 4L',
  current_price: 5.99,
  original_price: null,
  pre_price_text: null,
  post_price_text: null,
  sale_story: null,
  clean_image_url: 'https://f.wishabi.net/lait.jpg',
  clipping_image_url: null,
  merchant_id: 100,
  merchant_name: 'IGA',
  merchant_logo: null,
  _L1: 'Food, Beverages & Tobacco',
  _L2: 'Dairy',
  valid_from: null,
  valid_to: null,
  item_type: 'flyer',
  ...overrides,
})

describe('IgaAdapter', () => {
  let adapter: IgaAdapter

  beforeEach(() => {
    vi.useFakeTimers()
    adapter = new IgaAdapter()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('retourne les produits IGA normalisés', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse([makeItem()])))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      externalId: '1',
      storeChain: 'IGA',
      name: 'Lait 2% 4L',
      price: { amount: 5.99, currency: 'CAD' },
    })
  })

  it('filtre les produits non-IGA', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([
        makeItem({ id: 1, merchant_name: 'IGA' }),
        makeItem({ id: 2, merchant_name: 'Metro' }),
        makeItem({ id: 3, merchant_name: 'IGA Extra' }),
      ])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toHaveLength(2)
    expect(results.map(r => r.externalId)).toEqual(['1', '3'])
  })

  it('utilise current_price, fallback original_price', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ current_price: null, original_price: 6.99 })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results[0].price.amount).toBe(6.99)
  })

  it('déduplique par externalId', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ id: 1 }), makeItem({ id: 1 })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toHaveLength(1)
  })

  it('ignore les items sans nom', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ name: null })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })

  it('retourne [] si fetch échoue', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })

  it('retourne [] si réponse non-JSON (HTML)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('<html>blocked</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })

  it('ignore les items sans prix', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ current_price: null, original_price: null })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })
})
