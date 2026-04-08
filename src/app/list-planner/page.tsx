"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart, Store } from "lucide-react";
import { storage } from "@/utils/localStorage";
import { allProducts, type ShoppingListItem, type Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";

export default function ListPlannerPage() {
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    setShoppingList(storage.getShoppingList());
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setFilteredProducts(
        allProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
      );
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm]);

  const addToList = (productId: string) => {
    const existing = shoppingList.find((item) => item.productId === productId);
    const newList = existing
      ? shoppingList.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...shoppingList, { productId, quantity: 1 }];
    setShoppingList(newList);
    storage.setShoppingList(newList);
    setSearchTerm("");
    toast.success("Ajouté à la liste");
  };

  const removeFromList = (productId: string) => {
    const newList = shoppingList.filter((item) => item.productId !== productId);
    setShoppingList(newList);
    storage.setShoppingList(newList);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) { removeFromList(productId); return; }
    const newList = shoppingList.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setShoppingList(newList);
    storage.setShoppingList(newList);
  };

  const calculateOptimalTrip = () => {
    const listProducts = shoppingList
      .map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        return product ? { ...product, listQty: item.quantity } : null;
      })
      .filter((p): p is Product & { listQty: number } => p !== null);

    // Cheapest per product name
    const cheapestByName = new Map<string, Product & { listQty: number }>();
    listProducts.forEach((p) => {
      const ex = cheapestByName.get(p.name);
      if (!ex || p.price < ex.price) cheapestByName.set(p.name, p);
    });

    // Multi-store map
    const multiStoreMap = new Map<string, { products: (Product & { listQty: number })[]; total: number }>();
    Array.from(cheapestByName.values()).forEach((p) => {
      const storeName = p.store.name;
      const cost = p.price * p.listQty;
      const ex = multiStoreMap.get(storeName);
      if (ex) { ex.products.push(p); ex.total += cost; }
      else multiStoreMap.set(storeName, { products: [p], total: cost });
    });

    const multiStoreTotal = Array.from(multiStoreMap.values()).reduce((sum, s) => sum + s.total, 0);

    // Single-store map
    const storeMap = new Map<string, { products: (Product & { listQty: number })[]; total: number }>();
    listProducts.forEach((p) => {
      const storeName = p.store.name;
      const cost = p.price * p.listQty;
      const ex = storeMap.get(storeName);
      if (ex) {
        const existingP = ex.products.find((x) => x.name === p.name);
        if (!existingP) { ex.products.push(p); ex.total += cost; }
        else if (p.price < existingP.price) {
          ex.total -= existingP.price * existingP.listQty;
          ex.total += cost;
          ex.products = ex.products.map((x) => (x.name === p.name ? p : x));
        }
      } else {
        storeMap.set(storeName, { products: [p], total: cost });
      }
    });

    const uniqueNames = new Set(listProducts.map((p) => p.name));
    const completeStores = Array.from(storeMap.entries())
      .filter(([, data]) => new Set(data.products.map((p) => p.name)).size === uniqueNames.size)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => a.total - b.total);

    return {
      multiStore: {
        stores: Array.from(multiStoreMap.entries()).map(([name, data]) => ({ name, ...data })),
        total: multiStoreTotal,
      },
      singleStore: completeStores,
    };
  };

  const listProducts = shoppingList
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return product ? { ...product, listQty: item.quantity } : null;
    })
    .filter((p): p is Product & { listQty: number } => p !== null);

  const comparison = shoppingList.length > 0 ? calculateOptimalTrip() : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Retour
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shopping List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Ma liste d&apos;épicerie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Input
                    placeholder="Rechercher un produit à ajouter…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          onClick={() => addToList(product.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.price.toFixed(2)} $ — {product.store.name}</p>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {listProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Votre liste est vide. Ajoutez des produits pour commencer !
                </p>
              ) : (
                <div className="space-y-3">
                  {listProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} × {product.price.toFixed(2)} $</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={product.listQty}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                          className="w-16"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeFromList(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Stratégie d&apos;achat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!comparison ? (
                <p className="text-gray-500 text-center py-8">
                  Ajoutez des produits à votre liste pour voir la meilleure stratégie d&apos;achat
                </p>
              ) : (
                <Tabs defaultValue="multi">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="multi">Plusieurs épiceries</TabsTrigger>
                    <TabsTrigger value="single">Une seule épicerie</TabsTrigger>
                  </TabsList>

                  <TabsContent value="multi" className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-green-900">Option la moins chère</h3>
                        <Badge className="bg-green-600">{comparison.multiStore.total.toFixed(2)} $</Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Visitez plusieurs épiceries pour obtenir le meilleur prix sur chaque article
                      </p>
                      <div className="space-y-3">
                        {comparison.multiStore.stores.map((store) => (
                          <div key={store.name} className="bg-white rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{store.name}</span>
                              <span className="text-sm">{store.total.toFixed(2)} $</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {store.products.map((p) => (
                                <li key={p.id}>• {p.name} ({p.listQty}×)</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="single" className="space-y-4">
                    {comparison.singleStore.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Aucune épicerie n&apos;a tous les produits de votre liste
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {comparison.singleStore.map((store, idx) => (
                          <div
                            key={store.name}
                            className={`border rounded-lg p-4 ${idx === 0 ? "border-blue-300 bg-blue-50" : ""}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold">{store.name}</h3>
                              <Badge variant={idx === 0 ? "default" : "secondary"}>
                                {store.total.toFixed(2)} $
                              </Badge>
                            </div>
                            {idx === 0 && (
                              <p className="text-sm text-blue-700 mb-3">Meilleure option en une seule épicerie</p>
                            )}
                            <ul className="text-sm text-gray-600 space-y-1">
                              {store.products.map((p) => (
                                <li key={p.id}>• {p.name} ({p.listQty}×) — {p.price.toFixed(2)} $</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {comparison.singleStore.length > 0 && (
                      <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
                        <p>
                          <strong>Surcoût vs. plusieurs épiceries :</strong>{" "}
                          {(comparison.singleStore[0].total - comparison.multiStore.total).toFixed(2)} $
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
