# ARCHITECTURE.md — Épiceries Faciles

## Flux de données global

```
┌──────────────────────────────────────────────────────────────────┐
│  COUCHE SCRAPING — Background (Vercel Cron, toutes les heures)  │
│                                                                  │
│  src/adapters/                                                   │
│    types.ts           ← StoreAdapter interface, NormalizedProduct│
│    IgaAdapter.ts  ─┐                                            │
│    MetroAdapter.ts─┤                                            │
│    MaxiAdapter.ts ─┼──► ScraperOrchestrator.ts                 │
│    [NewChain].ts  ─┘         │                                  │
│    (plug & play)             │ normalize + deduplicate           │
│                              ▼                                   │
│                      /api/cron/scrape/route.ts                  │
│                         │  (CRON_SECRET auth)                   │
└─────────────────────────┼────────────────────────────────────────┘
                          │ upsert (service role key)
┌─────────────────────────▼────────────────────────────────────────┐
│  SUPABASE — Postgres + PostGIS                                  │
│                                                                  │
│  stores ──────────── store_locations (GIST index)              │
│     │                                                            │
│     └──► products ──► price_snapshots (append-only)            │
│                                │                                 │
│  users ──► watchlists ─────────┘                               │
│    │                                                             │
│    ├──► outbound_clicks                                         │
│    └──► legal_consents (append-only, Loi 25)                   │
│                                                                  │
│  RLS: users voient seulement leurs propres données             │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                revalidateTag('prices')
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│  NEXT.JS 15 APP ROUTER                                          │
│                                                                  │
│  app/[locale]/                                                  │
│    page.tsx                ← Search (ISR, tag: 'prices')        │
│    stores/page.tsx         ← PostGIS radius query               │
│    watchlist/page.tsx      ← Auth-gated, SSR                   │
│    account/page.tsx        ← Auth-gated, SSR                   │
│    list-planner/page.tsx   ← Client-side, localStorage          │
│    legal/[doc]/page.tsx    ← Statique                          │
│                                                                  │
│  app/api/                                                        │
│    cron/scrape/route.ts    ← POST (Vercel Cron)                │
│    click/route.ts          ← POST (outbound tracking)           │
│    consent/route.ts        ← POST (Loi 25)                      │
│    revalidate/route.ts     ← POST (ISR manuel)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Adapter Pattern — Plug & Play

### Interface

```typescript
// src/adapters/types.ts

export type StoreChain = 'IGA' | 'METRO' | 'MAXI' | 'WALMART' | 'COSTCO' | 'MERCADONA';
export type CurrencyCode = 'CAD' | 'USD' | 'EUR' | 'MXN';

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface NormalizedProduct {
  externalId: string;
  storeChain: StoreChain;
  name: string;
  price: Money;
  unit?: string;
  imageUrl?: string;
  productUrl: string;
  scrapedAt: Date;
}

export interface StoreAdapter {
  readonly chain: StoreChain;
  search(term: string, signal?: AbortSignal): Promise<NormalizedProduct[]>;
}
```

### Orchestrateur

```typescript
// src/adapters/ScraperOrchestrator.ts

const ADAPTERS: StoreAdapter[] = [
  new IgaAdapter(),
  new MetroAdapter(),
  new MaxiAdapter(),
  // Ajouter ici uniquement pour supporter une nouvelle enseigne
];
```

### Ajouter une enseigne (ex: Espagne)

1. Créer `src/adapters/MercadonaAdapter.ts`
2. Implémenter `StoreAdapter` avec `chain: 'MERCADONA'`
3. Ajouter `new MercadonaAdapter()` dans `ADAPTERS[]`
4. C'est tout.

---

## ISR + Cache Strategy

```
Scraping terminé
    │
    └─► revalidateTag('prices')
              │
              ▼
    Next.js invalide les pages taggées 'prices'
    Prochain visiteur reçoit la page régénérée
    Visiteurs suivants → cache statique jusqu'au prochain scraping
```

Avantages :
- Zéro latence Supabase pour 99% des requêtes
- Fraîcheur des prix garantie (toutes les heures max)
- Coûts Supabase minimaux

---

## Auth Flow (Supabase)

```
User → magic link email
    └─► Supabase Auth → JWT
              └─► Next.js middleware vérifie JWT
                    ├─ routes publiques → pass
                    └─ routes auth-gated → session cookie
```

RLS Supabase : chaque table `users`-liée filtre par `auth.uid() = user_id`.

---

## Outbound Click Tracking (B2B)

```
User clique "Voir chez IGA"
    │
    └─► /api/click (POST)
          { productId, storeId, referrer }
              │
              ├─► INSERT outbound_clicks (anonyme OK)
              └─► redirect 302 → productUrl de l'enseigne
```

---

## Consentements Loi 25

```
First visit → CookieBanner component
    │
    ├─► User choisit (essential | analytics | marketing)
    │         │
    │         └─► POST /api/consent
    │               INSERT legal_consents (append-only)
    │               Set cookie 'ef_consent' (1 an)
    │
    └─► Sur chaque page : lecture cookie ef_consent
          ├─ analytics = granted → charger script analytics
          └─ marketing = granted → charger slots pub
```

---

## Structure des fichiers cibles

```
src/
├── adapters/
│   ├── types.ts
│   ├── ScraperOrchestrator.ts
│   ├── IgaAdapter.ts
│   ├── MetroAdapter.ts
│   └── MaxiAdapter.ts
├── app/
│   ├── [locale]/
│   │   ├── page.tsx
│   │   ├── stores/page.tsx
│   │   ├── watchlist/page.tsx
│   │   └── account/page.tsx
│   └── api/
│       ├── cron/scrape/route.ts
│       ├── click/route.ts
│       ├── consent/route.ts
│       └── revalidate/route.ts
├── components/
│   ├── ui/           (shadcn — ne pas toucher)
│   ├── CookieBanner.tsx
│   ├── PriceAlert.tsx
│   └── StoreMap.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts     (browser)
│   │   └── server.ts     (server components / route handlers)
│   └── utils.ts
├── types/
│   └── index.ts          (types globaux métier)
└── __tests__/
    └── adapters/
        ├── IgaAdapter.test.ts
        ├── MetroAdapter.test.ts
        └── MaxiAdapter.test.ts
```
