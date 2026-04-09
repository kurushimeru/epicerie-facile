"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useAppContext } from "@/context/app-context";
import type { ProductWithPrice } from "@/types";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: ProductWithPrice[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { searchTags, selectedCategories } = useAppContext();

  const filtered = useMemo(() => {
    let result = products;

    if (searchTags.length > 0) {
      result = result.filter(p =>
        searchTags.some(tag => p.name.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p =>
        p.category && selectedCategories.includes(p.category)
      );
    }

    return [...result].sort((a, b) => {
      if (a.onSale && !b.onSale) return -1;
      if (!a.onSale && b.onSale) return 1;
      return a.price.amount - b.price.amount;
    });
  }, [products, searchTags, selectedCategories]);

  const promoCount = filtered.filter(p => p.onSale).length;
  const isEmpty = filtered.length === 0;
  const hasFilters = searchTags.length > 0 || selectedCategories.length > 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {hasFilters ? "Résultats de recherche" : "Promotions près de chez vous"}
        </h1>
        <div className="flex items-center gap-3">
          {promoCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {promoCount} promotion{promoCount > 1 ? "s" : ""}
            </Badge>
          )}
          <p className="text-sm text-gray-600">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {products.length === 0
              ? "Aucun produit disponible. Le scraping n'a pas encore tourné."
              : "Aucun produit trouvé. Ajustez votre recherche ou vos filtres."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
