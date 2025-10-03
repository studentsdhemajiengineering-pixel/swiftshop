
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <div className="group flex flex-col items-center justify-center text-center">
              {category.imageUrl && (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                      <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                      />
                  </div>
              )}
            <p className="text-xs font-medium text-foreground group-hover:text-primary leading-tight">
              {category.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
