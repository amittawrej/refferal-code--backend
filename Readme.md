## Referral Code Flow System

A web application designed to manage user registrations, referral rewards, and authentication using React, Node.js, express, and MongoDB. This system supports user sign-up via firebase Twitter authentication and MetaMask wallet connect, validates referral codes, and allocates points to referrers.
## Features
-   **User Registration**: Users can sign up using Twitter OAuth (via Firebase) or MetaMask wallet (via Web3).
-   **Referral System**: Users can generate referral codes and share them. New users can sign up with a referral code to grant the referrer additional points.
-   **Authentication**:
    -   **Access Token**: Issued after successful login, valid for 1 hour.
    -   **Refresh Token**: Issued after successful login, used to refresh the access token .
-   **Reward Allocation**: When a referred user signs up, the referrer is allocated points.
-   **Token-based Authentication**: The system uses JWT for secure authentication via access tokens and refresh tokens.
-   **Logout**: Users can log out, and their refresh token is invalidated.

## Technologies
-   **Frontend**: React
-   **Backend**: Node.js, Express
-   **Database**: MongoDB 
-   **Authentication**: Firebase Twitter OAuth, MetaMask 
## Security Measures
1.  **Passwordless Authentication**: Users authenticate via Twitter or MetaMask, reducing risks associated with storing passwords.
2.  **JWT-based Authentication**:
    -   **Access Token**: Short-lived to minimize the risk of misuse if compromised.
    -   **Refresh Token**: Stored securely, allowing for session management without frequent re-login.
3.  **Token Storage**:
    -   **Access Token**: Typically stored in local storage (though it can also be in HTTP-only cookies).
    -   **Refresh Token**: Stored securely in HTTP-only cookies or managed server-side to prevent XSS attacks.
4.  **Token Expiry and Rotation**: Access tokens expire after 1hr, and refresh tokens can be rotated, minimizing exposure to compromised tokens.
5.  **Token Blacklisting**: Upon logout, the refresh token is invalidated by clearing it from the database.
6.  **CORS**: Enabled and configured correctly to prevent unauthorized cross-origin access.
7.  **Input Validation and Sanitization**: All inputs from the client (e.g., referral codes, wallet addresses) are sanitized to prevent injection attacks (SQL Injection, NoSQL Injection, etc.).
8.  **HTTPS**: Recommended to encrypt data in transit, especially during token exchange.
## Getting Started
### Prerequisites
-   Node.js and npm installed on your machine.
-   MongoDB or PostgreSQL database setup.

### Frontend Setup
1.  Navigate to the  `frontend`  directory:
    cd frontend   
2.  Install dependencies:
    npm install 
3.  Start the development server:
    npm run dev
 ### ENV Variable required
VITE_FIREBASE_KEY
VITE_AUTH_DOMAIN
VITE_PROJECT_ID
VITE_STORAGE_BUCKET
VITE_MESSAGING_SENDER_ID
VITE_APP_ID
### Backend Setup
1.  Navigate to the  `backend`  directory:
    cd backend 
2.  Install dependencies:
    npm install
3.  Start the server:
    npm run dev
  ### ENV Variable required
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
NODE_ENV
