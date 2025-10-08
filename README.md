# SwiftShop - E-commerce Grocery Platform

SwiftShop is a feature-rich, modern, and scalable e-commerce platform designed for online grocery businesses. It provides a seamless shopping experience for customers and a powerful management dashboard for administrators.

## 1. Features

### Customer-Facing Application
- **Dynamic Home Page**: Engaging home page featuring a hero carousel, featured categories, and multiple product carousels like "Hot Deals" and "Popular Products".
- **Advanced Product Browsing**:
    - View products by category.
    - Detailed product pages with image carousels, descriptions, and multiple variations (e.g., 500g, 1kg).
- **Seamless Shopping Cart**: Fully functional cart to add, remove, and update item quantities.
- **Secure User Authentication**: Hassle-free login/signup using phone number and OTP verification.
- **Comprehensive User Account**:
    - **Profile Management**: Users can view and edit their profile information.
    - **Order History**: Track current and past orders with detailed status updates.
    - **Address Book**: Save and manage multiple delivery addresses.
    - **Wishlist**: Save favorite products for future purchase.
    - **Notifications**: Manage notification preferences.
    - **Payment Methods**: Add and manage payment options.
- **Effortless Checkout**: Multi-step checkout process including address selection, delivery time slots, and payment method selection (Cash on Delivery, PhonePe).
- **Real-Time Order Tracking**: Customers can view the live status of their orders from "Preparing" to "Delivered".
- **Geolocation**: Automatically suggests the delivery area based on the user's location.

### Admin Panel
- **Secure Admin Login**: Separate, secure login for the site administrator.
- **Analytics Dashboard**: At-a-glance view of key metrics including Total Revenue, Sales, New Orders, and recent sales activity.
- **Product Management (CRUD)**:
    - Add, view, edit, and delete products.
    - Manage multiple product variations, including different prices, units, and inventory levels.
- **Category Management (CRUD)**:
    - Add, view, edit, and delete product categories.
- **Order Management**:
    - View a list of all customer orders.
    - Update order status (e.g., 'Preparing', 'Out for Delivery', 'Delivered').
- **Customer Management**:
    - View a complete list of all registered customers.
    - Access detailed customer profiles and their order history.
- **Centralized Settings**:
    - **Branding**: Easily update the store logo and home page hero banners.
    - **API Keys**: Manage third-party API keys (e.g., Google Maps).
    - **Store Settings**: Configure the store name and delivery fees.
    - **Database Seeding**: A utility to populate the database with initial sample data.

## 2. Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React, ShadCN UI, Tailwind CSS
- **State Management**: React Context API and `useReducer` for cart management.
- **Backend & Database**: Firebase (Firestore, Firebase Authentication)
- **Generative AI**: Google's Genkit for AI-powered features (e.g., personalized recommendations).
- **Deployment**: Firebase App Hosting, Vercel

## 3. Server Requirements

This application is built as a serverless Next.js application, designed to be deployed on modern cloud platforms. There are no traditional server management requirements. You only need:

- A **Node.js** environment for local development (v18 or newer recommended).
- A **Firebase** project.

## 4. Deployment Instructions

You can deploy this application using either Vercel (recommended for free, full-featured hosting) or Firebase Hosting.

### Option 1: Vercel Deployment (Recommended - Free)

Vercel is the creator of Next.js and offers a seamless deployment experience with a generous free tier that supports all features of this app without a billing account.

1.  **Push to GitHub**: Create a new repository on [GitHub](https://github.com/) and push your project code to it.

2.  **Sign Up for Vercel**: Go to [Vercel](https://vercel.com/) and sign up for a new account using your GitHub profile.

3.  **Import Project**:
    *   On your Vercel dashboard, click **"Add New..."** and select **"Project"**.
    *   Find and import the GitHub repository you just created.

4.  **Configure Environment Variables**:
    *   Vercel will automatically detect that this is a Next.js project.
    *   In the configuration step, expand the **"Environment Variables"** section.
    *   You need to add the Firebase configuration values here. You can find these in your `src/firebase/config.ts` file. Create an entry for each key:
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your `apiKey`
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your `authDomain`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your `projectId`
        *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your `storageBucket`
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your `messagingSenderId`
        *   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your `appId`
    *   Also add your Google Maps API key if you have one:
        *   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API Key

5.  **Deploy**: Click the **"Deploy"** button. Vercel will build and deploy your application, providing you with a live URL.

### Option 2: Firebase Hosting Deployment

This method requires a Firebase project with a **billing account enabled** ("Blaze" plan) to support the app's server-side features.

1.  **Install Firebase CLI**: If you don't have it, install the Firebase Command Line Interface:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
3.  **Deploy**:
    *   Navigate to your project's root directory in the terminal.
    *   Run the deploy command:
        ```bash
        firebase deploy --only hosting
        ```
    *   Firebase will automatically build your Next.js application and deploy it. You will be provided with a live URL upon completion.

## 5. Selling This System to a Client (White-Labeling)

To rebrand and sell this system to a client, you will need to perform the following steps:

1.  **Create a New Firebase Project for the Client**: Each client must have their own isolated Firebase project to ensure data privacy and security.

2.  **Update Firebase Configuration**:
    - In the Firebase Console for the new project, go to Project Settings and create a new Web App.
    - Copy the `firebaseConfig` object provided.
    - Paste this new configuration into the `src/firebase/config.ts` file.

3.  **Update Service Account Credentials**:
    - In the Firebase Console, go to Project Settings > Service Accounts.
    - Generate a new private key and download the JSON file.
    - Rename the downloaded file to `service-account.json` and replace the existing one in `src/lib/firebase/service-account.json`. **Important**: This file is critical for admin actions and must be kept secure.

4.  **Customize Branding and Default Admin**:
    - **Admin User**: In your Firestore Security Rules (`firebase/firestore.rules`), change the `isAdmin()` function to use your client's admin email address instead of `admin@swiftshop.com`.
        ```javascript
        // Before
        function isAdmin() {
          return isSignedIn() && request.auth.token.email == 'admin@swiftshop.com';
        }

        // After
        function isAdmin() {
          return isSignedIn() && request.auth.token.email == 'client-admin-email@example.com';
        }
        ```
    - **Branding**: Log in to the admin panel and navigate to the **Settings** page. Use the UI to upload the client's logo and hero banners, and update the store name.

5.  **Review Data**:
    - Clear the sample data from the database. You can do this manually in the Firebase Console (Firestore Database section) or by creating a script.
    - Provide the client with the admin credentials so they can log in and add their own products and categories.

6.  **Deploy for the Client**:
    - Follow the deployment instructions above (either Vercel or Firebase). If using Vercel, remember to update the Environment Variables with the new client's Firebase project keys.
    - Hand over the final URL to the client.

By following these steps, you can efficiently re-configure and deploy a unique, branded instance of SwiftShop for each of your clients.
