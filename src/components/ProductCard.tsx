"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductWithPrice } from "@/types";

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export function ProductCard({ product }: { product: ProductWithPrice }) {
  const saving = product.originalPrice
    ? Math.round(((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100)
    : 0;

  const handleClick = async () => {
    await fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        storeId: product.storeId,
        productUrl: product.productUrl,
      }),
    });
    window.open(product.productUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.imageUrl ?? PLACEHOLDER}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-200 p-1"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 17vw"
          unoptimized={!!product.imageUrl}
        />
        {product.onSale && saving > 0 && (
          <Badge className="absolute top-1 right-1 text-[10px] px-1 py-0 bg-red-500 hover:bg-red-600">
            -{saving}%
          </Badge>
        )}
      </div>
      <CardContent className="p-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs font-semibold line-clamp-2 leading-tight">{product.name}</h3>
          {product.unit && (
            <p className="text-[10px] text-gray-500">{product.unit}</p>
          )}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-green-600">
              {product.price.amount.toFixed(2)} $
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {product.originalPrice.amount.toFixed(2)} $
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-blue-600 truncate">{product.storeName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
