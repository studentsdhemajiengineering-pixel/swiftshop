
import { Header } from '@/components/layout/header';
import { categories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight mb-6">All Categories</h1>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
            {categories.map((category) => {
              const image = PlaceHolderImages.find((p) => p.id === category.imageId);
              return (
                 <Link key={category.id} href={`/category/${category.id}`}>
                    <div className="group flex flex-col items-center justify-center text-center">
                        {image && (
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
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
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
