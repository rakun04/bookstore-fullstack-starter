# Tech Stack Document

This document outlines the key technologies chosen for the E-Commerce Admin Panel (adapted from the Bookstore Fullstack Starter). It explains in simple terms why each technology was selected and how it contributes to a fast, reliable, and user-friendly admin experience.

## 1. Frontend Technologies

We built the Admin Panel interface with the following tools and libraries, focusing on speed, clarity, and ease of maintenance:

- **Next.js (App Router)**  
  A React framework that handles routing, server-side rendering, and static pages automatically. It speeds up page loads and simplifies data fetching.

- **React 19 & TypeScript**  
  React provides the building blocks for interactive UIs, while TypeScript adds type safety so we catch errors early and keep code predictable.

- **Tailwind CSS**  
  A utility-first CSS framework that lets us style components with small, reusable classes. It keeps styles consistent and reduces custom CSS bloat.

- **shadcn/ui**  
  A collection of ready-made UI components (buttons, forms, tables, cards) built on top of Tailwind. It accelerates development and ensures a polished, accessible look.

- **Data Fetching with TanStack Query (or Axios)**  
  A library for managing API calls, caching, and updates in React. It simplifies loading states, error handling, and keeps data in sync with the server.

- **Next.js Server Components**  
  These components fetch data on the server before sending HTML to the browser, leading to faster first loads and better SEO.

## 2. Backend Technologies

Our backend is a standalone NestJS API that handles business logic, security, and data storage:

- **NestJS (with Express under the hood)**  
  A structured Node.js framework that uses decorators and modules. It makes it easy to organize routes, controllers, and services for authentication, user management, and CRUD operations.

- **TypeScript**  
  The same typed language runs on the server for consistency with the frontend and to minimize runtime errors.

- **Drizzle ORM**  
  A lightweight, schema-first library for defining database tables in TypeScript. We use it for type-safe queries and automatic migration generation.

- **PostgreSQL**  
  A reliable, open-source relational database. It stores all your data—users, books, categories, orders, and more—safely and allows complex queries for reports.

- **Authentication & Authorization**  
  - **Better Auth** (starter reference): A strategy for sign-up, sign-in, and password reset flows.  
  - **JWT (JSON Web Tokens)**: Secure tokens issued on login, stored in http-only cookies, and sent with each request to prove identity.  
  - **Google OAuth**: Allows admins to log in with their Google accounts, streamlining access without extra passwords.

- **RESTful API Endpoints**  
  Clear, predictable URLs (e.g., `GET /products`, `POST /orders`) that our Next.js frontend calls to fetch or update data.

## 3. Infrastructure and Deployment

To keep the project reliable, repeatable, and easy to deploy, we use:

- **Version Control with Git & GitHub**  
  Tracks code changes, enables collaboration, and hosts pull-request workflows.

- **Docker & Docker Compose**  
  Containerizes each service (Next.js, NestJS API, PostgreSQL) so any developer can spin up the full stack locally with a single command.

- **Continuous Integration / Continuous Deployment (CI/CD)**  
  - **GitHub Actions**: Runs tests, builds Docker images, and deploys code automatically when changes are merged.  
  - **Container Registry** (Docker Hub or GitHub Container Registry): Stores built images for consistent deployments.

- **Hosting Platforms**  
  - **Frontend (Next.js)**: Can be deployed to Vercel or Netlify for automatic scaling and global CDN.  
  - **Backend (NestJS API)**: Hosted on a cloud VM or container service (e.g., AWS ECS, DigitalOcean App Platform).  
  - **Database (PostgreSQL)**: Managed service like AWS RDS, DigitalOcean Managed DB, or a self-hosted container in production.

## 4. Third-Party Integrations

These services plug into our system to extend functionality without reinventing the wheel:

- **Email Service (e.g., SendGrid or Mailgun)**  
  Sends password-reset links and account-verification emails securely.

- **OAuth Providers**  
  - **Google OAuth**: Lets admins sign in with their Google accounts.  
  - (Optional) Other providers like GitHub or Facebook can be added later.

- **Analytics & Error Tracking**  
  - **Google Analytics or Plausible**: Tracks page views and user behavior in the admin panel.  
  - **Sentry**: Captures runtime errors and performance bottlenecks for quick debugging.

## 5. Security and Performance Considerations

We’ve built in several safeguards and optimizations to keep data safe and the interface responsive:

- **Authentication & Role-Based Access**  
  - Users are issued JWTs stored in http-only cookies (not accessible by JavaScript) to prevent XSS attacks.  
  - The backend checks roles (Admin vs. Customer) on every request to protected routes.

- **Data Validation & Sanitization**  
  - NestJS uses pipes and DTOs (data transfer objects) to validate and clean incoming data.  
  - Prevents injection attacks and ensures data consistency.

- **HTTPS Everywhere**  
  All services run over SSL/TLS to encrypt data in transit.

- **Performance Optimizations**  
  - **Server-Side Rendering & Caching** in Next.js for faster initial loads.  
  - **Code Splitting & Lazy Loading** of components so the browser only downloads what’s needed.  
  - **Database Indexing & Query Optimization** via Drizzle ORM to speed up data lookups.  
  - **CDN** for static assets (images, CSS, JS) to serve them from a location close to the user.

## 6. Conclusion and Overall Tech Stack Summary

This Admin Panel stack was chosen to balance developer productivity, application performance, and security:

- **Next.js + React 19 + TypeScript** for a modern, type-safe frontend with fast server-rendered pages.  
- **Tailwind CSS + shadcn/ui** for a consistent, accessible, and easily customizable design system.  
- **NestJS + Drizzle ORM + PostgreSQL** for a scalable, type-safe backend that cleanly separates logic, data models, and database migrations.  
- **Docker, GitHub Actions, and Cloud Hosting** for smooth local development, automated testing, and reliable production deployments.  
- **JWT, OAuth, HTTPS, and Validation** to protect user data and restrict access to authorized Admins only.

Together, these choices ensure that the Admin Panel is robust, easy to extend, and delivers a fluid, secure experience for your e-commerce administrators.