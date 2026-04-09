// Types Flipp API — reverse-engineered depuis flipp.com
// Peut nécessiter des ajustements si l'API change

export interface FlippItem {
  id: number
  name: string
  price: number | null
  sale_price: number | null
  brand: string | null
  image_url: string | null
  large_image_url: string | null
  description: string | null
  unit: string | null
  price_text: string | null
  sale_story: string | null
  flyer_page_number: number | null
  merchant_id: number
  merchant_name: string
  flyer_id: number
  cutout_image_url: string | null
  category: string | null
}

export interface FlippSearchResponse {
  flyer_items?: FlippItem[]
  items?: FlippItem[]
}

export interface FlippClientOptions {
  /** Postal code québécois pour les résultats géolocalisés. Défaut : H2X1Y1 (Montréal centre) */
  postalCode?: string
  locale?: 'fr-CA' | 'en-CA'
  timeoutMs?: number
}
