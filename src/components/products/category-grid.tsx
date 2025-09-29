import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((category) => {
        const image = PlaceHolderImages.find((p) => p.id === category.imageId);
        return (
          <Link key={category.id} href={`/category/${category.id}`}>
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
        );
      })}
    </div>
  );
}
