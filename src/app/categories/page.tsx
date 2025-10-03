
'use client';

import { Header } from '@/components/layout/header';
import { getCategories } from '@/lib/firebase/service';
import type { Category } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight mb-6">All Categories</h1>
          {loading ? (
             <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 shadow-sm bg-muted animate-pulse" />
                        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
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
                        <p className="text-sm font-medium text-foreground group-hover:text-primary leading-tight">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
