
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

// IMPORTANT: Replace with your service account credentials
// 1. Go to your Firebase Project Settings -> Service accounts.
// 2. Click "Generate new private key".
// 3. Save the downloaded JSON file in your project root (but DO NOT commit it to git).
// 4. Create a .env.local file and add:
//    GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-file.json"
// You can also paste the object directly here, but using environment variables is safer.

try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_CONFIG) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_CONFIG environment variable must be set.");
    }
    
    if (getApps().length === 0) {
        initializeApp({
            credential: process.env.GOOGLE_APPLICATION_CREDENTIALS ? cert(process.env.GOOGLE_APPLICATION_CREDENTIALS) : undefined,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
} catch (e) {
    console.error("Firebase initialization failed. Make sure your service account credentials are set up correctly.");
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
