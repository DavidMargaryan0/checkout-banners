# Shopify Remix App

This is a Shopify app built using the Shopify Remix app template, Shopify Polaris, and Shopify Theme Block extension. The app integrates with MongoDB to manage banners with CRUD functionality.

## Prerequisites

- **Node.js**: Ensure you have Node.js version **20 or higher** installed.
- **Shopify CLI**: Install the Shopify CLI for local development.
- **MongoDB**: A valid MongoDB connection string.


**Configure Environment Variables:**
  Create a `.env` file in the root directory and add the following variables:
  ```env
  DB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
  ```
  Replace `username`, `password`, and `database-name` with your actual MongoDB credentials.

## Running the App

To start the Shopify app, use the following command:
   ```sh
   shopify app dev
   ```
This will start the development server and expose the app via a Shopify tunnel.

## Features
- **Banner Management:** Create, edit, delete banners with status control.
- **MongoDB Integration:** Store banners securely in MongoDB.
- **Shopify Polaris UI:** Modern and responsive UI using Shopify's Polaris framework.
- **Theme Block Extension:** Easily embed banners in Shopify themes.

## Deployment
For production deployment, ensure you:
- Use a secure, persistent MongoDB database.
- Set up proper environment variables.

