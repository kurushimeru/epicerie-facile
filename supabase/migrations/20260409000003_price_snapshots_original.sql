-- Migration 003 — Ajout original_amount dans price_snapshots
SET search_path TO public;

ALTER TABLE price_snapshots
  ADD COLUMN IF NOT EXISTS original_amount NUMERIC(10,2);
