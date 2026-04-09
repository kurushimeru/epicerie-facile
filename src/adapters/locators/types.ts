import type { StoreChain } from '@/types/database'

export interface NormalizedStoreLocation {
  /** Identifiant unique chez la chaîne — pour déduplication */
  externalId: string
  chain: StoreChain
  /** Nom du magasin (ex: "IGA Extra Marché Richelieu") */
  name: string
  address: string
  city: string
  province: string
  country: string
  postalCode: string
  latitude: number
  longitude: number
  phone?: string
  /** { "lun": "8h-22h", "mar": "8h-22h", ... } */
  hours?: Record<string, string>
}

export interface StoreLocatorAdapter {
  readonly chain: StoreChain
  /**
   * Fetch tous les magasins dans un rayon autour d'un point.
   * L'orchestrateur itère sur une grille de points couvrant le Québec.
   */
  fetchNear(lat: number, lng: number, radiusKm: number, signal?: AbortSignal): Promise<NormalizedStoreLocation[]>
}

/** Points de la grille couvrant le Québec habité (~200km de rayon max entre villes) */
export const QUEBEC_GRID: { lat: number; lng: number; label: string }[] = [
  // Grand Montréal / Rive-Sud / Lanaudière / Laurentides
  { lat: 45.5017, lng: -73.5673, label: 'Montréal' },
  { lat: 45.6066, lng: -73.7124, label: 'Laval' },
  { lat: 45.5315, lng: -73.4685, label: 'Longueuil' },
  { lat: 45.7000, lng: -73.4700, label: 'Repentigny' },
  { lat: 45.8700, lng: -74.0000, label: 'Saint-Jérôme' },
  { lat: 45.3073, lng: -73.2642, label: 'Saint-Jean-sur-Richelieu' },
  { lat: 45.4013, lng: -72.7274, label: 'Granby' },
  { lat: 45.4100, lng: -73.9500, label: 'Vaudreuil-Dorion' },
  // Québec / Chaudière-Appalaches
  { lat: 46.8139, lng: -71.2080, label: 'Québec' },
  { lat: 46.7089, lng: -71.1884, label: 'Lévis' },
  { lat: 46.6700, lng: -70.9900, label: 'Beaumont' },
  { lat: 46.9000, lng: -71.5000, label: 'Portneuf' },
  // Estrie / Centre-du-Québec
  { lat: 45.4042, lng: -71.8929, label: 'Sherbrooke' },
  { lat: 45.8833, lng: -72.4833, label: 'Drummondville' },
  { lat: 46.0550, lng: -72.9100, label: 'Victoriaville' },
  { lat: 45.6182, lng: -72.9563, label: 'Saint-Hyacinthe' },
  // Outaouais / Abitibi
  { lat: 45.4765, lng: -75.7013, label: 'Gatineau' },
  { lat: 48.2390, lng: -79.0188, label: 'Rouyn-Noranda' },
  { lat: 48.0970, lng: -77.7837, label: "Val-d'Or" },
  { lat: 48.5200, lng: -78.1200, label: 'Amos' },
  // Mauricie / Saguenay-Lac-Saint-Jean
  { lat: 46.3432, lng: -72.5429, label: 'Trois-Rivières' },
  { lat: 46.5439, lng: -72.7214, label: 'Shawinigan' },
  { lat: 48.4284, lng: -71.0537, label: 'Saguenay' },
  { lat: 48.5300, lng: -71.6400, label: 'Alma' },
  { lat: 48.8500, lng: -72.3100, label: 'Dolbeau-Mistassini' },
  // Bas-Saint-Laurent / Gaspésie
  { lat: 48.4488, lng: -68.5251, label: 'Rimouski' },
  { lat: 48.2800, lng: -67.5400, label: 'Matane' },
  { lat: 48.8339, lng: -64.4873, label: 'Gaspé' },
  { lat: 47.6200, lng: -69.8700, label: 'Rivière-du-Loup' },
  // Côte-Nord
  { lat: 50.2178, lng: -66.3812, label: 'Sept-Îles' },
  { lat: 49.2250, lng: -68.1550, label: 'Baie-Comeau' },
]
