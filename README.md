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
- **Deployment**: Firebase App Hosting

## 3. Server Requirements

This application is built as a serverless Next.js application, designed to be deployed on modern cloud platforms. There are no traditional server management requirements. You only need:

- A **Node.js** environment for local development (v18 or newer recommended).
- A **Firebase** project.

## 4. Deployment Instructions

### Free Deployment (for Development/Staging)

The application is pre-configured for seamless deployment on **Firebase App Hosting**.

1.  **Install Firebase CLI**: If you don't have it, install the Firebase Command Line Interface:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**:
    ```bash
    firebase login
    ```
3.  **Initialize Firebase in your Project**:
    *   Navigate to your project's root directory in the terminal.
    *   This project is already configured, but for a new one, you would run `firebase init`.
4.  **Deploy**:
    *   To deploy your application, simply run:
        ```bash
        firebase deploy --only hosting
        ```
    *   Firebase will automatically build your Next.js application and deploy it. You will be provided with a live URL upon completion.

### Paid/Production Deployment

For a production environment, the process is identical to the free deployment. The key difference is upgrading your Firebase project to the **"Blaze" (Pay-as-you-go) plan**.

- **Why upgrade?** The Blaze plan provides higher quotas, allows the use of Cloud Functions for backend tasks (like setting custom claims for roles), and offers better performance for a production workload.
- **How to upgrade**:
    1.  Go to the [Firebase Console](https://console.firebase.google.com/).
    2.  Select your project.
    3.  In the bottom-left corner, click the "Spark plan" button and select "Upgrade".
    4.  Follow the instructions to link a billing account.

Once upgraded, the same `firebase deploy` command will deploy your application to a production-ready infrastructure.

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
    - Follow the deployment instructions above. The `firebase deploy` command will now deploy this newly configured app to the client's Firebase project.
    - Hand over the final URL to the client.

By following these steps, you can efficiently re-configure and deploy a unique, branded instance of SwiftShop for each of your clients.
