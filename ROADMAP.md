# ROADMAP — Épiceries Faciles

## Vue d'ensemble

```
PHASE 0 ──────► PHASE 1 ──────► PHASE 2 ──────► PHASE 3
Fondations      MVP Québec      Moteur B2B      International
(maintenant)    (6-8 sem)       (3 mois)        (6 mois+)
```

---

## PHASE 0 — Fondations ✓ (terminé)

Infrastructure de données réelle, scraping Flipp, sync magasins OSM, ISR.

---

## PHASE 1 — MVP Québec (6-8 semaines)

**Objectif :** Produit utilisable par de vrais utilisateurs québécois.

### Auth & Comptes
- [ ] Auth Supabase (magic link email)
- [ ] Page `/account` connectée (profil, tier, préférences)
- [ ] Middleware Next.js (routes protégées)

### Watchlist & Alertes
- [ ] Table `watchlists` + RLS Supabase
- [ ] UI watchlist (5 produits free, 10 premium)
- [ ] Alertes prix email (Resend)
- [ ] Gate freemium (5 produits max → upsell)

### Géolocalisation
- [ ] Filtre par proximité sur page home (requête `store_locations`)
- [ ] Composant `StoreMap.tsx`

### i18n
- [ ] next-intl setup (`fr`, `en`)
- [ ] `app/[locale]/` routing
- [ ] Traductions clés UI

### Conformité Loi 25
- [ ] `CookieBanner.tsx` (granulaire : essential/analytics/marketing)
- [ ] `/api/consent/route.ts` + table `legal_consents`
- [ ] Pages `/legal/privacy`, `/legal/cgu`, `/legal/cookies`

### Monétisation Free
- [ ] Slots publicitaires injectés dynamiquement (tier = free)

**Critère de sortie :** Utilisateur peut créer un compte, suivre des produits, recevoir une alerte.

---

## PHASE 2 — Moteur B2B (3 mois)

**Objectif :** Revenus récurrents + valeur partenaires.

### Premium
- [ ] Stripe checkout + webhooks
- [ ] Gestion subscription (`users.tier = 'premium'`)
- [ ] Désactivation pub premium

### Dashboard Analytics B2B
- [ ] Agrégation tendances prix (anonymisées)
- [ ] Tendances recherche par région
- [ ] Export CSV/API pour partenaires

### Coupons numériques
- [ ] Partenariat enseignes (IGA, Metro)
- [ ] Table `coupons` + affichage contextuel
- [ ] Tracking utilisation coupons

### Optimisation trajets
- [ ] Algorithme "meilleur parcours" multi-enseignes
- [ ] Intégration Google Maps/Mapbox

**Critère de sortie :** Premier contrat partenaire signé. MRR > 0.

---

## PHASE 3 — Expansion Internationale (6 mois+)

**Objectif :** Hors Québec — USA, Mexique, Espagne.

- [ ] Traductions `es` + gestion multi-devises (USD, EUR, MXN)
- [ ] `WalmartUsAdapter.ts`, `MercadonaAdapter.ts`, `SorianaMexicoAdapter.ts`
- [ ] Adaptation légale par pays
- [ ] CDN edge caching par région

---

## Backlog non-priorisé

- App mobile (React Native / Expo)
- Reconnaissance photo (scan code-barres)
- Comparateur nutritionnel
- API publique développeurs tiers
- White-label B2B
