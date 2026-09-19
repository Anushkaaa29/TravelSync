# Travel Booking App - Learning Journey

This project is a comprehensive guide to building a full-stack Travel Booking Application using the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript.

## Project Overview
- **Goal**: Build a production-ready Travel Booking App.
- **Stack**: MERN + TypeScript.
- **Learning Approach**: Stepwise, concept-focused implementation.

## Learning Log
Use this section to document what you learn, bugs you encounter, and how you solve them.

## Learning Log

### Completed Modules

#### 1. Backend Architecture (Node/Express/TS)
- **MVC Pattern**: Separated concerns into Models (Data), Views (JSON Responses), and Controllers (Logic).
- **TypeScript Integration**: configured `tsc`, strict mode, and types for Express/Mongoose.
- **Middleware**: Implemented custom authentication middleware and CORS handling.

#### 2. Database (MongoDB + Mongoose)
- **Schema Design**:
    - `User`: Includes role-based access (admin/user) and password hashing.
    - `Destination`: Stores travel spot details (title, price, image URL).
- **CRUD Operations**: Implemented full Create, Read, Update, Delete for Destinations.

#### 3. Authentication & Security
- **JWT**: Stateless authentication using JSON Web Tokens.
- **Bcrypt**: Password hashing before storage (Salting + Hashing).
- **Protected Routes**: Middleware to verify tokens before allowing access to sensitive endpoints.

### API Documentation

#### Auth Endpoints
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate and receive token

#### Destination Endpoints
- `GET /api/destinations` - Public list of all places
- `POST /api/destinations` - Create new place (Admin only/Protected)
- `PUT /api/destinations/:id` - Update place
- `DELETE /api/destinations/:id` - Remove place

## Current Status
- Backend is largely feature-complete for the core MVP.
- Frontend has basic structure (Vite + React Router) with a Login page in progress.

