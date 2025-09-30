
'use client';

import { allProducts, categories } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '@/components/products/product-grid';

const CategoryHeader = ({ categoryName }: { categoryName: string }) => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container flex h-14 items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold flex-1">{categoryName}</h1>
            </div>
        </header>
    );
};


export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const category = categories.find((c) => c.id === params.id);
  
  if (!category) {
    notFound();
  }

  const productsInCategory = allProducts.filter(p => p.category === params.id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <CategoryHeader categoryName={category.name} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <ProductGrid products={productsInCategory} />
        </div>
      </main>
    </div>
  );
}
