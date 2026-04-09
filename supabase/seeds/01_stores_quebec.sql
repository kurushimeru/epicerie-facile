-- ============================================================
-- Seed 01 — Épiceries du Québec
-- Chaînes + emplacements représentatifs par région
-- Note: store_locations exhaustives → à importer via store locator APIs
-- ST_MakePoint(longitude, latitude)
-- ============================================================

-- ============================================================
-- CHAÎNES (stores)
-- ============================================================

INSERT INTO stores (id, chain, name, website) VALUES
  -- Réseau Sobeys / IGA
  ('00000000-0000-0000-0000-000000000001', 'IGA',           'IGA',                      'https://www.iga.net'),
  -- Réseau Metro
  ('00000000-0000-0000-0000-000000000002', 'METRO',         'Metro',                    'https://www.metro.ca'),
  ('00000000-0000-0000-0000-000000000003', 'SUPER_C',       'Super C',                  'https://www.superc.ca'),
  -- Réseau Loblaw
  ('00000000-0000-0000-0000-000000000004', 'MAXI',          'Maxi',                     'https://www.maxi.ca'),
  ('00000000-0000-0000-0000-000000000005', 'PROVIGO',       'Provigo',                  'https://www.provigo.ca'),
  -- Grandes surfaces
  ('00000000-0000-0000-0000-000000000006', 'WALMART',       'Walmart Supercentre',      'https://www.walmart.ca'),
  ('00000000-0000-0000-0000-000000000007', 'COSTCO',        'Costco',                   'https://www.costco.ca'),
  ('00000000-0000-0000-0000-000000000008', 'GIANT_TIGER',   'Giant Tiger',              'https://www.gianttiger.com'),
  -- Spécialisés / Naturels
  ('00000000-0000-0000-0000-000000000009', 'ADONIS',        'Marché Adonis',            'https://www.marcheadonis.com'),
  ('00000000-0000-0000-0000-000000000010', 'AVRIL',         'Avril Supermarché Santé',  'https://www.avril.ca'),
  ('00000000-0000-0000-0000-000000000011', 'RACHELLE_BERY', 'Rachelle-Béry',            'https://www.rachellebery.com'),
  -- Indépendants / Régionaux
  ('00000000-0000-0000-0000-000000000012', 'BONI_CHOIX',    'BoniChoix',                'https://www.bonix.ca'),
  ('00000000-0000-0000-0000-000000000013', 'INTERMARCHE',   'Intermarché',              NULL)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- EMPLACEMENTS (store_locations)
-- Représentatifs par région — à compléter avec les locators officiels
-- ============================================================

INSERT INTO store_locations (store_id, address, city, province, country, postal_code, geom) VALUES

  -- ══════════════════════════════════════════════════════════
  -- MONTRÉAL
  -- ══════════════════════════════════════════════════════════

  -- IGA
  ('00000000-0000-0000-0000-000000000001', '6700 Rue Saint-Jacques', 'Montréal', 'QC', 'CA', 'H4B 1V4', ST_MakePoint(-73.6380, 45.4528)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000001', '1235 Rue Beaubien E', 'Montréal', 'QC', 'CA', 'H2S 1T8', ST_MakePoint(-73.6046, 45.5348)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000001', '3535 Chemin Queen-Mary', 'Montréal', 'QC', 'CA', 'H3V 1A7', ST_MakePoint(-73.6382, 45.4922)::GEOGRAPHY),

  -- Metro
  ('00000000-0000-0000-0000-000000000002', '3450 Rue Drummond', 'Montréal', 'QC', 'CA', 'H3G 1Y2', ST_MakePoint(-73.5870, 45.5022)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '901 Boul de Maisonneuve E', 'Montréal', 'QC', 'CA', 'H2L 1Y7', ST_MakePoint(-73.5632, 45.5185)::GEOGRAPHY),

  -- Maxi
  ('00000000-0000-0000-0000-000000000004', '6300 Boul Décarie', 'Montréal', 'QC', 'CA', 'H3X 2H9', ST_MakePoint(-73.6400, 45.4780)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '7373 Rue Sherbrooke E', 'Montréal', 'QC', 'CA', 'H1N 1E7', ST_MakePoint(-73.5340, 45.5925)::GEOGRAPHY),

  -- Super C
  ('00000000-0000-0000-0000-000000000003', '5765 Chemin de la Côte-des-Neiges', 'Montréal', 'QC', 'CA', 'H3S 1Y7', ST_MakePoint(-73.6350, 45.4993)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '3750 Rue Jarry E', 'Montréal', 'QC', 'CA', 'H1Z 2G7', ST_MakePoint(-73.5918, 45.5611)::GEOGRAPHY),

  -- Provigo
  ('00000000-0000-0000-0000-000000000005', '1820 Boul René-Lévesque O', 'Montréal', 'QC', 'CA', 'H3H 1R4', ST_MakePoint(-73.5838, 45.4976)::GEOGRAPHY),

  -- Adonis
  ('00000000-0000-0000-0000-000000000009', '2001 Boul Marcel-Laurin', 'Montréal', 'QC', 'CA', 'H4R 1K4', ST_MakePoint(-73.7000, 45.5085)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000009', '3421 Rue Jarry E', 'Montréal', 'QC', 'CA', 'H1Z 2G1', ST_MakePoint(-73.5960, 45.5605)::GEOGRAPHY),

  -- Avril
  ('00000000-0000-0000-0000-000000000010', '5872 Ave Monkland', 'Montréal', 'QC', 'CA', 'H4A 1G1', ST_MakePoint(-73.6474, 45.4717)::GEOGRAPHY),

  -- Rachelle-Béry
  ('00000000-0000-0000-0000-000000000011', '4810 Rue Sherbrooke O', 'Montréal', 'QC', 'CA', 'H3Z 1G5', ST_MakePoint(-73.6060, 45.4797)::GEOGRAPHY),

  -- Walmart
  ('00000000-0000-0000-0000-000000000006', '9191 Boul Lacordaire', 'Montréal', 'QC', 'CA', 'H1R 2A5', ST_MakePoint(-73.5595, 45.5816)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- LAVAL
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '3035 Boul Le Carrefour', 'Laval', 'QC', 'CA', 'H7T 1C8', ST_MakePoint(-73.7469, 45.5638)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '1750 Boul des Laurentides', 'Laval', 'QC', 'CA', 'H7M 2P6', ST_MakePoint(-73.7129, 45.5905)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '4365 Boul Curé-Labelle', 'Laval', 'QC', 'CA', 'H7P 5S9', ST_MakePoint(-73.7547, 45.5485)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '5000 Boul des Laurentides', 'Laval', 'QC', 'CA', 'H7K 2J9', ST_MakePoint(-73.7200, 45.6078)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000006', '3003 Boul Le Carrefour', 'Laval', 'QC', 'CA', 'H7T 1C8', ST_MakePoint(-73.7487, 45.5645)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- LONGUEUIL / BROSSARD / RIVE-SUD
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '1235 Rue du Séminaire N', 'Saint-Jean-sur-Richelieu', 'QC', 'CA', 'J3A 1G2', ST_MakePoint(-73.2619, 45.3148)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '505 Boul Roland-Therrien', 'Longueuil', 'QC', 'CA', 'J4H 4E7', ST_MakePoint(-73.5157, 45.5140)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '7250 Boul Taschereau', 'Brossard', 'QC', 'CA', 'J4W 1M9', ST_MakePoint(-73.4674, 45.4590)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '1225 Boul Marie-Victorin', 'Longueuil', 'QC', 'CA', 'J4G 2H6', ST_MakePoint(-73.4885, 45.5368)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000006', '9151 Boul Taschereau', 'Brossard', 'QC', 'CA', 'J4X 1C3', ST_MakePoint(-73.4479, 45.4437)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- QUÉBEC (VILLE)
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '755 Rue Bouvier', 'Québec', 'QC', 'CA', 'G2J 1C4', ST_MakePoint(-71.2923, 46.8439)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '3030 Boul des Laurentides', 'Québec', 'QC', 'CA', 'G1H 7G2', ST_MakePoint(-71.3241, 46.8592)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '300 Boul Wilfrid-Hamel', 'Québec', 'QC', 'CA', 'G1L 3A8', ST_MakePoint(-71.2485, 46.8267)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '925 Rue Soumande', 'Québec', 'QC', 'CA', 'G1M 3B6', ST_MakePoint(-71.2774, 46.8167)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000005', '1200 Boul Lebourgneuf', 'Québec', 'QC', 'CA', 'G2K 2G2', ST_MakePoint(-71.2955, 46.8681)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000006', '5000 Boul des Galeries', 'Québec', 'QC', 'CA', 'G2K 2J1', ST_MakePoint(-71.3062, 46.8604)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000007', '1800 Boul Wilfrid-Hamel', 'Québec', 'QC', 'CA', 'G1N 3Y6', ST_MakePoint(-71.2243, 46.8093)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- LÉVIS
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '50 Rue de la Concorde', 'Lévis', 'QC', 'CA', 'G6V 6J7', ST_MakePoint(-71.1884, 46.7089)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '30 Rue Président-Kennedy', 'Lévis', 'QC', 'CA', 'G6V 6J1', ST_MakePoint(-71.1827, 46.7123)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- GATINEAU
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '500 Boul de la Gappe', 'Gatineau', 'QC', 'CA', 'J8T 8H2', ST_MakePoint(-75.7423, 45.4831)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '1100 Boul Maloney E', 'Gatineau', 'QC', 'CA', 'J8R 3T5', ST_MakePoint(-75.7064, 45.4563)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '755 Boul Greber', 'Gatineau', 'QC', 'CA', 'J8T 4J6', ST_MakePoint(-75.7481, 45.4729)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '1100 Boul St-René O', 'Gatineau', 'QC', 'CA', 'J8T 8M1', ST_MakePoint(-75.7540, 45.4700)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000006', '499 Boul de la Gappe', 'Gatineau', 'QC', 'CA', 'J8T 8H1', ST_MakePoint(-75.7395, 45.4820)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- SHERBROOKE
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '685 Rue Galt O', 'Sherbrooke', 'QC', 'CA', 'J1H 1Z2', ST_MakePoint(-71.9157, 45.4049)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '1235 Rue King O', 'Sherbrooke', 'QC', 'CA', 'J1H 1R5', ST_MakePoint(-71.9264, 45.3988)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '3235 Boul de Portland', 'Sherbrooke', 'QC', 'CA', 'J1L 2X2', ST_MakePoint(-71.9484, 45.3845)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '2500 Boul de Portland', 'Sherbrooke', 'QC', 'CA', 'J1L 2X2', ST_MakePoint(-71.9432, 45.3832)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- TROIS-RIVIÈRES
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '4255 Boul des Forges', 'Trois-Rivières', 'QC', 'CA', 'G8Y 1W4', ST_MakePoint(-72.5787, 46.3648)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '4200 Boul des Récollets', 'Trois-Rivières', 'QC', 'CA', 'G8Z 3W4', ST_MakePoint(-72.5944, 46.3382)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '3155 Boul des Forges', 'Trois-Rivières', 'QC', 'CA', 'G8Z 1T7', ST_MakePoint(-72.5661, 46.3519)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '1460 Boul des Récollets', 'Trois-Rivières', 'QC', 'CA', 'G8Z 4L9', ST_MakePoint(-72.5849, 46.3259)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- SAGUENAY (Chicoutimi / Jonquière)
  -- ══════════════════════════════════════════════════════════

  ('00000000-0000-0000-0000-000000000001', '1607 Boul du Royaume O', 'Saguenay', 'QC', 'CA', 'G7S 1Y3', ST_MakePoint(-71.1497, 48.4133)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '2675 Boul du Royaume O', 'Saguenay', 'QC', 'CA', 'G7S 5B7', ST_MakePoint(-71.1834, 48.4076)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '1845 Boul Talbot', 'Saguenay', 'QC', 'CA', 'G7H 4C3', ST_MakePoint(-71.0747, 48.4216)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000006', '3905 Boul du Royaume', 'Saguenay', 'QC', 'CA', 'G7X 9B1', ST_MakePoint(-71.1245, 48.4156)::GEOGRAPHY),

  -- ══════════════════════════════════════════════════════════
  -- AUTRES RÉGIONS (1 représentant par ville)
  -- ══════════════════════════════════════════════════════════

  -- Drummondville
  ('00000000-0000-0000-0000-000000000001', '225 Boul Saint-Joseph', 'Drummondville', 'QC', 'CA', 'J2C 2A9', ST_MakePoint(-72.4824, 45.8851)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '1155 Boul Saint-Joseph', 'Drummondville', 'QC', 'CA', 'J2C 2H1', ST_MakePoint(-72.4638, 45.8757)::GEOGRAPHY),

  -- Granby
  ('00000000-0000-0000-0000-000000000001', '595 Rue Principale', 'Granby', 'QC', 'CA', 'J2G 2Y8', ST_MakePoint(-72.7380, 45.4024)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000003', '810 Rue Principale', 'Granby', 'QC', 'CA', 'J2G 2Y9', ST_MakePoint(-72.7284, 45.4016)::GEOGRAPHY),

  -- Saint-Hyacinthe
  ('00000000-0000-0000-0000-000000000002', '6500 Boul Laframboise', 'Saint-Hyacinthe', 'QC', 'CA', 'J2S 4Z3', ST_MakePoint(-72.9563, 45.6182)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000004', '6025 Boul Laframboise', 'Saint-Hyacinthe', 'QC', 'CA', 'J2S 4Z2', ST_MakePoint(-72.9594, 45.6168)::GEOGRAPHY),

  -- Rouyn-Noranda
  ('00000000-0000-0000-0000-000000000001', '101 Rue Principale', 'Rouyn-Noranda', 'QC', 'CA', 'J9X 4P2', ST_MakePoint(-79.0188, 48.2390)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '1200 Rue Larivière', 'Rouyn-Noranda', 'QC', 'CA', 'J9X 5B7', ST_MakePoint(-79.0242, 48.2312)::GEOGRAPHY),

  -- Val-d'Or
  ('00000000-0000-0000-0000-000000000001', '1050 3e Avenue', 'Val-d''Or', 'QC', 'CA', 'J9P 1T5', ST_MakePoint(-77.7837, 48.0970)::GEOGRAPHY),

  -- Rimouski
  ('00000000-0000-0000-0000-000000000001', '180 Rue Cathédrale', 'Rimouski', 'QC', 'CA', 'G5L 5H8', ST_MakePoint(-68.5219, 48.4515)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '555 Boul Arthur-Buies O', 'Rimouski', 'QC', 'CA', 'G5L 7E4', ST_MakePoint(-68.5444, 48.4365)::GEOGRAPHY),

  -- Sept-Îles
  ('00000000-0000-0000-0000-000000000001', '546 Boul Laure', 'Sept-Îles', 'QC', 'CA', 'G4R 1X4', ST_MakePoint(-66.3812, 50.2178)::GEOGRAPHY),
  ('00000000-0000-0000-0000-000000000002', '700 Boul Laure', 'Sept-Îles', 'QC', 'CA', 'G4R 1Y1', ST_MakePoint(-66.3725, 50.2196)::GEOGRAPHY),

  -- Victoriaville
  ('00000000-0000-0000-0000-000000000004', '570 Boul des Bois-Francs N', 'Victoriaville', 'QC', 'CA', 'G6P 7B2', ST_MakePoint(-71.9683, 46.0623)::GEOGRAPHY),

  -- Shawinigan
  ('00000000-0000-0000-0000-000000000002', '2600 Boul des Hêtres', 'Shawinigan', 'QC', 'CA', 'G9N 8G7', ST_MakePoint(-72.7214, 46.5439)::GEOGRAPHY)

ON CONFLICT DO NOTHING;
