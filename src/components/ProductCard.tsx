import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/data/mockData";

export function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.isPromotion && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            -{discountPercent}%
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.quantity}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-600">{product.price.toFixed(2)} $</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} $</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">{product.store.name}</span>
            {product.store.distance !== undefined && (
              <span className="text-xs text-gray-500">{product.store.distance} km</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
