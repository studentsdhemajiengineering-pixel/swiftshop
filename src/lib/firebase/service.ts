
'use client';

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import type { Product, Category, User, Order } from '@/lib/types';
import { errorEmitter } from '@/components/firebase/error-emitter';
import { FirestorePermissionError } from '@/components/firebase/errors';

const { firestore, storage, firebaseApp } = initializeFirebase();
const auth = getAuth(firebaseApp);


export async function uploadImage(file: File): Promise<string> {
    // Convert file to Base64 Data URL.
    return new Promise((resolve, reject) => {
        if (file.size > 1024 * 1024) { // 1MB limit
            return reject(new Error("Image size exceeds 1MB limit."));
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export async function getBrandingSettings(): Promise<{logoUrl?: string, heroImageUrls?: string[]} | null> {
    try {
        const settingsDoc = doc(firestore, 'settings', 'branding');
        const snapshot = await getDoc(settingsDoc);
        if (snapshot.exists()) {
            return snapshot.data() as {logoUrl?: string, heroImageUrls?: string[]};
        }
        return null;
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: 'settings/branding',
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getProducts(): Promise<Product[]> {
    try {
        const productsCol = collection(firestore, 'products');
        const snapshot = await getDocs(productsCol);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getProduct(id: string): Promise<Product | null> {
     try {
        const productDoc = doc(firestore, 'products', id);
        const snapshot = await getDoc(productDoc);
        if (snapshot.exists()) {
            return { ...snapshot.data(), id: snapshot.id } as Product;
        }
        return null;
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: `products/${id}`,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function addProduct(product: Omit<Product, 'id'>) {
    const productsCol = collection(firestore, 'products');
    const newProductData = {
        ...product,
        variations: product.variations.map((v, index) => ({
            ...v,
            id: v.id.startsWith('new-') ? `${Date.now()}-${index}` : v.id
        }))
    };
    try {
        await addDoc(productsCol, newProductData);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: productsCol.path,
            operation: 'create',
            requestResourceData: newProductData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function updateProduct(id: string, product: Partial<Product>) {
    const productDoc = doc(firestore, 'products', id);
    const updatedProductData = {
        ...product,
        variations: product.variations?.map((v, index) => ({
            ...v,
            id: v.id.startsWith('new-') ? `${id}-${Date.now()}-${index}` : v.id
        }))
    };
     try {
        await updateDoc(productDoc, updatedProductData)
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'update',
            requestResourceData: updatedProductData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function deleteProduct(id: string) {
    const productDoc = doc(firestore, 'products', id);
    try {
        await deleteDoc(productDoc);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}


export async function getCategories(): Promise<Category[]> {
    try {
        const categoriesCol = collection(firestore, 'categories');
        const snapshot = await getDocs(categoriesCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: 'categories',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function addCategory(category: Omit<Category, 'id'>) {
    const categoriesCol = collection(firestore, 'categories');
    try {
        await addDoc(categoriesCol, category);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: categoriesCol.path,
            operation: 'create',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function updateCategory(id: string, category: Partial<Category>) {
    const categoryDoc = doc(firestore, 'categories', id);
    try {
        await updateDoc(categoryDoc, category);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'update',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function deleteCategory(id: string) {
    const categoryDoc = doc(firestore, 'categories', id);
    try {
        await deleteDoc(categoryDoc);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getOrders(): Promise<Order[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return [];
    }
    
    const ordersCol = collection(firestore, 'orders');
    
    const isAdmin = currentUser.email === 'admin@swiftshop.com';
    const ordersQuery = isAdmin 
        ? ordersCol
        : query(ordersCol, where("userId", "==", currentUser.uid));

    try {
        const snapshot = await getDocs(ordersQuery);
        const orderList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        return orderList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: 'orders',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getOrder(id: string): Promise<Order | null> {
    try {
        const orderDoc = doc(firestore, 'orders', id);
        const snapshot = await getDoc(orderDoc);
        if (snapshot.exists()) {
            // Security check
            const currentUser = auth.currentUser;
            const orderData = snapshot.data() as Order;
            if (currentUser?.email === 'admin@swiftshop.com' || orderData.userId === currentUser?.uid) {
                 return { ...orderData, id: snapshot.id };
            } else {
                 throw new Error("You don't have permission to view this order.");
            }
        }
        return null;
    } catch (error) {
         const permissionError = new FirestorePermissionError({
            path: `orders/${id}`,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function addOrder(order: Omit<Order, 'id'>) {
    const ordersCol = collection(firestore, 'orders');
    try {
        await addDoc(ordersCol, order);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: ordersCol.path,
            operation: 'create',
            requestResourceData: order,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export function updateOrder(id: string, orderUpdate: Partial<Order>) {
    const orderDoc = doc(firestore, 'orders', id);
    updateDoc(orderDoc, orderUpdate).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: orderDoc.path,
            operation: 'update',
            requestResourceData: orderUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}


// User Management Functions
export async function getUsers(): Promise<User[]> {
    const usersCol = collection(firestore, 'users');
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
}

export function addUser(user: Omit<User, 'id'>) {
    const usersCol = collection(firestore, 'users');
    addDoc(usersCol, user).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: usersCol.path,
            operation: 'create',
            requestResourceData: user,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateUser(id: string, user: Partial<User>) {
    const userDoc = doc(firestore, 'users', id);
    updateDoc(userDoc, user).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDoc.path,
            operation: 'update',
            requestResourceData: user,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteUser(id: string) {
    const userDoc = doc(firestore, 'users', id);
    deleteDoc(userDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function getUser(id: string): Promise<User | null> {
    const userDoc = doc(firestore, 'users', id);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
        return { ...snapshot.data(), id: snapshot.id } as User;
    }
    return null;
}
