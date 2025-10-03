
import { getProduct } from '@/lib/firebase/service';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './_components/product-detail-client';
import type { Product } from '@/lib/types';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id) as Product | null;

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
