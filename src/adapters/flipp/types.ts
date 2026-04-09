// Types Flipp API — backflipp.wishabi.com/flipp/items/search
// Champ `items` = flyer items (circulaires papier numérisés)

export interface FlippItem {
  id: number
  flyer_item_id: number
  flyer_id: number
  name: string | null
  current_price: number | null
  original_price: number | null
  pre_price_text: string | null
  post_price_text: string | null
  sale_story: string | null
  clean_image_url: string | null
  clipping_image_url: string | null
  merchant_id: number
  merchant_name: string
  merchant_logo: string | null
  _L1: string | null   // catégorie niveau 1 (ex: "Food, Beverages & Tobacco")
  _L2: string | null   // catégorie niveau 2 (ex: "Beverages")
  valid_from: string | null
  valid_to: string | null
  item_type: string
}

export interface FlippSearchResponse {
  items?: FlippItem[]
  ecom_items?: unknown[]  // e-commerce — ignoré
}

export interface FlippClientOptions {
  /** Code postal québécois. Défaut : H2X1Y1 (Montréal centre) */
  postalCode?: string
  locale?: 'fr-CA' | 'en-CA'
  timeoutMs?: number
}
