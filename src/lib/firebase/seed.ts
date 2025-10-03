
// This file is no longer used for manual seeding via the UI.
// The logic has been moved to src/app/admin/settings/actions.ts
// You can delete this file or keep it for command-line usage if you fix the initial error.

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import * as serviceAccount from './service-account.json';

async function seed() {
    try {
        if (getApps().length === 0) {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
            });
        }
    } catch (e) {
        console.error("Firebase initialization failed. Make sure your service account credentials are set up correctly in src/lib/firebase/service-account.json");
        console.error(e);
        process.exit(1);
    }


    const db = getFirestore();

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
}

// To run this script, use: `npx tsx src/lib/firebase/seed.ts`
// Make sure you have tsx installed: `npm install -D tsx`
if (require.main === module) {
  seed().catch(error => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
}
