

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import ordersData from '../data/orders.json';
import * as serviceAccount from './service-account.json';

// A simple check to see if the service account is populated
// The default service-account.json is an empty object
const isServiceAccountPopulated = Object.keys(serviceAccount).length > 0;

async function seed() {
    if (!isServiceAccountPopulated) {
        console.error("Firebase service account credentials are not configured in src/lib/firebase/service-account.json. Please add your credentials there.");
        process.exit(1);
    }
    
    try {
        if (getApps().length === 0) {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
            });
        }
    } catch (e) {
        console.error("Firebase initialization failed. Make sure your service account credentials in src/lib/firebase/service-account.json are correct.");
        console.error(e);
        process.exit(1);
    }

    const db = getFirestore();

    console.log('Starting to seed database...');

    // Seed Categories
    try {
        console.log('Seeding categories...');
        const categoriesBatch = db.batch();
        categoriesData.forEach(category => {
            const docRef = db.collection('categories').doc(category.id);
            categoriesBatch.set(docRef, category);
        });
        await categoriesBatch.commit();
        console.log(`${categoriesData.length} categories seeded successfully.`);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }

    // Seed Products
    try {
        console.log('Seeding products...');
        const productsBatch = db.batch();
        productsData.forEach(product => {
            const docRef = db.collection('products').doc(product.id);
            productsBatch.set(docRef, product);
        });
        await productsBatch.commit();
        console.log(`${productsData.length} products seeded successfully.`);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }

    // Seed Orders
    try {
        console.log('Seeding orders...');
        const ordersBatch = db.batch();
        ordersData.forEach(order => {
            const docRef = db.collection('orders').doc(order.id);
            ordersBatch.set(docRef, order);
        });
        await ordersBatch.commit();
        console.log(`${ordersData.length} orders seeded successfully.`);
    } catch (error) {
        console.error('Error seeding orders:', error);
        process.exit(1);
    }

    console.log('Database seeding completed successfully!');
}

// To run this script, use: `npm run db:seed`
// Make sure you have tsx installed: `npm install -D tsx`
if (require.main === module) {
  seed().catch(error => {
    console.error('An unexpected error occurred during seeding:', error);
    process.exit(1);
  });
}

    