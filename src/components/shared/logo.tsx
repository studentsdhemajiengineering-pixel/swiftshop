
'use client';

import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { getBrandingSettings, getAppSettings } from '@/app/admin/settings/actions';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('SwiftShop');

  useEffect(() => {
    async function fetchSettings() {
      const branding = await getBrandingSettings();
      if (branding?.logoUrl) {
        setLogoUrl(branding.logoUrl);
      }
      
      const appSettings = await getAppSettings();
      if (appSettings?.storeSettings?.storeName) {
          setStoreName(appSettings.storeSettings.storeName);
      }
    }
    fetchSettings();
  }, []);

  return (
    <Link href="/" className="flex items-center space-x-2" onClick={onClick}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`${storeName} Logo`} width={32} height={32} />
      ) : (
        <ShoppingBasket className="h-8 w-8 text-primary" />
      )}
      <span className="text-2xl font-bold font-headline text-foreground">
        {storeName}
      </span>
    </Link>
  );
}
