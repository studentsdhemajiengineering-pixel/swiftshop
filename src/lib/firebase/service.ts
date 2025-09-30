
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Category } from '@/lib/types';

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProduct(id: string): Promise<Product | null> {
    const productDoc = doc(db, 'products', id);
    const productSnapshot = await getDoc(productDoc);
    if (productSnapshot.exists()) {
        return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
    }
    return null;
}

export async function getCategories(): Promise<Category[]> {
    const categoriesCol = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCol);
    const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    return categoryList;
}
