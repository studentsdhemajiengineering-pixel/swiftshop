import Image from 'next/image';
import { allProducts, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { CategoryCarousel } from '@/components/products/category-carousel';
import { ProductGrid } from '@/components/products/product-grid';
import { RecommendationsCarousel } from '@/components/recommendations/recommendations-carousel';
import { ChatWidget } from '@/components/support/chat-widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh] bg-secondary/50">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-end pb-8 md:pb-12 text-center text-primary-foreground px-4">
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground font-headline">Groceries delivered in minutes</h1>
              <p className="mt-2 md:mt-4 max-w-lg mx-auto text-md md:text-xl text-muted-foreground">
                Fresh ingredients, snacks, and essentials right to your door.
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="relative">
                  <Input placeholder="Search for products..." className="h-12 text-lg pr-12 bg-background" />
                  <Button size="icon" className="absolute top-1/2 right-2 -translate-y-1/2" aria-label="Search">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-8 md:py-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">Shop by Category</h2>
            <CategoryCarousel categories={categories} />
          </section>

          <section className="py-8 md:py-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">Recommended for You</h2>
            <RecommendationsCarousel allProducts={allProducts} />
          </section>

          <section className="py-8 md:py-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">All Products</h2>
            <ProductGrid products={allProducts} />
          </section>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
