
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (categories.length === 0) {
    return <p>No categories found.</p>;
  }
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {categories.map((category) => {
           const image = PlaceHolderImages.find((p) => p.id === category.imageId);
           return(
            <CarouselItem key={category.id} className="basis-1/4 md:basis-1/6 lg:basis-1/8">
                 <Link href={`/category/${category.id}`}>
                    <div className="group flex flex-col items-center justify-center text-center">
                        {image && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                    src={image.imageUrl}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
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
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
