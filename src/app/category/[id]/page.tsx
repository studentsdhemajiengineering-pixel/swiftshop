
'use client';

import { getProducts, getCategories } from '@/lib/firebase/service';
import type { Product, Category } from '@/lib/types';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '@/components/products/product-grid';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';

const CategoryHeader = ({ categoryName }: { categoryName: string }) => {
    const router = useRouter();
    return (
        <header className="bg-background sticky top-0 z-40 border-b md:hidden">
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
  const [category, setCategory] = useState<Category | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allProducts, allCategories] = await Promise.all([getProducts(), getCategories()]);
      const currentCategory = allCategories.find((c) => c.id === params.id);
      setCategory(currentCategory);

      if (currentCategory) {
        const productsInCategory = allProducts.filter(p => p.category === params.id);
        setProducts(productsInCategory);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);
  
  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/20">
            <div className='hidden md:block'><Header /></div>
            <CategoryHeader categoryName="Loading..." />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p>Loading products...</p>
                </div>
            </main>
        </div>
    )
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <CategoryHeader categoryName={category.name} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
           <h1 className="text-2xl font-bold tracking-tight mb-6 hidden md:block">{category.name}</h1>
          <ProductGrid products={products} />
        </div>
      </main>
    </div>
  );
}
