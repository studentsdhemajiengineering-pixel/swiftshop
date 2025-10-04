# SwiftShop - Full-Stack Grocery Delivery Platform

SwiftShop is a modern, feature-rich, and scalable e-commerce platform for online grocery stores. It provides a seamless shopping experience for customers and a powerful administrative dashboard for store owners to manage their business efficiently.

## 1. Key Features

### Customer-Facing Application
- **Dynamic Homepage**: Engaging homepage featuring a hero carousel, browsable categories, and horizontally scrolling carousels for "Hot Deals" and "Popular Products".
- **Product Discovery**: Users can browse products by category or view all products.
- **Detailed Product Pages**: Each product has a dedicated page with multiple images, a detailed description, and options for different product variations (e.g., 500g vs 1kg).
- **Shopping Cart**: Fully persistent shopping cart with functionality to add, remove, and update item quantities.
- **User Authentication**: Secure and simple OTP-based login using a phone number.
- **Seamless Checkout**: Multi-step checkout process to collect delivery address, preferred delivery date/time, and payment method (Cash on Delivery & PhonePe).
- **Order Tracking**: A dedicated section for users to track their current orders and view their history of delivered orders.
- **Comprehensive Account Management**:
    - **Profile**: View and edit user profile information.
    - **Saved Addresses**: Add, edit, and delete multiple delivery addresses.
    - **Wishlist**: Save favorite products for later.
    - **Notifications**: Manage notification preferences.
    - **Payment Methods**: Manage saved payment options.
    - **Help & Support**: Access FAQs and contact options.
- **Responsive Design**: Fully optimized for both mobile and desktop devices.

### Admin Panel
- **Secure Admin Login**: Separate, secure login for administrators.
- **Analytics Dashboard**: An at-a-glance view of key business metrics like total revenue, sales, and new orders.
- **Product Management (CRUD)**: Full capabilities to create, read, update, and delete products and their variations (e.g., price, inventory, unit).
- **Category Management (CRUD)**: Full capabilities to create, read, update, and delete product categories.
- **Order Management**: View a list of all customer orders, filter them, and update their status (e.g., Preparing, Out for Delivery, Delivered).
- **Customer Management**: View a list of all registered customers and inspect their details and order history.
- **Store Settings**:
    - **Branding**: Easily update the store's logo and homepage hero banners by providing image URLs.
    - **API Keys**: Centrally manage third-party API keys (e.g., Google Maps, PhonePe).
    - **Store Configuration**: Set the store name and delivery fees.
    - **Database Seeding**: A one-click utility to populate the database with initial sample data for products, categories, and orders.

## 2. Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI for a professional and modern component library.
- **Backend Services**: Firebase (Authentication, Firestore Database, Storage)
- **Generative AI**: Genkit for AI-powered features like personalized recommendations.
- **Deployment**: Firebase App Hosting

## 3. Server Requirements & Deployment

The application is built to run serverlessly on modern cloud platforms, eliminating the need to manage traditional servers.

### Recommended Deployment (Free Tier)
**Firebase App Hosting** is the recommended and most straightforward way to deploy this application. It's designed to work seamlessly with the Next.js framework and the Firebase backend.

**Steps to Deploy:**
1.  **Install Firebase CLI**: If you don't have it, install it on your local machine: `npm install -g firebase-tools`
2.  **Login to Firebase**: Run `firebase login` and follow the prompts.
3.  **Initialize Firebase in your Project**: Run `firebase init` in your project root. Select "App Hosting" and connect it to the Firebase project associated with this app.
4.  **Deploy**: Run the command `firebase apphosting:backends:deploy`. This will build your Next.js application and deploy it to Firebase App Hosting.

The free "Spark" plan for Firebase is very generous and is sufficient for development, testing, and small-scale applications.

### Production Deployment (Paid)
For a production environment with higher traffic, you will need to upgrade your Firebase project to the "Blaze" (Pay-as-you-go) plan. This provides:
- Higher database read/write/delete limits.
- Increased cloud function invocations.
- More storage capacity.
- The ability to scale automatically to handle any amount of traffic.

The deployment process remains the same. The Blaze plan ensures your application can grow with your business without hitting service limits.

## 4. Selling this System to a Client (White-Labeling)

To rebrand and sell this platform to a client, you will need to perform the following steps:

1.  **Create a New Firebase Project for the Client**: Each client must have their own dedicated Firebase project. This ensures data isolation and security.

2.  **Configure Firebase Authentication**:
    - In the new Firebase project, navigate to the **Authentication** section.
    - Go to the **Sign-in method** tab.
    - Enable the **Phone** provider. This is crucial for the OTP-based login to work.
    - **Important**: For production apps, you must configure the **reCAPTCHA** settings in Firebase to prevent abuse. Follow Firebase's documentation to link your project with the reCAPTCHA Enterprise API.

3.  **Update Firebase Configuration in Code**:
    - In the client's Firebase project settings, find your web app and copy the `firebaseConfig` object.
    - Replace the contents of `src/firebase/config.ts` with the new client-specific configuration.

4.  **Generate a Service Account Key**:
    - In the client's Firebase project, go to `Project settings > Service accounts`.
    - Generate a new private key and download the JSON file.
    - **Crucially**, replace the contents of `src/lib/firebase/service-account.json` with the contents of the newly downloaded key file. This grants the admin panel the necessary server-side permissions.

5.  **Set Up Payment Gateway (PhonePe)**:
    - The client needs to sign up for a **PhonePe Merchant Account**.
    - Once approved, they will receive an **API Key** and **API Secret**.
    - These credentials must be entered into the admin panel under `Settings > API Keys`. The "Cash on Delivery" option requires no setup.

6.  **Deploy the Application**: Deploy the updated application code to a hosting service, preferably Firebase App Hosting, linked to the client's new Firebase project.

7.  **Configure Admin Settings**:
    - Once deployed, log into the admin panel (the default admin user is `admin@swiftshop.com` with password `password`).
    - Navigate to the **Settings** page.
    - **Branding**: Update the Store Logo and Hero Banners with the client's branding assets by providing image URLs.
    - **Store Settings**: Set the client's store name and desired delivery fee.
    - **API Keys**: Input the client's unique API keys for services like PhonePe and Google Maps.

8.  **Seed the Database**: Use the "Seed Database" button in the admin panel to populate the client's new, empty database with a starting set of categories and products, which they can then customize.

9.  **Handover**: Provide the client with admin credentials and documentation on how to use the admin panel.
