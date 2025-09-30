
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import * as serviceAccount from './service-account.json';

try {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccount as ServiceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
} catch (e) {
    console.error("Firebase initialization failed. Make sure your service account credentials are set up correctly in src/lib/firebase/service-account.json");
    console.error(e);
    process.exit(1);
}


const db = getFirestore();

async function seedDatabase() {
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

seedDatabase().catch(error => {
    console.error('Error seeding database:', error);
    process.exit(1);
});
