-- Migration 004 — Vue current_prices v2 avec original_amount
SET search_path TO public;

DROP VIEW IF EXISTS current_prices;

CREATE VIEW current_prices AS
SELECT DISTINCT ON (product_id)
  product_id,
  amount,
  original_amount,
  currency,
  on_sale,
  scraped_at
FROM price_snapshots
ORDER BY product_id, scraped_at DESC;
