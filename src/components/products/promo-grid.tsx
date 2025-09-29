import Image from 'next/image';
import Link from 'next/link';
import type { Promo } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

interface PromoGridProps {
  promos: Promo[];
}

export function PromoGrid({ promos }: PromoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {promos.map((promo) => {
        const image = PlaceHolderImages.find((p) => p.id === promo.imageId);
        return (
          <Link key={promo.id} href={promo.href} className="group">
            <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
                <CardContent className='p-0'>
                    {image && (
                        <div className="relative w-full aspect-square">
                            <Image
                                src={image.imageUrl}
                                alt={promo.name}
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
