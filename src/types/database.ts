// Types générés manuellement depuis supabase/migrations/20260408000001_init.sql
// Pour regénérer automatiquement : npx supabase gen types typescript --linked > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type StoreChain =
  | 'IGA' | 'METRO' | 'MAXI' | 'SUPER_C' | 'PROVIGO'
  | 'WALMART' | 'COSTCO' | 'GIANT_TIGER' | 'ADONIS'
  | 'AVRIL' | 'RACHELLE_BERY' | 'INTERMARCHE' | 'BONI_CHOIX'
  | 'MERCADONA' | 'SORIANA'
export type CurrencyCode = 'CAD' | 'USD' | 'EUR' | 'MXN'
export type ConsentType = 'essential' | 'analytics' | 'marketing'
export type ConsentAction = 'granted' | 'revoked'
export type UserTier = 'free' | 'premium'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          email: string
          tier: UserTier
          locale: string
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          auth_id: string
          email: string
          tier?: UserTier
          locale?: string
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          tier?: UserTier
          locale?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          id: string
          chain: StoreChain
          name: string
          website: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chain: StoreChain
          name: string
          website?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      store_locations: {
        Row: {
          id: string
          store_id: string
          external_id: string
          name: string
          address: string
          city: string
          province: string
          country: string
          postal_code: string
          latitude: number
          longitude: number
          phone: string | null
          hours: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          external_id: string
          name: string
          address?: string
          city?: string
          province?: string
          country?: string
          postal_code?: string
          latitude: number
          longitude: number
          phone?: string | null
          hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          address?: string
          city?: string
          province?: string
          postal_code?: string
          latitude?: number
          longitude?: number
          phone?: string | null
          hours?: Json | null
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'store_locations_store_id_fkey'; columns: ['store_id']; referencedRelation: 'stores'; referencedColumns: ['id'] }
        ]
      }
      products: {
        Row: {
          id: string
          store_id: string
          external_id: string
          name: string
          image_url: string | null
          product_url: string
          unit: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          external_id: string
          name: string
          image_url?: string | null
          product_url: string
          unit?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          image_url?: string | null
          product_url?: string
          unit?: string | null
          category?: string | null
        }
        Relationships: [
          { foreignKeyName: 'products_store_id_fkey'; columns: ['store_id']; referencedRelation: 'stores'; referencedColumns: ['id'] }
        ]
      }
      price_snapshots: {
        Row: {
          id: string
          product_id: string
          amount: number
          original_amount: number | null
          currency: CurrencyCode
          on_sale: boolean
          scraped_at: string
        }
        Insert: {
          id?: string
          product_id: string
          amount: number
          original_amount?: number | null
          currency?: CurrencyCode
          on_sale?: boolean
          scraped_at?: string
        }
        Update: Record<string, never>  // append-only
        Relationships: [
          { foreignKeyName: 'price_snapshots_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          target_price: number | null
          notified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          target_price?: number | null
          notified_at?: string | null
          created_at?: string
        }
        Update: {
          target_price?: number | null
          notified_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'watchlists_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'watchlists_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      outbound_clicks: {
        Row: {
          id: string
          user_id: string | null
          product_id: string
          store_id: string
          referrer: string | null
          user_agent: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id: string
          store_id: string
          referrer?: string | null
          user_agent?: string | null
          clicked_at?: string
        }
        Update: Record<string, never>  // append-only
        Relationships: [
          { foreignKeyName: 'outbound_clicks_product_id_fkey'; columns: ['product_id']; referencedRelation: 'products'; referencedColumns: ['id'] },
          { foreignKeyName: 'outbound_clicks_store_id_fkey'; columns: ['store_id']; referencedRelation: 'stores'; referencedColumns: ['id'] }
        ]
      }
      legal_consents: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          consent_type: ConsentType
          action: ConsentAction
          ip_hash: string | null
          user_agent: string | null
          consented_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          consent_type: ConsentType
          action: ConsentAction
          ip_hash?: string | null
          user_agent?: string | null
          consented_at?: string
        }
        Update: Record<string, never>  // append-only
        Relationships: [
          { foreignKeyName: 'legal_consents_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
    }
    Views: {
      current_prices: {
        Row: {
          product_id: string
          amount: number
          original_amount: number | null
          currency: CurrencyCode
          on_sale: boolean
          scraped_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      stores_within_radius: {
        Args: { lat: number; lng: number; radius_meters: number }
        Returns: {
          location_id: string
          store_id: string
          chain: StoreChain
          name: string
          address: string
          city: string
          distance_meters: number
        }[]
      }
    }
    Enums: {
      store_chain: StoreChain
      currency_code: CurrencyCode
      consent_type: ConsentType
      consent_action: ConsentAction
      user_tier: UserTier
    }
    CompositeTypes: Record<string, never>
  }
}
