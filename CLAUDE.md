# CLAUDE.md — Mémoire du Projet Épiceries Faciles

> Cerveau architectural du projet. Mise à jour obligatoire à chaque décision structurante.

## VISION

Hub d'intelligence d'achat québécois. Agrège les prix de plusieurs enseignes, optimise les trajets, génère des alertes. Double monétisation B2C (freemium/premium) + B2B (analytics, affiliation).

---

## STACK TECHNIQUE

| Couche | Choix | Raison |
|---|---|---|
| Framework | Next.js 15 App Router | ISR, Server Components, Route Handlers |
| Language | TypeScript strict | Sécurité typage prix/devises |
| Styles | Tailwind CSS v4 | Déjà en place |
| UI | shadcn/ui + Radix | Déjà en place |
| Base de données | Supabase (Postgres + PostGIS) | Auth + géoloc + RLS |
| Tests | Vitest | Logique métier + adapteurs |
| Déploiement | Vercel | Cron jobs natifs, ISR |
| i18n | next-intl | FR, EN, ES |
| Email | Resend (prévu Phase 1) | Alertes de prix |
| Paiement | Stripe (prévu Phase 2) | Abonnement Premium |

---

## ARCHITECTURE HAUT NIVEAU

```
Cron Vercel (toutes les heures)
  └─► ScraperOrchestrator
        └─► [IgaAdapter, MetroAdapter, MaxiAdapter, ...]
              └─► normalize(RawProduct) → NormalizedProduct
                    └─► upsert price_snapshots (Supabase)
                          └─► revalidateTag('prices') → ISR refresh

Client Next.js
  ├─ Server Components → Supabase direct (cache ISR)
  ├─ /api/click → outbound_clicks (tracking B2B)
  └─ /api/consent → legal_consents (Loi 25)
```

---

## DÉCISIONS D'ARCHITECTURE

### DA-001 — Adapter Pattern (Plug & Play)
- Chaque enseigne = un fichier `src/adapters/[Chain]Adapter.ts`
- Tous implémentent l'interface `StoreAdapter`
- L'orchestrateur lit un tableau `ADAPTERS[]` — zero changement pour ajouter une enseigne
- Voir `src/adapters/types.ts` pour les types

### DA-002 — Price Snapshots append-only
- La table `price_snapshots` ne reçoit jamais d'UPDATE
- Historique de prix intact pour analytics B2B et alertes utilisateurs
- Prix courant = `SELECT ... ORDER BY scraped_at DESC LIMIT 1`

### DA-003 — Soft Delete utilisateurs (Loi 25)
- `users.deleted_at` timestamp — jamais de DELETE physique immédiat
- Cron de purge à 30 jours post-demande anonymise les données liées
- Maintient l'intégrité des FK sur `outbound_clicks`, `legal_consents`

### DA-004 — Legal Consents append-only
- Audit trail immuable requis par la Loi 25
- Pas d'UPDATE, seulement INSERT avec `action = 'granted' | 'revoked'`
- L'état courant = dernier enregistrement par `(user_id, consent_type)`

### DA-005 — Money type
- Prix stockés en `NUMERIC(10,2)` avec `currency_code` enum
- Jamais de `FLOAT` pour les montants monétaires
- Conversion de devises = couche applicative uniquement (jamais en DB)

### DA-006 — ISR + revalidateTag
- Pages produits/prix = statiques ISR avec tag `'prices'`
- Le cron appelle `revalidateTag('prices')` après chaque cycle de scraping
- Évite la surcharge Supabase à chaque requête utilisateur

---

## CONVENTIONS DE CODE

### Adapteurs
```typescript
// src/adapters/[Chain]Adapter.ts
export class ChainAdapter implements StoreAdapter {
  readonly chain: StoreChain = 'CHAIN';
  async search(term: string, signal?: AbortSignal): Promise<NormalizedProduct[]>
}
```
- Rate limiting : 1 req/s entre termes
- Timeout : `AbortSignal.timeout(10_000)`
- Fallback : retourne `[]` + `console.warn` si API inaccessible
- User-Agent : `EpiceriesFaciles/1.0 (+https://epiceriesfaciles.com/robots)`
- 7 termes de recherche itérés séquentiellement avec déduplication par `externalId`

### Tests adapteurs
```typescript
// src/__tests__/adapters/[Chain]Adapter.test.ts
vi.useFakeTimers()
vi.stubGlobal('fetch', mockFetch)
const promise = adapter.search('lait')
vi.runAllTimersAsync()
const results = await promise
```

### Nommage fichiers
- Composants : `PascalCase.tsx`
- Hooks : `use-kebab-case.ts`
- Utils/helpers : `camelCase.ts`
- Types globaux : `src/types/index.ts`

---

## ÉTAT ACTUEL (2026-04-08)

### Implémenté
- [x] Next.js 15 App Router scaffold
- [x] Tailwind CSS v4 + shadcn/ui (badge, button, card, checkbox, dialog, input, label, scroll-area, sonner, tabs)
- [x] Pages : `/` (home), `/account`, `/list-planner`
- [x] Mock data (`src/data/mockData.ts`)
- [x] Géolocalisation browser (`src/utils/geolocation.ts`)
- [x] Context global (`src/context/app-context.tsx`)
- [x] Header, CategorySidebar, GeolocationModal, ProductCard

### À faire (Phase 0)
- [ ] Supabase client (`src/lib/supabase/`)
- [ ] Schema SQL (voir `docs/schema.sql`)
- [ ] Auth Supabase (magic link)
- [ ] Adapteurs IGA, Metro, Maxi
- [ ] Cron route `/api/cron/scrape`
- [ ] Types globaux (`src/types/index.ts`)
- [ ] Migration mock data → Supabase

---

## VARIABLES D'ENVIRONNEMENT REQUISES

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # cron/scraping uniquement (serveur)
CRON_SECRET=                       # header Authorization sur /api/cron/*
RESEND_API_KEY=                    # Phase 1 — alertes email
STRIPE_SECRET_KEY=                 # Phase 2 — premium
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## CONFORMITÉ LÉGALE

| Exigence | Loi | Implémentation |
|---|---|---|
| Consentement cookies | Loi 25 / LPRPDE | Bandeau granulaire + `/api/consent` |
| Droit à l'oubli | Loi 25 Art. 28 | `users.deleted_at` + cron purge J+30 |
| Audit consentements | Loi 25 | Table `legal_consents` append-only |
| Données minimales | Loi 25 | IP hashée, pas stockée en clair |
| DPA tiers | RGPD/Loi 25 | Supabase DPA signé, Vercel DPA signé |

---

## MONÉTISATION

### B2C
| Tier | Prix alertes | Pub | Prix |
|---|---|---|---|
| Free | 5 produits | Oui | 0$ |
| Premium | 10 produits | Non | ~4.99$/mois |

### B2B
- Tracking clics sortants → rapport partenaires enseignes
- Tendances prix/recherche anonymisées → API payante
- Coupons numériques affiliés

---

## RÉFÉRENCES

- Docs légaux : `legal/`
- Schema SQL : `docs/schema.sql`
- Architecture détaillée : `ARCHITECTURE.md`
- Roadmap : `ROADMAP.md`
