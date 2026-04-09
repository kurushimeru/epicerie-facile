import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProductWithPrice } from '@/types'
import type { StoreChain, CurrencyCode } from '@/types/database'

type ProductRow = {
  id: string
  store_id: string
  external_id: string
  name: string
  image_url: string | null
  product_url: string
  unit: string | null
  category: string | null
  stores: {
    chain: string
    name: string
  } | null
  current_prices: {
    amount: number
    original_amount: number | null
    currency: string
    on_sale: boolean
    scraped_at: string
  }[] | null
}

async function _fetchProducts(): Promise<ProductWithPrice[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      store_id,
      external_id,
      name,
      image_url,
      product_url,
      unit,
      category,
      stores ( chain, name ),
      current_prices ( amount, original_amount, currency, on_sale, scraped_at )
    `)
    .limit(300)

  if (error || !data) {
    console.error('[fetchProducts]', error?.message)
    return []
  }

  return (data as unknown as ProductRow[])
    .filter(p => p.stores && p.current_prices?.length)
    .map(p => ({
      id: p.id,
      storeId: p.store_id,
      storeChain: p.stores!.chain as StoreChain,
      storeName: p.stores!.name,
      externalId: p.external_id,
      name: p.name,
      imageUrl: p.image_url,
      productUrl: p.product_url,
      unit: p.unit,
      category: p.category,
      price: {
        amount: p.current_prices![0].amount,
        currency: p.current_prices![0].currency as CurrencyCode,
      },
      originalPrice: p.current_prices![0].original_amount !== null
        ? { amount: p.current_prices![0].original_amount!, currency: p.current_prices![0].currency as CurrencyCode }
        : null,
      onSale: p.current_prices![0].on_sale,
      scrapedAt: p.current_prices![0].scraped_at,
    }))
}

// ISR — invalidé par revalidateTag('prices') dans le cron
export const fetchProducts = unstable_cache(
  _fetchProducts,
  ['products-with-prices'],
  { tags: ['prices'], revalidate: 3600 }
)
