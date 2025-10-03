
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Product, Category } from '@/lib/types';

export async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
    return productList;
}

export async function getProduct(id: string): Promise<Product | null> {
    const productDoc = doc(db, 'products', id);
    const productSnapshot = await getDoc(productDoc);
    if (productSnapshot.exists()) {
        return { ...productSnapshot.data(), id: productSnapshot.id } as Product;
    }
    return null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const productsCol = collection(db, 'products');
    // Firestore will auto-generate an ID
    const docRef = await addDoc(productsCol, product);
    return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productDoc = doc(db, 'products', id);
    await updateDoc(productDoc, product);
}

export async function deleteProduct(id: string): Promise<void> {
    const productDoc = doc(db, 'products', id);
    await deleteDoc(productDoc);
}


export async function getCategories(): Promise<Category[]> {
    const categoriesCol = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCol);
    const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    return categoryList;
}
