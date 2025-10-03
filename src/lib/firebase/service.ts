
'use client';

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import type { Product, Category, User } from '@/lib/types';
import { errorEmitter } from '@/components/firebase/error-emitter';
import { FirestorePermissionError } from '@/components/firebase/errors';

const { firestore, app } = initializeFirebase();
const storage: FirebaseStorage = getStorage(app);
const auth = getAuth(app);


export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function getProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        const productsCol = collection(firestore, 'products');
        onSnapshot(productsCol, 
            (snapshot) => {
                const productList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
                resolve(productList);
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: productsCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
            }
        );
    });
}

export async function getProduct(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
        const productDoc = doc(firestore, 'products', id);
        onSnapshot(productDoc,
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve({ ...snapshot.data(), id: snapshot.id } as Product);
                } else {
                    resolve(null);
                }
            },
            (error) => {
                 const permissionError = new FirestorePermissionError({
                    path: productDoc.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
            }
        );
    });
}

export function addProduct(product: Omit<Product, 'id'>) {
    const productsCol = collection(firestore, 'products');
    addDoc(productsCol, product).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: productsCol.path,
            operation: 'create',
            requestResourceData: product,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateProduct(id: string, product: Partial<Product>) {
    const productDoc = doc(firestore, 'products', id);
    updateDoc(productDoc, product).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'update',
            requestResourceData: product,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteProduct(id: string) {
    const productDoc = doc(firestore, 'products', id);
    deleteDoc(productDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: productDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}


export async function getCategories(): Promise<Category[]> {
     return new Promise((resolve, reject) => {
        const categoriesCol = collection(firestore, 'categories');
        onSnapshot(categoriesCol,
            (snapshot) => {
                const categoryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
                resolve(categoryList);
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: categoriesCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
            }
        );
    });
}

export function addCategory(category: Omit<Category, 'id'>) {
    const categoriesCol = collection(firestore, 'categories');
    addDoc(categoriesCol, category)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoriesCol.path,
            operation: 'create',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateCategory(id: string, category: Partial<Category>) {
    const categoryDoc = doc(firestore, 'categories', id);
    updateDoc(categoryDoc, category).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'update',
            requestResourceData: category,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteCategory(id: string) {
    const categoryDoc = doc(firestore, 'categories', id);
    deleteDoc(categoryDoc).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: categoryDoc.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

// User Management Functions
export async function getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        const usersCol = collection(firestore, 'users');
        onSnapshot(usersCol,
            (snapshot) => {
                const userList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
                resolve(userList);
            },
            (error) => {
                const permissionError = new FirestorePermissionError({
                    path: usersCol.path,
                    operation: 'list',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
            }
        );
    });
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
    return new Promise((resolve, reject) => {
        const userDoc = doc(firestore, 'users', id);
        onSnapshot(userDoc,
            (snapshot) => {
                if (snapshot.exists()) {
                    resolve({ ...snapshot.data(), id: snapshot.id } as User);
                } else {
                    resolve(null);
                }
            },
            (error) => {
                 const permissionError = new FirestorePermissionError({
                    path: userDoc.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                reject(permissionError);
            }
        );
    });
}
