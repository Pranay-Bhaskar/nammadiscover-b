<div align="center">

  <img src="https://raw.githubusercontent.com/Pranay-Bhaskar/nammadiscover-f/main/frontend/public/github_logo.png" alt="NammaDiscover Logo" width="340" />


[![Render Deployment](https://img.shields.io/badge/Deployed%20on-Render-blue?style=flat-square&logo=render)](https://namma-discover.onrender.com)
[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://namma-discover.vercel.app)
[![Contributors](https://img.shields.io/github/contributors/Pranay-Bhaskar/nammadiscover-b?style=flat-square&color=blue)](https://github.com/Pranay-Bhaskar/nammadiscover-b/graphs/contributors)

NammaDiscover Backend is the server-side application for **NammaDiscover**, powering authentication, user management, content delivery, protected APIs, moderation workflows, and admin operations for the platform.

This repository contains the backend codebase that supports the NammaDiscover frontend. It exposes the APIs required for authentication, user sessions, protected routes, content retrieval, media-related workflows, and administrative tools.

The backend is designed to serve the frontend application deployed at 

[namma-discover.onrender.com](https://namma-discover.onrender.com).

</div>

## Responsibilities

- User authentication and authorization
- Token-based access control
- User profile and session handling
- Content and location API endpoints
- Admin-only APIs and moderation workflows
- Frontend integration through REST APIs
- Secure handling of protected resources

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT-based authentication
- CORS and middleware-based request handling

## Project Structure

```bash
server/
controllers/
routes/
models/
middleware/
config/
utils/
```

> Update the structure above if your backend uses a different folder layout.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance

### Installation

```bash
git clone <backend-repository-url>
cd <backend-repository-folder>
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required environment variables:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=http://localhost:5173
```

Update these values for your production environment as needed.

## Run Locally

```bash
npm run dev
```

## Run in Production

```bash
npm start
```

## API Usage

This backend is consumed by the NammaDiscover frontend for:

- Login and registration
- Current user retrieval
- Protected dashboard access
- Location and content operations
- Admin dashboard and moderation operations

## Frontend Dependency

This repository is intended to work alongside the NammaDiscover frontend repository.

Frontend live URL:
[https://namma-discover.vercel.app](https://namma-discover.vercel.app)


## Deployment Notes

Before deploying, verify:

- CORS is configured for the frontend domain
- Environment variables are set correctly
- MongoDB connection is available
- JWT secret is configured securely
- API base URL is added in the frontend environment
