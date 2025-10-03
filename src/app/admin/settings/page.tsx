
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { seedDatabase } from './actions';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Database Seeded!",
          description: `${result.productCount} products and ${result.categoryCount} categories have been added.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Seeding Database",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for third-party services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="google-maps">Google Maps API Key</Label>
                    <Input id="google-maps" placeholder="Enter your Google Maps API Key" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phonepe-key">PhonePe API Key</Label>
                    <Input id="phonepe-key" placeholder="Enter your PhonePe API Key" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phonepe-secret">PhonePe API Secret</Label>
                    <Input id="phonepe-secret" placeholder="Enter your PhonePe API Secret" />
                </div>
                <Button>Save Changes</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Manage general store settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" defaultValue="SwiftShop" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="delivery-fee">Delivery Fee</Label>
                    <Input id="delivery-fee" type="number" defaultValue="50" />
                </div>
                <Button>Save Changes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>Manage your store's data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Click the button below to populate your Firestore database with the initial set of products and categories. This can only be done once and may take a moment.
                </p>
                <Button onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Seed Database
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
