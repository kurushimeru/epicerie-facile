-- ============================================================
-- Migration 001 — Init
-- Épiceries Faciles — Schéma complet initial
-- ============================================================

SET search_path TO public;

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis;


-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE store_chain AS ENUM (
  'IGA', 'METRO', 'MAXI', 'WALMART', 'COSTCO', 'MERCADONA', 'SORIANA'
);

CREATE TYPE currency_code AS ENUM (
  'CAD', 'USD', 'EUR', 'MXN'
);

CREATE TYPE consent_type AS ENUM (
  'essential', 'analytics', 'marketing'
);

CREATE TYPE consent_action AS ENUM (
  'granted', 'revoked'
);

CREATE TYPE user_tier AS ENUM (
  'free', 'premium'
);


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  tier        user_tier NOT NULL DEFAULT 'free',
  locale      TEXT NOT NULL DEFAULT 'fr',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ  -- soft delete (droit à l'oubli Loi 25)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: own row only"
  ON users FOR ALL
  USING (auth.uid() = auth_id);

-- Trigger : auto-créer un profil à chaque signup Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- STORES
-- ============================================================

CREATE TABLE stores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain       store_chain NOT NULL,
  name        TEXT NOT NULL,
  website     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stores: public read"
  ON stores FOR SELECT USING (true);


-- ============================================================
-- STORE LOCATIONS (PostGIS)
-- ============================================================

CREATE TABLE store_locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    TEXT,
  country     TEXT NOT NULL DEFAULT 'CA',
  postal_code TEXT,
  geom        GEOGRAPHY(POINT, 4326) NOT NULL,
  phone       TEXT,
  hours       JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_store_locations_geom
  ON store_locations USING GIST(geom);

CREATE INDEX idx_store_locations_store_id
  ON store_locations(store_id);

ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_locations: public read"
  ON store_locations FOR SELECT USING (true);

-- Fonction : stores dans un rayon donné (en mètres)
CREATE OR REPLACE FUNCTION stores_within_radius(
  lat           FLOAT,
  lng           FLOAT,
  radius_meters INT
)
RETURNS TABLE(
  location_id     UUID,
  store_id        UUID,
  chain           store_chain,
  name            TEXT,
  address         TEXT,
  city            TEXT,
  distance_meters FLOAT
) LANGUAGE sql STABLE AS $$
  SELECT
    sl.id,
    s.id,
    s.chain,
    s.name,
    sl.address,
    sl.city,
    ST_Distance(sl.geom, ST_MakePoint(lng, lat)::GEOGRAPHY) AS distance_meters
  FROM store_locations sl
  JOIN stores s ON s.id = sl.store_id
  WHERE ST_DWithin(sl.geom, ST_MakePoint(lng, lat)::GEOGRAPHY, radius_meters)
  ORDER BY distance_meters;
$$;


-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name        TEXT NOT NULL,
  image_url   TEXT,
  product_url TEXT NOT NULL,
  unit        TEXT,
  category    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, external_id)
);

CREATE INDEX idx_products_store_id
  ON products(store_id);

CREATE INDEX idx_products_name_fts
  ON products USING gin(to_tsvector('french', name));

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products: public read"
  ON products FOR SELECT USING (true);


-- ============================================================
-- PRICE SNAPSHOTS (append-only — jamais de UPDATE)
-- ============================================================

CREATE TABLE price_snapshots (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount     NUMERIC(10,2) NOT NULL,
  currency   currency_code NOT NULL DEFAULT 'CAD',
  on_sale    BOOLEAN NOT NULL DEFAULT false,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_price_snapshots_product_time
  ON price_snapshots(product_id, scraped_at DESC);

ALTER TABLE price_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "price_snapshots: public read"
  ON price_snapshots FOR SELECT USING (true);

-- Vue : prix courant par produit
CREATE VIEW current_prices AS
SELECT DISTINCT ON (product_id)
  product_id,
  amount,
  currency,
  on_sale,
  scraped_at
FROM price_snapshots
ORDER BY product_id, scraped_at DESC;


-- ============================================================
-- WATCHLISTS
-- ============================================================

CREATE TABLE watchlists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price NUMERIC(10,2),
  notified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_watchlists_user_id
  ON watchlists(user_id);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlists: own rows only"
  ON watchlists FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );


-- ============================================================
-- OUTBOUND CLICKS (B2B — append-only)
-- ============================================================

CREATE TABLE outbound_clicks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id   UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  referrer   TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_outbound_clicks_product_time
  ON outbound_clicks(product_id, clicked_at DESC);

CREATE INDEX idx_outbound_clicks_store_time
  ON outbound_clicks(store_id, clicked_at DESC);

ALTER TABLE outbound_clicks ENABLE ROW LEVEL SECURITY;

-- INSERT public (anonyme OK) — SELECT réservé service role
CREATE POLICY "outbound_clicks: insert only"
  ON outbound_clicks FOR INSERT WITH CHECK (true);


-- ============================================================
-- LEGAL CONSENTS (Loi 25 — append-only)
-- ============================================================

CREATE TABLE legal_consents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id   TEXT,
  consent_type consent_type NOT NULL,
  action       consent_action NOT NULL,
  ip_hash      TEXT,  -- SHA-256, jamais en clair
  user_agent   TEXT,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_legal_consents_user_time
  ON legal_consents(user_id, consented_at DESC);

CREATE INDEX idx_legal_consents_session_time
  ON legal_consents(session_id, consented_at DESC);

ALTER TABLE legal_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "legal_consents: insert only"
  ON legal_consents FOR INSERT WITH CHECK (true);

CREATE POLICY "legal_consents: own rows read"
  ON legal_consents FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );
