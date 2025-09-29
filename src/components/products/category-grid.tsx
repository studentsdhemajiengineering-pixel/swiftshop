import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => {
        const image = PlaceHolderImages.find((p) => p.id === category.imageId);
        return (
          <Link key={category.id} href={`/category/${category.id}`}>
            <div className="group flex flex-col items-center justify-center text-center">
                {image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                        <Image
                            src={image.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                )}
              <p className="text-xs font-medium text-foreground group-hover:text-primary leading-tight">
                {category.name}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
