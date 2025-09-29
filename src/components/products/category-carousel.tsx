import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {categories.map((category) => {
          const image = PlaceHolderImages.find((p) => p.id === category.imageId);
          return (
            <CarouselItem key={category.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8">
              <Link href={`/category/${category.id}`}>
                <div className="group">
                  <Card className="overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                    <CardContent className="p-0 flex flex-col items-center justify-center">
                      {image && (
                         <Image
                          src={image.imageUrl}
                          alt={category.name}
                          width={200}
                          height={200}
                          className="aspect-square object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                    </CardContent>
                  </Card>
                  <p className="mt-2 text-center text-sm font-medium text-foreground group-hover:text-primary">
                    {category.name}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
