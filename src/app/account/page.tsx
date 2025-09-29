import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, MapPin, Plus } from 'lucide-react';

const AddressCard = ({ name, address, isDefault = false }: { name: string, address: string, isDefault?: boolean }) => (
    <Card className="flex items-start p-4 gap-4">
        <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
        <div className="flex-grow">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold">{name}</h4>
                {isDefault && <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</div>}
            </div>
            <p className="text-muted-foreground text-sm">{address}</p>
        </div>
        <Button variant="ghost" size="sm">Edit</Button>
    </Card>
)

export default function AccountPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
           <h1 className="text-4xl font-bold tracking-tight mb-8 font-headline">My Account</h1>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src="https://picsum.photos/seed/user/200" alt="User Name" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <CardTitle>User Name</CardTitle>
                        <CardDescription>username@example.com</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Edit Profile</Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Addresses</CardTitle>
                        <CardDescription>Add or edit your delivery locations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AddressCard 
                            name="Home" 
                            address="123 Greenfield Lane, Fresh Meadows, FM 12345" 
                            isDefault 
                        />
                        <AddressCard 
                            name="Work" 
                            address="456 Corporate Blvd, Suite 500, Business City, BC 67890" 
                        />
                        <Button variant="outline" className="w-full border-dashed">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Address
                        </Button>
                    </CardContent>
                </Card>
            </div>
           </div>
        </div>
      </main>
    </div>
  );
}
