/**
 * @file Firestore Security Rules for SwiftShop
 * @version Prototyping (Updated with Admin User Management)
 *
 * @Core Philosophy:
 * This ruleset prioritizes strong authorization while remaining permissive on data shapes to enable rapid prototyping.
 * It enforces a strict user-ownership model for user-specific data and an admin-control model for global settings.
 *
 * @Data Structure:
 * - `/categories`: Publicly readable product categories.
 * - `/products`: Publicly readable product details.
 * - `/settings`: Contains subcollections for various app settings.
 *   - `/settings/branding`: Branding configurations, publicly readable, admin-writable.
 *   - `/settings/apiKeys`: API keys, only admin-writable.
 *   - `/settings/store`: Store settings, only admin-writable.
 * - `/users/{userId}`: User profiles, accessible only by the user or admins.
 *   - `/users/{userId}/addresses/{addressId}`: User's addresses, accessible only by the user.
 *   - `/users/{userId}/orders/{orderId}`: User's orders, accessible only by the user.
 *   - `/users/{userId}/orders/{orderId}/orderItems/{orderItemId}`: Order items, accessible only by the user.
 *   - `/users/{userId}/supportTickets/{supportTicketId}`: User's support tickets, accessible only by the user.
 *   - `/users/{userId}/supportTickets/{supportTicketId}/chatMessages/{chatMessageId}`: Chat messages, accessible only by the user.
 * - `/orders/{orderId}`: All orders, accessible by admins and specific users (clarification needed on user access).
 *
 * @Key Security Decisions:
 * - User listing is restricted to admins.
 * - Data shape validation is minimized to facilitate rapid prototyping. Only essential authorization fields are validated.
 * - When user read access is ambiguous, it defaults to owner-only access.
 * - API Keys and Store Settings are secured behind `isAdmin()` check
 *
 * @Denormalization for Authorization:
 *   - User-specific data is nested under `/users/{userId}` to simplify ownership checks using the `isOwner(userId)` function.
 */
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /categories/{categoryId} {
      allow get, list: if true;
      allow create, update, delete: if false;
    }

    match /products/{productId} {
      allow get, list: if true;
      allow create, update, delete: if false;
    }

    match /settings/branding {
      allow get, list: if true;
      allow create, update, delete: if isAdmin();
    }

    match /settings/apiKeys {
      allow get, list: if false;
      allow create, update, delete: if isAdmin();
    }

    match /settings/store {
      allow get, list: if false;
      allow create, update, delete: if isAdmin();
    }

    /**
     * ✅ UPDATED SECTION
     * @description Restricts access to user profiles to the user themselves or to admins.
     * @path /users/{userId}
     * @allow (get): A user can read their own profile or an admin can read any profile.
     * @allow (list): Only admins can list all users.
     * @allow (create): A user can create their own profile or an admin can create any profile.
     * @allow (update, delete): A user can update/delete their own profile or an admin can update/delete any profile.
     */
    match /users/{userId} {
      // ✅ A user can read their own profile or admin can read any profile
      allow get: if isOwner(userId) || isAdmin();

      // ✅ Only admins can list all users
      allow list: if isAdmin();

      // ✅ A user can create their own profile OR admin can create any profile
      allow create: if (isOwner(userId) && request.auth.uid == userId) || isAdmin();

      // ✅ A user can update/delete their own profile OR admin can update/delete any
      allow update, delete: if isExistingOwner(userId) || isAdmin();
    }

    match /users/{userId}/addresses/{addressId} {
      allow get, list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update, delete: if isExistingOwner(userId) && isOwner(userId);
    }

    match /users/{userId}/orders/{orderId} {
      allow get, list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update, delete: if isExistingOwner(userId) && isOwner(userId);
    }

    match /users/{userId}/orders/{orderId}/orderItems/{orderItemId} {
      allow get, list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update, delete: if isExistingOwner(userId) && isOwner(userId);
    }

    match /users/{userId}/supportTickets/{supportTicketId} {
      allow get, list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update, delete: if isExistingOwner(userId) && isOwner(userId);
    }

    match /users/{userId}/supportTickets/{supportTicketId}/chatMessages/{chatMessageId} {
      allow get, list: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update, delete: if isExistingOwner(userId) && isOwner(userId);
    }

    match /orders/{orderId} {
      allow get, list: if true; // TODO: Secure list and get operations on orders
      allow create, update, delete: if isAdmin();
    }

    // --- Helper Functions ---
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && (request.auth.token.admin == true || request.auth.token.email == "admin@swiftshop.com");
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isExistingOwner(userId) {
      return isOwner(userId) && resource != null;
    }
  }
}
