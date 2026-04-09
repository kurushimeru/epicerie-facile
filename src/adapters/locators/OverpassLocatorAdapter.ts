import type { NormalizedStoreLocation } from './types'
import { detectChain } from './detectChain'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const FALLBACK_URL = 'https://overpass.kumi.systems/api/interpreter'

// Québec habité : du 45e parallèle (frontière US) jusqu'au 52e (nord de la Côte-Nord)
// Longitude : de l'Outaouais (-79.5) à la Gaspésie (-57.0)
const QUEBEC_BBOX = '45.0,-79.5,52.0,-57.0'

interface OverpassElement {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

interface OverpassResponse {
  elements: OverpassElement[]
}

// Une seule requête couvre tout le Québec habité
const QUEBEC_QUERY = `[out:json][timeout:120];
(
  node["shop"="supermarket"](${QUEBEC_BBOX});
  way["shop"="supermarket"](${QUEBEC_BBOX});
  node["shop"="grocery"](${QUEBEC_BBOX});
  way["shop"="grocery"](${QUEBEC_BBOX});
);
out center tags;`

function shouldFallback(res: Response | null): boolean {
  if (!res) return true
  if (res.status >= 500 || res.status === 429) return true
  const ct = res.headers.get('content-type') ?? ''
  if (!ct.includes('json')) return true
  return false
}

async function tryFetch(url: string, signal?: AbortSignal): Promise<Response | null> {
  const perRequest = AbortSignal.timeout(130_000)
  const combined = signal ? AbortSignal.any([signal, perRequest]) : perRequest
  return fetch(url, {
    method: 'POST',
    body: new URLSearchParams({ data: QUEBEC_QUERY }),
    headers: { 'User-Agent': 'EpiceriesFaciles/1.0 (+https://epiceriesfaciles.com/robots)' },
    signal: combined,
  }).catch(() => null)
}

export async function fetchAllQuebecStores(signal?: AbortSignal): Promise<NormalizedStoreLocation[]> {
  let res = await tryFetch(OVERPASS_URL, signal)

  if (shouldFallback(res)) {
    console.log('[Overpass] Primary failed, trying fallback...')
    res = await tryFetch(FALLBACK_URL, signal)
  }

  if (!res) throw new Error('Overpass unreachable (primary + fallback)')
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('json')) throw new Error('Overpass returned non-JSON')

  const data: OverpassResponse = await res.json()
  const elements = data.elements ?? []

  return elements
    .map(normalize)
    .filter((s): s is NormalizedStoreLocation => s !== null)
}

function normalize(el: OverpassElement): NormalizedStoreLocation | null {
  const tags = el.tags ?? {}
  const chain = detectChain(tags)
  if (!chain) return null

  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  if (!lat || !lon) return null

  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ')

  return {
    externalId: `osm:${el.type}:${el.id}`,
    chain,
    name: tags.name ?? tags.brand ?? chain,
    address: street,
    city: tags['addr:city'] ?? '',
    province: tags['addr:province'] ?? tags['addr:state'] ?? 'QC',
    country: 'CA',
    postalCode: tags['addr:postcode'] ?? '',
    latitude: lat,
    longitude: lon,
    phone: tags.phone ?? tags['contact:phone'],
    hours: tags.opening_hours ? { raw: tags.opening_hours } : undefined,
  }
}
