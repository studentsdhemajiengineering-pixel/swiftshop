
import Image from 'next/image';
import { allProducts, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { CategoryGrid } from '@/components/products/category-grid';
import { ProductGrid } from '@/components/products/product-grid';
import { RecommendationsCarousel } from '@/components/recommendations/recommendations-carousel';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main');
  const popularProducts = allProducts.slice(0, 4);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-4">
             {heroImage && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg">
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
            <h2 className="text-xl font-bold tracking-tight mb-4">Categories</h2>
            <CategoryGrid categories={categories} />
          </section>

          <section className="py-6">
            <h2 className="text-xl font-bold tracking-tight mb-4">For You</h2>
            <RecommendationsCarousel allProducts={allProducts} />
          </section>

          <section className="py-6">
            <h2 className="text-xl font-bold tracking-tight mb-4">Popular Products</h2>
            <ProductGrid products={popularProducts} />
          </section>

           <section className="py-6">
            <h2 className="text-xl font-bold tracking-tight mb-4">All Products</h2>
            <ProductGrid products={allProducts} />
          </section>
        </div>
      </main>
    </div>
  );
}
