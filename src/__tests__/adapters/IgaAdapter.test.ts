import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IgaAdapter } from '@/adapters/IgaAdapter'
import type { FlippSearchResponse } from '@/adapters/flipp/types'

const mockResponse = (items: FlippSearchResponse['flyer_items']) =>
  new Response(JSON.stringify({ flyer_items: items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1,
  name: 'Lait 2% 4L',
  price: 5.99,
  sale_price: null,
  brand: 'Natrel',
  image_url: 'https://example.com/lait.jpg',
  large_image_url: null,
  description: null,
  unit: '4L',
  price_text: null,
  sale_story: null,
  flyer_page_number: 1,
  merchant_id: 100,
  merchant_name: 'IGA',
  flyer_id: 999,
  cutout_image_url: null,
  category: 'Produits laitiers',
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
      unit: '4L',
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

  it('utilise sale_price si disponible', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ price: 7.99, sale_price: 5.49 })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results[0].price.amount).toBe(5.49)
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

  it('retourne [] si fetch échoue', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })

  it('retourne [] si API retourne 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })

  it('ignore les items sans prix', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      mockResponse([makeItem({ price: null, sale_price: null })])
    ))

    const promise = adapter.search('lait')
    await vi.runAllTimersAsync()
    const results = await promise

    expect(results).toEqual([])
  })
})
