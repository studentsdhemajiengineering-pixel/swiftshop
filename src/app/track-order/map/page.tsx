
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Star } from 'lucide-react';

export default function OrderMapPage() {
    const mapImage = PlaceHolderImages.find(p => p.id === 'map-route');

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
                <div className="relative flex-grow">
                    {mapImage && (
                        <Image 
                            src={mapImage.imageUrl}
                            alt="Order delivery route map"
                            fill
                            className="object-cover"
                            data-ai-hint={mapImage.imageHint}
                        />
                    )}
                     <div className="absolute top-4 left-4 right-4">
                        <Card className="max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle>On the way!</CardTitle>
                                <CardDescription>Estimated arrival: <strong>6:30 PM</strong></CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
