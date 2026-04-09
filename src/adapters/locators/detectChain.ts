import type { StoreChain } from '@/types/database'

/** Détecte la chaîne depuis les tags OSM name/brand/operator */
export function detectChain(tags: Record<string, string>): StoreChain | null {
  const haystack = [
    tags.brand ?? '',
    tags.operator ?? '',
    tags.name ?? '',
  ].join(' ').toLowerCase()

  if (/\biga\b/.test(haystack))           return 'IGA'
  if (/\bmetro\b/.test(haystack))         return 'METRO'
  if (/\bmaxi\b/.test(haystack))          return 'MAXI'
  if (/\bsuper[\s-]?c\b/.test(haystack))  return 'SUPER_C'
  if (/\bprovigo\b/.test(haystack))       return 'PROVIGO'
  if (/\bwalmart\b/.test(haystack))       return 'WALMART'
  if (/\bcostco\b/.test(haystack))        return 'COSTCO'
  if (/\bgiant[\s-]?tiger\b/.test(haystack)) return 'GIANT_TIGER'
  if (/\badonis\b/.test(haystack))        return 'ADONIS'
  if (/\bavril\b/.test(haystack))         return 'AVRIL'
  if (/\brachelle[\s-]?b[eé]ry\b/.test(haystack)) return 'RACHELLE_BERY'
  if (/\bintermarch[eé]\b/.test(haystack)) return 'INTERMARCHE'
  if (/\bboni[\s-]?choix\b/.test(haystack)) return 'BONI_CHOIX'

  return null
}
