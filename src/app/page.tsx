
import Image from 'next/image';
import { allProducts, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { CategoryGrid } from '@/components/products/category-grid';
import { ProductCarousel } from '@/components/products/product-carousel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PromoGrid } from '@/components/products/promo-grid';
import { promoItems } from '@/lib/promo-data';
import { CategoryCarousel } from '@/components/products/category-carousel';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main');
  const popularProducts = allProducts.slice(0, 8);
  const hotDeals = allProducts.filter(p => p.variations.some(v => v.originalPrice)).slice(0, 8);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-4 md:py-6">
             {heroImage && (
              <div className="relative w-full h-44 md:h-64 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              </div>
            )}
          </section>

          <section className="py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight">Categories</h2>
              <Button variant="link" asChild>
                <Link href="/categories">See all</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <CategoryGrid categories={categories.slice(0, 8)} />
            </div>
             <div className="hidden md:block">
              <CategoryCarousel categories={categories} />
            </div>
          </section>

          <section className="py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">Hot Deals</h2>
                <Button variant="link" asChild>
                    <Link href="/categories">See all</Link>
                </Button>
            </div>
            <ProductCarousel products={hotDeals} />
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
            <ProductCarousel products={popularProducts} />
          </section>

           <section className="py-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">All Products</h2>
                 <Button variant="link" asChild>
                    <Link href="/categories">See all</Link>
                </Button>
            </div>
            <ProductCarousel products={allProducts} />
          </section>
        </div>
      </main>
    </div>
  );
}
