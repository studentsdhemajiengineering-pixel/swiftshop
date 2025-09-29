
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
    const riderImage = PlaceHolderImages.find(p => p.id === 'rider-avatar');

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
                <div className="bg-background p-4 border-t">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-4">
                           <div className="flex items-center gap-4">
                                {riderImage && (
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={riderImage.imageUrl} alt="Delivery Rider"/>
                                        <AvatarFallback>DR</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-grow">
                                    <h3 className="font-semibold">Alex Ray</h3>
                                    <p className="text-sm text-muted-foreground">Your delivery partner</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>4.9</span>
                                        <span className="text-muted-foreground">(251 ratings)</span>
                                    </div>
                                </div>
                                <Button size="icon" variant="outline">
                                    <Phone />
                                </Button>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
