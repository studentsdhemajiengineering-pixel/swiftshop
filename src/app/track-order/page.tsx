import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home, Package, ClipboardList, Truck } from 'lucide-react';

const TrackingStep = ({ icon: Icon, title, description, isCompleted, isLast = false }: { icon: React.ElementType, title: string, description: string, isCompleted: boolean, isLast?: boolean }) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        <Icon className="h-6 w-6" />
      </div>
      {!isLast && <div className={`w-0.5 flex-grow ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />}
    </div>
    <div className={`pb-12 pt-1 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);


export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
             <h1 className="text-4xl font-bold tracking-tight font-headline">Track Your Order</h1>
             <p className="mt-2 text-lg text-muted-foreground">Order #SW123456789</p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Estimated Delivery: Today, 6:30 PM</CardTitle>
                <CardDescription>Your order is on its way!</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-0">
                    <TrackingStep icon={ClipboardList} title="Order Placed" description="We've received your order. (4:15 PM)" isCompleted />
                    <TrackingStep icon={Package} title="Order Packed" description="Your items are being packed. (4:25 PM)" isCompleted />
                    <TrackingStep icon={Truck} title="Out for Delivery" description="Your rider is on the way. (4:30 PM)" isCompleted />
                    <TrackingStep icon={Home} title="Delivered" description="Enjoy your groceries!" isCompleted={false} isLast />
                </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Having issues with your order?</p>
            <Button variant="link" asChild>
                <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
