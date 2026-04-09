"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductWithPrice } from "@/types";

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export function ProductCard({ product }: { product: ProductWithPrice }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl ?? PLACEHOLDER}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={!!product.imageUrl}
        />
        {product.onSale && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            Promo
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          {product.unit && (
            <p className="text-sm text-gray-600">{product.unit}</p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-600">
              {product.price.amount.toFixed(2)} $
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">{product.storeName}</span>
            {product.category && (
              <span className="text-xs text-gray-400">{product.category}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
