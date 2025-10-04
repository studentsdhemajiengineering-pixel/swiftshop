

'use server';

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import productsData from '@/lib/data/products.json';
import categoriesData from '@/lib/data/categories.json';
import ordersData from '@/lib/data/orders.json';
import * as serviceAccount from '@/lib/firebase/service-account.json';

interface SeedResult {
    success: boolean;
    productCount?: number;
    categoryCount?: number;
    orderCount?: number;
    error?: string;
}

interface BrandingSettingsPayload {
    logo: File | null;
    heroBanners: (File | null)[];
}

interface BrandingSettingsResult {
    success: boolean;
    logoUrl?: string;
    heroImageUrls?: (string | null)[];
    error?: string;
}

// A simple check to see if the service account is populated
// The default service-account.json is an empty object
const isServiceAccountPopulated = Object.keys(serviceAccount).length > 0;

function initializeAdminApp() {
    if (!isServiceAccountPopulated) {
        throw new Error("Firebase service account credentials are not configured in src/lib/firebase/service-account.json.");
    }

    if (getApps().length === 0) {
        try {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
                storageBucket: `${(serviceAccount as any).project_id}.appspot.com`,
            });
        } catch (e: any) {
            console.error("Firebase initialization failed:", e);
            throw new Error("Firebase initialization failed. Check your service account credentials.");
        }
    }
    return {
        db: getFirestore(),
        storage: getStorage(),
    };
}

export async function saveBrandingSettings(payload: BrandingSettingsPayload): Promise<BrandingSettingsResult> {
    const { db, storage } = initializeAdminApp();
    
    let logoUrl: string | undefined = undefined;
    const heroImageUrls: (string | null)[] = [];

    try {
        if (payload.logo) {
            const logoRef = storage.bucket().file(`settings/logo/${payload.logo.name}`);
            await logoRef.save(Buffer.from(await payload.logo.arrayBuffer()));
            logoUrl = (await logoRef.getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];
        }

        for (let i = 0; i < payload.heroBanners.length; i++) {
            const file = payload.heroBanners[i];
            if (file) {
                const heroRef = storage.bucket().file(`settings/hero/${file.name}`);
                await heroRef.save(Buffer.from(await file.arrayBuffer()));
                const url = (await heroRef.getSignedUrl({ action: 'read', expires: '03-09-2491' }))[0];
                heroImageUrls.push(url);
            } else {
                 heroImageUrls.push(null);
            }
        }
        
        const settingsRef = db.collection('settings').doc('branding');
        const currentSettings = (await settingsRef.get()).data() || {};
        
        const dataToUpdate: any = {};
        if (logoUrl) dataToUpdate.logoUrl = logoUrl;
        
        // This logic ensures we only update banners that were changed, preserving old ones.
        const finalHeroUrls = currentSettings.heroImageUrls || [];
        heroImageUrls.forEach((url, index) => {
            if (url) {
                finalHeroUrls[index] = url;
            }
        });
        dataToUpdate.heroImageUrls = finalHeroUrls;

        await settingsRef.set(dataToUpdate, { merge: true });

        return {
            success: true,
            logoUrl: dataToUpdate.logoUrl || currentSettings.logoUrl,
            heroImageUrls: dataToUpdate.heroImageUrls
        };
    } catch (error: any) {
        console.error('Error saving branding settings:', error);
        return { success: false, error: error.message || "An unknown error occurred during save." };
    }
}


export async function getBrandingSettings(): Promise<{logoUrl?: string, heroImageUrls?: string[]} | null> {
     try {
        const { db } = initializeAdminApp();
        const doc = await db.collection('settings').doc('branding').get();
        if (doc.exists) {
            return doc.data() as {logoUrl?: string, heroImageUrls?: string[]};
        }
        return null;
    } catch (error) {
        console.error("Error fetching branding settings:", error);
        return null;
    }
}


export async function seedDatabase(): Promise<SeedResult> {
    const { db } = initializeAdminApp();

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
        
        // Seed Orders
        console.log('Seeding orders...');
        const ordersBatch = db.batch();
        ordersData.forEach(order => {
            const docRef = db.collection('orders').doc(order.id);
            ordersBatch.set(docRef, order);
        });
        await ordersBatch.commit();
        console.log(`${ordersData.length} orders seeded.`);

        console.log('Database seeding completed successfully!');
        return { 
            success: true, 
            productCount: productsData.length, 
            categoryCount: categoriesData.length,
            orderCount: ordersData.length
        };
    } catch (error: any) {
        console.error('Error seeding database:', error);
        return { success: false, error: error.message || "An unknown error occurred during seeding." };
    }
}
