'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/hooks/use-cart';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { purchaseHistory } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface RecommendationsCarouselProps {
  allProducts: Product[];
}

export function RecommendationsCarousel({ allProducts }: RecommendationsCarouselProps) {
  const { state } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const cartItemsNames = useMemo(() => state.cart.map((item) => item.name), [state.cart]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const result = await getPersonalizedRecommendations({
          purchaseHistory,
          currentCart: cartItemsNames,
        });

        const recommendedProducts = result.recommendations
          .map((name) => allProducts.find((p) => p.name === name))
          .filter((p): p is Product => p !== undefined)
          // Exclude items already in the cart
          .filter((p) => !cartItemsNames.includes(p.name))
          .slice(0, 8); // Limit to 8 recommendations

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cartItemsNames, allProducts]);

  if (loading) {
    return (
      <div className="flex space-x-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0">
            <Skeleton className="h-[350px] w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {recommendations.map((product) => (
          <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
