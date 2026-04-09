export const CATEGORIES = [
  "Produits laitiers",
  "Fruits et légumes",
  "Boulangerie",
  "Viandes et volailles",
  "Boissons",
  "Épicerie",
  "Collations",
  "Surgelés",
] as const;

export type Category = typeof CATEGORIES[number];
