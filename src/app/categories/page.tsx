import { Header } from '@/components/layout/header';
import { CategoryGrid } from '@/components/products/category-grid';
import { categories } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.map((category) => {
              const image = PlaceHolderImages.find((p) => p.id === category.imageId);
              return (
                <Link key={category.id} href={`/category/${category.id}`} className="group">
                  <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      {image && (
                        <div className="relative w-full aspect-square">
                          <Image
                            src={image.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-center leading-tight group-hover:text-primary">
                          {category.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
