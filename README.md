# Épiceries Faciles

Comparateur de prix d'épiceries québécoises. Agrège IGA, Metro, Maxi, Super C, Provigo, Walmart.

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Supabase (Postgres) · Vercel

## Démarrage

```bash
cp .env.local.example .env.local   # remplir les variables
npm install
npm run dev
```

## Crons (dev local)

```bash
# Scraping des prix (toutes les heures en prod)
curl -X GET http://localhost:3000/api/cron/scrape -H "Authorization: Bearer $CRON_SECRET"

# Sync des magasins depuis OpenStreetMap (tous les jours à 3h en prod)
curl -X GET http://localhost:3000/api/cron/sync-stores -H "Authorization: Bearer $CRON_SECRET"
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (cron uniquement) |
| `CRON_SECRET` | Token d'auth pour les routes `/api/cron/*` |

## Structure

```
src/
  adapters/          Scrapers par chaîne (Flipp) + localisateurs (OSM)
  app/               Next.js App Router (pages + API routes)
  components/        Composants React
  lib/               Supabase clients, queries, constantes
  types/             Types TypeScript globaux
supabase/
  migrations/        Migrations SQL incrémentales
```
