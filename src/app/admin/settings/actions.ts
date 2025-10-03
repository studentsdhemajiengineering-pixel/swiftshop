
'use server';

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import productsData from '@/lib/data/products.json';
import categoriesData from '@/lib/data/categories.json';
import * as serviceAccount from '@/lib/firebase/service-account.json';

interface SeedResult {
    success: boolean;
    productCount?: number;
    categoryCount?: number;
    error?: string;
}

export async function seedDatabase(): Promise<SeedResult> {
    try {
        if (getApps().length === 0) {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
            });
        }
    } catch (e: any) {
        console.error("Firebase initialization failed:", e);
        return { success: false, error: "Firebase initialization failed. Check your service account credentials." };
    }

    const db = getFirestore();

    try {
        console.log('Starting to seed database...');

        // Seed Categories
        console.log('Seeding categories...');
        const categoriesBatch = db.batch();
        categoriesData.forEach(category => {
            const docRef = db.collection('categories').doc(category.id);
            categoriesBatch.set(docRef, category);
        });
        await categoriesBatch.commit();
        console.log(`${categoriesData.length} categories seeded.`);

        // Seed Products
        console.log('Seeding products...');
        const productsBatch = db.batch();
        productsData.forEach(product => {
            const docRef = db.collection('products').doc(product.id);
            productsBatch.set(docRef, product);
        });
        await productsBatch.commit();
        console.log(`${productsData.length} products seeded.`);

        console.log('Database seeding completed successfully!');
        return { 
            success: true, 
            productCount: productsData.length, 
            categoryCount: categoriesData.length 
        };
    } catch (error: any) {
        console.error('Error seeding database:', error);
        return { success: false, error: error.message || "An unknown error occurred during seeding." };
    }
}
