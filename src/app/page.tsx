"use client";

import { useState, useEffect } from "react";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { allProducts, type Product } from "@/data/mockData";
import { calculateDistance } from "@/utils/geolocation";
import { storage } from "@/utils/localStorage";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { searchTags, selectedCategories, setSelectedCategories, locationVersion } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const userLocation = storage.getLocation();

    let result = allProducts.map((product) => {
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          product.store.latitude,
          product.store.longitude
        );
        return { ...product, store: { ...product.store, distance } };
      }
      return product;
    });

    if (searchTags.length > 0) {
      result = result.filter((p) =>
        searchTags.some((tag) => p.name.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result.sort((a, b) => {
      if (a.isPromotion && !b.isPromotion) return -1;
      if (!a.isPromotion && b.isPromotion) return 1;
      if (a.store.distance !== undefined && b.store.distance !== undefined) {
        return a.store.distance - b.store.distance;
      }
      return 0;
    });

    setProducts(result);
    setLoading(false);
  }, [searchTags, selectedCategories, locationVersion]);

  const promotionCount = products.filter((p) => p.isPromotion).length;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <CategorySidebar
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {searchTags.length > 0 || selectedCategories.length > 0
                ? "Résultats de recherche"
                : "Promotions près de chez vous"}
            </h1>
            <div className="flex items-center gap-3">
              {promotionCount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {promotionCount} promotion{promotionCount > 1 ? "s" : ""}
                </Badge>
              )}
              <p className="text-sm text-gray-600">{products.length} produit{products.length > 1 ? "s" : ""} trouvé{products.length > 1 ? "s" : ""}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit trouvé. Ajustez votre recherche ou vos filtres.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
