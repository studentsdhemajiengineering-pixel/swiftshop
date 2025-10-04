
'use client';

import { ProductCarousel } from '@/components/products/product-carousel';
import { CategoryGrid } from '@/components/products/category-grid';
import { CategoryCarousel } from '@/components/products/category-carousel';
import { Header } from '@/components/layout/header';
import { HeroCarousel } from '@/components/layout/hero-carousel';
import { PromoGrid } from '@/components/products/promo-grid';
import { Button } from '@/components/ui/button';
import { getCategories, getProducts } from '@/lib/firebase/service';
import { getBrandingSettings } from '@/admin/settings/actions';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { promoItems } from '@/lib/promo-data';
import type { Category, Product } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branding, setBranding] = useState<{heroImageUrls: string[]}>({heroImageUrls: []});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedProducts, fetchedCategories, fetchedBranding] = await Promise.all([
          getProducts(), 
          getCategories(),
          getBrandingSettings()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      if (fetchedBranding?.heroImageUrls) {
        setBranding({heroImageUrls: fetchedBranding.heroImageUrls});
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const heroImages: ImagePlaceholder[] = branding.heroImageUrls.length > 0
    ? branding.heroImageUrls.map((url, index) => ({
        id: `hero-banner-${index}`,
        imageUrl: url,
        description: `Hero Banner ${index + 1}`,
        imageHint: 'hero banner'
      }))
    : PlaceHolderImages.filter(p => p.id.startsWith('hero-'));

  const popularProducts = products.slice(0, 8);
  const hotDeals = products.filter(p => p.variations.some(v => v.originalPrice)).slice(0, 8);

  const ProductCarouselSkeleton = () => (
    <div className="flex space-x-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-[45%] sm:w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0">
          <Skeleton className="h-[250px] w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-4 md:py-6">
             {loading ? <Skeleton className="h-56 w-full" /> : <HeroCarousel images={heroImages} />}
          </section>

          <section className="py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight">Categories</h2>
              <Button variant="link" asChild>
                <Link href="/categories">See all</Link>
              </Button>
            </div>
             {loading ? (
                <div className="grid grid-cols-4 gap-4 md:hidden">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16 mt-2" />
                        </div>
                    ))}
                </div>
             ) : (
                <div className="md:hidden">
                  <CategoryGrid categories={categories.slice(0, 8)} />
                </div>
             )}
             {loading ? (
                <div className="hidden md:flex space-x-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-4 w-20 mt-2" />
                        </div>
                    ))}
                </div>
             ) : (
                <div className="hidden md:block">
                  <CategoryCarousel categories={categories} />
                </div>
             )}
          </section>

          <section className="py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">Hot Deals</h2>
                <Button variant="link" asChild>
                    <Link href="/categories">See all</Link>
                </Button>
            </div>
            {loading ? <ProductCarouselSkeleton /> : <ProductCarousel products={hotDeals} />}
          </section>

          <section className="py-6">
            <PromoGrid promos={promoItems} />
          </section>

          <section className="py-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">Popular Products</h2>
                 <Button variant="link" asChild>
                    <Link href="/categories">See all</Link>
                </Button>
            </div>
            {loading ? <ProductCarouselSkeleton /> : <ProductCarousel products={popularProducts} />}
          </section>

           <section className="py-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">All Products</h2>
                 <Button variant="link" asChild>
                    <Link href="/categories">See all</Link>
                </Button>
            </div>
             {loading ? <ProductCarouselSkeleton /> : <ProductCarousel products={products} />}
          </section>
        </div>
      </main>
    </div>
  );
}
