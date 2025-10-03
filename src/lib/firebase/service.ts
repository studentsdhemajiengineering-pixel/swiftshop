

'use client';

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import type { Product, Category, User, Order } from '@/lib/types';
import { errorEmitter } from '@/components/firebase/error-emitter';
import { FirestorePermissionError } from '@/components/firebase/errors';

const { firestore, storage } = initializeFirebase();
const auth = getAuth(initializeFirebase().firebaseApp);


export async function uploadImage(file: File): Promise<string> {
    // Convert file to Base64 Data URL.
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export async function getBrandingSettings(): Promise<{logoUrl?: string, heroImageUrls?: string[]} | null> {
    return new Promise((resolve, reject) => {
        const settingsDoc = doc(firestore, 'settings', 'branding');
        const unsubscribe = onSnapshot(settingsDoc,
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve(snapshot.data() as {logoUrl?: string, heroImageUrls?: string[]});
                } else {
                    resolve(null);
                }
                unsubscribe();
            },
            (error) => {
                 const permissionError = new FirestorePermissionError({
                    path: settingsDoc.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
}

export async function getProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        const productsCol = collection(firestore, 'products');
        const unsubscribe = onSnapshot(productsCol, 
            (snapshot) => {
                const productList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
                resolve(productList);
                unsubscribe();
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: productsCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
}

export async function getProduct(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
        const productDoc = doc(firestore, 'products', id);
        const unsubscribe = onSnapshot(productDoc,
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve({ ...snapshot.data(), id: snapshot.id } as Product);
                } else {
                    resolve(null);
                }
                unsubscribe();
            },
            (error) => {
                 const permissionError = new FirestorePermissionError({
                    path: productDoc.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
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
     return new Promise((resolve, reject) => {
        const categoriesCol = collection(firestore, 'categories');
        const unsubscribe = onSnapshot(categoriesCol,
            (snapshot) => {
                const categoryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
                resolve(categoryList);
                unsubscribe();
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: categoriesCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
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
    return new Promise((resolve, reject) => {
        const ordersCol = collection(firestore, 'orders');
        const unsubscribe = onSnapshot(ordersCol, 
            (snapshot) => {
                const orderList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
                resolve(orderList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                unsubscribe();
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: ordersCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
}

export async function getOrder(id: string): Promise<Order | null> {
    return new Promise((resolve, reject) => {
        const orderDoc = doc(firestore, 'orders', id);
        const unsubscribe = onSnapshot(orderDoc,
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve({ ...snapshot.data(), id: snapshot.id } as Order);
                } else {
                    resolve(null);
                }
                unsubscribe();
            },
            (error) => {
                 const permissionError = new FirestorePermissionError({
                    path: orderDoc.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
                unsubscribe();
            }
        );
    });
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
