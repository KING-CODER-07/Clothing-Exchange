# Clothing Exchange & Swap Marketplace

A full-stack web application built for sustainable fashion. Exchange your pre-loved clothes directly with other users via a barter system.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## Core Features
- User Authentication (Register/Login)
- Profile & Dashboard Management
- List Clothing Items with Details & Value Tiers
- Browse Marketplace with Category/Location Filters
- Send, Accept, and Reject Swap Requests
- Negotiation Chat System
- Admin Dashboard (Manage Users and Items)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env` (already contains sensible defaults for local development):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/clothing-swap
   JWT_SECRET=your_super_secret_key
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

## Usage Guide
1. **Register**: Create an account or log in.
2. **List Items**: Go to your dashboard and list clothing items you want to swap.
3. **Browse**: Explore the marketplace for items you like.
4. **Request Swap**: On an item's detail page, select an item from your closet to offer.
5. **Negotiate**: Once a swap is accepted, use the built-in chat to finalize details (e.g., meeting location or shipping).
6. **Complete**: Mark the swap as completed!

## Deployment Guide

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect the repository to your chosen platform (e.g., Render Web Service).
3. Set the root directory to `backend`.
4. Add environment variables (`MONGODB_URI`, `JWT_SECRET`).
5. Build Command: `npm install`
6. Start Command: `npm start`

### Frontend (Vercel / Netlify)
1. Connect the repository to Vercel/Netlify.
2. Set the root directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Note: Update the `axios` base URLs in the frontend code to point to your deployed backend URL.
# Clothing-Exchange
# Clothing-Exchange
