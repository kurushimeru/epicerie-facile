// Types métier — couche applicative
// Dérivés des types Database mais adaptés à l'UI et aux adapteurs

import type {
  Database,
  StoreChain,
  CurrencyCode,
  UserTier,
} from './database'

// Raccourcis sur les Row types
export type UserRow = Database['public']['Tables']['users']['Row']
export type StoreRow = Database['public']['Tables']['stores']['Row']
export type StoreLocationRow = Database['public']['Tables']['store_locations']['Row']
export type ProductRow = Database['public']['Tables']['products']['Row']
export type PriceSnapshotRow = Database['public']['Tables']['price_snapshots']['Row']
export type WatchlistRow = Database['public']['Tables']['watchlists']['Row']
export type CurrentPriceRow = Database['public']['Views']['current_prices']['Row']

// Re-exports pratiques
export type { StoreChain, CurrencyCode, UserTier }

// ============================================================
// MONEY
// ============================================================

export interface Money {
  amount: number
  currency: CurrencyCode
}

// ============================================================
// ADAPTER — Interface Plug & Play
// ============================================================

export interface NormalizedProduct {
  externalId: string
  storeChain: StoreChain
  name: string
  price: Money
  unit?: string
  imageUrl?: string
  productUrl: string
  scrapedAt: Date
}

export interface StoreAdapter {
  readonly chain: StoreChain
  search(term: string, signal?: AbortSignal): Promise<NormalizedProduct[]>
}

// ============================================================
// UI — Produit enrichi (produit + prix courant + store)
// ============================================================

export interface ProductWithPrice {
  id: string
  storeId: string
  storeChain: StoreChain
  storeName: string
  externalId: string
  name: string
  imageUrl: string | null
  productUrl: string
  unit: string | null
  category: string | null
  price: Money
  onSale: boolean
  scrapedAt: string
}

// ============================================================
// UI — Store avec distance (résultat PostGIS)
// ============================================================

export interface NearbyStore {
  locationId: string
  storeId: string
  chain: StoreChain
  name: string
  address: string
  city: string
  distanceMeters: number
}

// ============================================================
// WATCHLIST enrichie
// ============================================================

export interface WatchlistItem {
  id: string
  product: ProductWithPrice
  targetPrice: number | null
  notifiedAt: string | null
  createdAt: string
}
