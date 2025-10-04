
'use client';

import { getProduct } from '@/lib/firebase/service';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './_components/product-detail-client';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProduct(params.id) as Product | null;
      if (!fetchedProduct) {
        notFound();
      } else {
        setProduct(fetchedProduct);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);


  if (loading) {
    // You can return a loading skeleton here
    return <div>Loading...</div>;
  }
  
  if (!product) {
    // This case should be handled by notFound(), but as a fallback:
    return <div>Product not found.</div>;
  }

  return <ProductDetailClient product={product} />;
}
