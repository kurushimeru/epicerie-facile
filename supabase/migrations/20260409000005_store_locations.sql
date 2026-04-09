-- Migration 005 — Table store_locations (magasins individuels géolocalisés)
SET search_path TO public;

CREATE TABLE IF NOT EXISTS store_locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id      UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  external_id   TEXT NOT NULL UNIQUE,   -- ex: "osm:node:12345678"
  name          TEXT NOT NULL,
  address       TEXT NOT NULL DEFAULT '',
  city          TEXT NOT NULL DEFAULT '',
  province      TEXT NOT NULL DEFAULT 'QC',
  country       TEXT NOT NULL DEFAULT 'CA',
  postal_code   TEXT NOT NULL DEFAULT '',
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  phone         TEXT,
  hours         JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index géographique pour les requêtes de proximité
CREATE INDEX IF NOT EXISTS store_locations_lat_lng_idx
  ON store_locations (latitude, longitude);

-- Index sur store_id pour JOINs
CREATE INDEX IF NOT EXISTS store_locations_store_id_idx
  ON store_locations (store_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER store_locations_updated_at
  BEFORE UPDATE ON store_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_locations_public_read"
  ON store_locations FOR SELECT
  USING (true);

CREATE POLICY "store_locations_service_write"
  ON store_locations FOR ALL
  USING (auth.role() = 'service_role');
