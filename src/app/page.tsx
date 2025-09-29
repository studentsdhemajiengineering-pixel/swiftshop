import Image from 'next/image';
import { allProducts, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { CategoryGrid } from '@/components/products/category-grid';
import { ProductGrid } from '@/components/products/product-grid';
import { RecommendationsCarousel } from '@/components/recommendations/recommendations-carousel';
import { ChatWidget } from '@/components/support/chat-widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  const heroImages = PlaceHolderImages.filter(p => p.id.startsWith('hero-'));

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-secondary/50">
          <Carousel
            opts={{
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent>
              {heroImages.map(image => (
                <CarouselItem key={image.id}>
                  <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      priority={heroImages.indexOf(image) === 0}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 text-center text-primary-foreground px-4">
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
            <CategoryGrid categories={categories} />
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
