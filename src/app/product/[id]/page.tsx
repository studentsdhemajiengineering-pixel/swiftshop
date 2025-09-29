
import { allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './_components/product-detail-client';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = allProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
