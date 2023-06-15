# E-commerce App

This is a backend application built with TypeScript and Node.js, designed to provide a robust backend solution for managing products, implementing user authentication, processing orders, and offering additional functionality for an e-commerce platform.

## Description

The E-commerce App is a full-fledged e-commerce solution that allows users to browse products, add them to their cart, and complete the checkout process. It also provides features such as user registration and login, order history, and email notifications.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/KarimAbdelnasser/E-commerce.git
    ```

2. Install dependencies:

    ```bash
    cd E-commerce
    npm install
    ```

3. Configure environment variables:

Create a .env file in the project root directory and add the following environment variables:

    MONGODB_URL= # MongoDB connection URL
    DB_PORT=5432 # Database port (PostgreSQL)
    JWT_SECRET= # Secret key for JWT authentication
    SALT= # Salt for password hashing
    PORT= # Port number for the server
    MAIL= # Email address for sending notifications
    MAIL_PASS= # Password for the email account
    POSTGRESQL_URL= # PostgreSQL connection URL
    POSTGRESQL_USERNAME= # PostgreSQL username
    POSTGRESQL_PASSWORD= # PostgreSQL password
    POSTGRESQL_HOST= # PostgreSQL host
    POSTGRESQL_DATABASE= # PostgreSQL database name

-   Make sure to provide the appropriate values for each environment variable.

4.  Build the project:

    ```bash
    npm run build
    ```

5.  Start the server:

    ```bash
    npm start
    ```

-   The server will start running on the specified port, and you can access the application at
    ```bash
    http://localhost:{port}.
    ```

## Prerequisites

Before running the project, ensure you have the following:

-   Node.js installed (version 14 or above)

-   MongoDB instance or connection URL

-   PostgreSQL instance or connection URL

-   Email account for sending notifications

## Scripts

The following scripts are available in the project:

-   npm start: Runs the built server code using Node.js.
-   npm run dev: Runs the server in development mode using Nodemon, which automatically restarts the server on file changes.
-   npm run build: Transpiles the TypeScript code to JavaScript using the TypeScript compiler.
