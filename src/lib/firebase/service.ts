
'use client';

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import type { Product, Category, User, Order } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// This ensures Firebase is initialized on the client before these functions are called.
const getFirebaseServices = () => initializeFirebase();

export async function getProducts(): Promise<Product[]> {
    const { firestore } = getFirebaseServices();
    const productsCol = collection(firestore, 'products');
    try {
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
     const { firestore } = getFirebaseServices();
     const productDocRef = doc(firestore, 'products', id);
     try {
        const snapshot = await getDoc(productDocRef);
        if (snapshot.exists()) {
            return { ...snapshot.data(), id: snapshot.id } as Product;
        }
        return null;
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: productDocRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export function addProduct(product: Omit<Product, 'id'>) {
    const { firestore } = getFirebaseServices();
    const productsCol = collection(firestore, 'products');
    const newProductData = {
        ...product,
        variations: product.variations.map((v, index) => ({
            ...v,
            id: v.id.startsWith('new-') ? `${Date.now()}-${index}` : v.id
        }))
    };
    addDoc(productsCol, newProductData).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: productsCol.path,
            operation: 'create',
            requestResourceData: newProductData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateProduct(id: string, product: Partial<Product>) {
    const { firestore } = getFirebaseServices();
    const productDoc = doc(firestore, 'products', id);
    const updatedProductData = {
        ...product,
        variations: product.variations?.map((v, index) => ({
            ...v,
            id: v.id.startsWith('new-') ? `${id}-${Date.now()}-${index}` : v.id
        }))
    };
     updateDoc(productDoc, updatedProductData).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'update',
            requestResourceData: updatedProductData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteProduct(id: string) {
    const { firestore } = getFirebaseServices();
    const productDoc = doc(firestore, 'products', id);
    deleteDoc(productDoc).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}


export async function getCategories(): Promise<Category[]> {
    const { firestore } = getFirebaseServices();
    const categoriesCol = collection(firestore, 'categories');
    try {
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

export function addCategory(category: Omit<Category, 'id'>) {
    const { firestore } = getFirebaseServices();
    const categoriesCol = collection(firestore, 'categories');
    addDoc(categoriesCol, category).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: categoriesCol.path,
            operation: 'create',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateCategory(id: string, category: Partial<Category>) {
    const { firestore } = getFirebaseServices();
    const categoryDoc = doc(firestore, 'categories', id);
    updateDoc(categoryDoc, category).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'update',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteCategory(id: string) {
    const { firestore } = getFirebaseServices();
    const categoryDoc = doc(firestore, 'categories', id);
    deleteDoc(categoryDoc).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function getOrders(): Promise<Order[]> {
    const { firestore, auth } = getFirebaseServices();
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
    const { firestore, auth } = getFirebaseServices();
    const orderDocRef = doc(firestore, 'orders', id);
    try {
        const snapshot = await getDoc(orderDocRef);
        if (snapshot.exists()) {
            // Security check
            const currentUser = auth.currentUser;
            const orderData = snapshot.data() as Order;
            if (currentUser?.email === 'admin@swiftshop.com' || orderData.userId === currentUser?.uid) {
                 return { ...orderData, id: snapshot.id };
            } else {
                 const permissionError = new FirestorePermissionError({
                    path: `orders/${id}`,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                throw permissionError;
            }
        }
        return null;
    } catch (error) {
         if (error instanceof FirestorePermissionError) throw error;
         const permissionError = new FirestorePermissionError({
            path: `orders/${id}`,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export function addOrder(order: Omit<Order, 'id'>) {
    const { firestore } = getFirebaseServices();
    const ordersCol = collection(firestore, 'orders');
    addDoc(ordersCol, order).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: ordersCol.path,
            operation: 'create',
            requestResourceData: order,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateOrder(id: string, orderUpdate: Partial<Order>) {
    const { firestore } = getFirebaseServices();
    const orderDoc = doc(firestore, 'orders', id);
    updateDoc(orderDoc, orderUpdate).catch(serverError => {
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
    const { firestore } = getFirebaseServices();
    const usersCol = collection(firestore, 'users');
    try {
        const snapshot = await getDocs(usersCol);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: usersCol.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export function addUser(user: Omit<User, 'id'>) {
    const { firestore } = getFirebaseServices();
    const usersCol = collection(firestore, 'users');
    addDoc(usersCol, user).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: usersCol.path,
            operation: 'create',
            requestResourceData: user,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateUser(id: string, user: Partial<User>) {
    const { firestore } = getFirebaseServices();
    const userDoc = doc(firestore, 'users', id);
    updateDoc(userDoc, user).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: userDoc.path,
            operation: 'update',
            requestResourceData: user,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteUser(id: string) {
    const { firestore } = getFirebaseServices();
    const userDoc = doc(firestore, 'users', id);
    deleteDoc(userDoc).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: userDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function getUser(id: string): Promise<User | null> {
    const { firestore } = getFirebaseServices();
    const userDocRef = doc(firestore, 'users', id);
    try {
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
            return { ...snapshot.data(), id: snapshot.id } as User;
        }
        return null;
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}
