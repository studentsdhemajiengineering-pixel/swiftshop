
'use client';

import type { Category } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  if (categories.length === 0) {
    return <p>No categories found.</p>;
  }
  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/4 md:basis-1/6 lg:basis-1/8">
                 <Link href={`/category/${category.id}`}>
                    <div className="group flex flex-col items-center justify-center text-center">
                        {category.imageUrl && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                    src={category.imageUrl}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                      <p className="text-sm font-medium text-foreground group-hover:text-primary leading-tight">
                        {category.name}
                      </p>
                    </div>
                  </Link>
            </CarouselItem>
           )
        )}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
