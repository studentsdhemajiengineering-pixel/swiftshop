
'use client';

import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { getBrandingSettings } from '@/lib/firebase/service';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      const settings = await getBrandingSettings();
      if (settings?.logoUrl) {
        setLogoUrl(settings.logoUrl);
      }
    }
    fetchLogo();
  }, []);

  return (
    <Link href="/" className="flex items-center space-x-2" onClick={onClick}>
      {logoUrl ? (
        <Image src={logoUrl} alt="SwiftShop Logo" width={32} height={32} />
      ) : (
        <ShoppingBasket className="h-8 w-8 text-primary" />
      )}
      <span className="text-2xl font-bold font-headline text-foreground">
        SwiftShop
      </span>
    </Link>
  );
}
