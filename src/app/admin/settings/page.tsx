

'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { seedDatabase, saveBrandingSettings, getBrandingSettings } from './actions';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroPreviews, setHeroPreviews] = useState<(string | null)[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFiles, setHeroFiles] = useState<(File | null)[]>([]);

  useEffect(() => {
    async function fetchSettings() {
        const settings = await getBrandingSettings();
        if (settings?.logoUrl) {
            setLogoPreview(settings.logoUrl);
        }
        if (settings?.heroImageUrls) {
            setHeroPreviews(settings.heroImageUrls);
        }
    }
    fetchSettings();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...heroFiles];
      newFiles[index] = file;
      setHeroFiles(newFiles);

      const newPreviews = [...heroPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setHeroPreviews(newPreviews);
    }
  };

  const handleBrandingSave = async () => {
    setIsSavingBranding(true);
    try {
      const result = await saveBrandingSettings({ logo: logoFile, heroBanners: heroFiles });
      if (result.success) {
        toast({
          title: "Branding Updated!",
          description: "Your new logo and hero banners have been saved.",
        });
        if (result.logoUrl) setLogoPreview(result.logoUrl);
        if (result.heroImageUrls) setHeroPreviews(result.heroImageUrls);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Saving Branding",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Database Seeded!",
          description: `${result.productCount} products, ${result.categoryCount} categories, and ${result.orderCount} orders have been added.`,
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
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Manage your store's logo and hero banners.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="logo-upload">Store Logo</Label>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} />
                    {logoPreview && (
                        <div className="mt-2 p-2 border rounded-md w-fit">
                            <Image src={logoPreview} alt="Logo preview" width={100} height={100} className="object-contain" />
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <Label>Hero Section Banners</Label>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="space-y-2">
                             <Label htmlFor={`hero-upload-${index}`} className="text-sm font-normal">Banner {index + 1}</Label>
                             <Input id={`hero-upload-${index}`} type="file" accept="image/*" onChange={(e) => handleHeroChange(e, index)} />
                             {heroPreviews[index] && (
                                <div className="mt-2 p-2 border rounded-md w-fit">
                                    <Image src={heroPreviews[index]!} alt={`Banner ${index+1} preview`} width={200} height={100} className="object-cover rounded-md" />
                                </div>
                             )}
                        </div>
                    ))}
                </div>
                <Button onClick={handleBrandingSave} disabled={isSavingBranding}>
                    {isSavingBranding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Branding
                </Button>
            </CardContent>
        </Card>

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
                    Click the button below to populate your Firestore database with the initial set of products, categories and orders. This can only be done once and may take a moment.
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
