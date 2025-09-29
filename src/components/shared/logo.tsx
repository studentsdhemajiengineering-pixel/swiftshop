import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link href="/" className="flex items-center space-x-2" onClick={onClick}>
      <ShoppingBasket className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline text-foreground">
        SwiftShop
      </span>
    </Link>
  );
}
