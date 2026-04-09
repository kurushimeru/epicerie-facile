import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/queries/products";

// Server Component — ISR invalidé par revalidateTag('prices') dans le cron
export const dynamic = "force-static";

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="relative min-h-screen bg-gray-50">
      <CategorySidebar />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <ProductGrid products={products} />
        </div>
      </main>
    </div>
  );
}
