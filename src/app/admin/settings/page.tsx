
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { seedDatabase, saveBrandingSettings, getBrandingSettings, getAppSettings, saveApiKeys, saveStoreSettings } from './actions';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [isSavingApiKeys, setIsSavingApiKeys] = useState(false);
  const [isSavingStoreSettings, setIsSavingStoreSettings] = useState(false);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

  const [heroFiles, setHeroFiles] = useState<(File | null)[]>([null, null, null]);
  const [heroPreviews, setHeroPreviews] = useState<(string | null)[]>([null, null, null]);
  const [currentHeroUrls, setCurrentHeroUrls] = useState<string[]>([]);
  
  const [apiKeys, setApiKeys] = useState({
    googleMapsApiKey: '',
    phonePeApiKey: '',
    phonePeApiSecret: '',
  });

  const [storeSettings, setStoreSettings] = useState({
      storeName: 'SwiftShop',
      deliveryFee: 50,
  });

  useEffect(() => {
    async function fetchSettings() {
        const branding = await getBrandingSettings();
        if (branding?.logoUrl) {
            setCurrentLogoUrl(branding.logoUrl);
        }
        if (branding?.heroImageUrls) {
            setCurrentHeroUrls(branding.heroImageUrls);
        }

        const appSettings = await getAppSettings();
        if (appSettings?.apiKeys) {
            setApiKeys(current => ({...current, ...appSettings.apiKeys}));
        }
        if (appSettings?.storeSettings) {
            setStoreSettings(current => ({...current, ...appSettings.storeSettings}));
        }
    }
    fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...heroFiles];
      newFiles[index] = file;
      setHeroFiles(newFiles);

      const newPreviews = [...heroPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setHeroPreviews(newPreviews);
    }
  };
  
  const handleRemoveHeroImage = (index: number) => {
    const newFiles = [...heroFiles];
    newFiles[index] = null;
    setHeroFiles(newFiles);
    
    const newPreviews = [...heroPreviews];
    newPreviews[index] = null;
    setHeroPreviews(newPreviews);
    
    const newCurrentUrls = [...currentHeroUrls];
    newCurrentUrls[index] = '';
    setCurrentHeroUrls(newCurrentUrls);
  }

  const handleBrandingSave = async () => {
    setIsSavingBranding(true);
    
    const payload = {
        logo: logoFile,
        heroBanners: heroFiles
    };

    try {
      const result = await saveBrandingSettings(payload);
      if (result.success) {
        toast({
          title: "Branding Updated!",
          description: "Your new logo and hero banners have been saved.",
        });
        if (result.logoUrl) setCurrentLogoUrl(result.logoUrl);
        if (result.heroImageUrls) setCurrentHeroUrls(result.heroImageUrls as string[]);
        setLogoFile(null);
        setLogoPreview(null);
        setHeroFiles([null, null, null]);
        setHeroPreviews([null, null, null]);

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

  const handleApiKeysSave = async () => {
    setIsSavingApiKeys(true);
    try {
      const result = await saveApiKeys(apiKeys);
      if (result.success) {
        toast({ title: "API Keys Saved!", description: "Your API keys have been updated." });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Saving API Keys",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsSavingApiKeys(false);
    }
  };

  const handleStoreSettingsSave = async () => {
    setIsSavingStoreSettings(true);
    try {
      const result = await saveStoreSettings({
          ...storeSettings,
          deliveryFee: Number(storeSettings.deliveryFee)
      });
      if (result.success) {
        toast({ title: "Store Settings Saved!", description: "Your store settings have been updated." });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Saving Store Settings",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsSavingStoreSettings(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Database Seeded!",
          description: `${result.productCount} products, ${result.categoryCount} categories, and ${result.orderCount || 0} orders have been added.`,
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
                    <Label htmlFor="logo">Store Logo</Label>
                    <Input id="logo" type="file" onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)} />
                    {(logoPreview || currentLogoUrl) && (
                        <div className="mt-2 p-2 border rounded-md w-fit">
                            <Image src={logoPreview || currentLogoUrl!} alt="Logo preview" width={100} height={100} className="object-contain" />
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <Label>Hero Section Banners</Label>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="space-y-2">
                             <Label htmlFor={`hero-${index}`} className="text-sm font-normal">Banner {index + 1}</Label>
                             <div className="flex items-center gap-2">
                                <Input id={`hero-${index}`} type="file" onChange={(e) => handleHeroFileChange(e, index)} />
                                {(heroPreviews[index] || currentHeroUrls[index]) && (
                                    <Button size="icon" variant="ghost" onClick={() => handleRemoveHeroImage(index)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                )}
                             </div>
                             {(heroPreviews[index] || currentHeroUrls[index]) && (
                                <div className="mt-2 p-2 border rounded-md w-fit">
                                    <Image src={heroPreviews[index]! || currentHeroUrls[index]!} alt={`Banner ${index+1} preview`} width={200} height={100} className="object-cover rounded-md" />
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
                    <Input id="google-maps" placeholder="Enter your Google Maps API Key" value={apiKeys.googleMapsApiKey} onChange={e => setApiKeys({...apiKeys, googleMapsApiKey: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phonepe-key">PhonePe API Key</Label>
                    <Input id="phonepe-key" placeholder="Enter your PhonePe API Key" value={apiKeys.phonePeApiKey} onChange={e => setApiKeys({...apiKeys, phonePeApiKey: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phonepe-secret">PhonePe API Secret</Label>
                    <Input id="phonepe-secret" placeholder="Enter your PhonePe API Secret" value={apiKeys.phonePeApiSecret} onChange={e => setApiKeys({...apiKeys, phonePeApiSecret: e.target.value})} />
                </div>
                <Button onClick={handleApiKeysSave} disabled={isSavingApiKeys}>
                    {isSavingApiKeys && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
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
                    <Input id="store-name" value={storeSettings.storeName} onChange={e => setStoreSettings({...storeSettings, storeName: e.target.value})}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="delivery-fee">Delivery Fee</Label>
                    <Input id="delivery-fee" type="number" value={storeSettings.deliveryFee} onChange={e => setStoreSettings({...storeSettings, deliveryFee: Number(e.target.value)})} />
                </div>
                <Button onClick={handleStoreSettingsSave} disabled={isSavingStoreSettings}>
                    {isSavingStoreSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
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
