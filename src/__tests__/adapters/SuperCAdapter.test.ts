import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SuperCAdapter } from '@/adapters/SuperCAdapter'

const mockResponse = (items: object[]) =>
  new Response(JSON.stringify({ flyer_items: items }), {
    headers: { 'Content-Type': 'application/json' },
  })

const makeItem = (overrides = {}) => ({
  id: 1, name: 'Bananes', price: 1.49, sale_price: null,
  brand: null, image_url: null, large_image_url: null,
  description: null, unit: 'kg', price_text: null, sale_story: null,
  flyer_page_number: 1, merchant_id: 400, merchant_name: 'Super C',
  flyer_id: 666, cutout_image_url: null, category: 'Fruits',
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
