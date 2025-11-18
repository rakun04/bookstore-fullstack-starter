# Project Requirements Document (PRD)

## 1. Project Overview

This project delivers a modern, full-featured Admin Panel for an E-Commerce application. The frontend is built with Next.js (App Router), TypeScript, Tailwind CSS, and `shadcn/ui`, while the backend is a separate NestJS service using Drizzle ORM for database access. PostgreSQL serves as the database, and Docker Compose ties the pieces together for seamless local development. By adapting the existing Bookstore Fullstack Starter repo, we gain a ready-made UI, authentication flows, and database schema patterns—accelerating our build of product, category, and order management interfaces.

The Admin Panel solves the problem of providing store administrators with a secure, role-based dashboard to view statistics, perform CRUD operations on books (or products), manage orders, handle categories, and generate sales reports. Key objectives for version 1.0 include:

- Secure Admin authentication (email/password & Google OAuth) backed by NestJS JWTs.
- A responsive, data-driven dashboard layout with sidebar navigation and header.
- Full CRUD flows for products (books), categories, and orders.
- Containerized development environment orchestrating Next.js, NestJS API, and PostgreSQL.
- End-to-end type safety via shared Drizzle ORM schemas.

Success is measured by a fully functional Admin Panel where a user with the “Admin” role can log in, manage all e-commerce data types, and view real‐time summary statistics without front‐end/backend mismatches or manual environment setup.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0)**
- Next.js Admin Panel as a pure frontend client calling NestJS REST endpoints.
- Role-based authentication: email/password & Google OAuth, JWT issuance, http-only cookies.
- Pages for managing products (books), categories, and orders: list, create, edit, delete.
- Dashboard landing page with key stats (total products, pending orders, revenue).
- Drizzle ORM schema definitions for `users`, `roles`, `products`, `categories`, `orders`.
- Docker Compose setup with three services: `admin-frontend`, `api-backend`, `postgres-db`.
- Centralized API client module in Next.js for `fetch` calls with built-in error handling.

**Out-of-Scope (Deferred to Later Releases)**
- Flutter mobile app integration.
- Advanced reporting and charts (beyond simple stats cards).
- Voucher, reviews, and address management schemas.
- CI/CD pipelines (GitHub Actions) and production deployment scripts.
- Automated email flows for “Forgot Password” and notifications.
- Real-time features (WebSockets) or live updating dashboards.

## 3. User Flow

An Admin navigates to the `/sign-in` page of the Next.js app. They enter their email/password or click “Sign in with Google.” On submission, the form calls the NestJS `POST /auth/login` or OAuth callback endpoint. If credentials are valid and the user’s role is “Admin,” the backend returns a JWT, set in an http-only cookie. The user is redirected to `/dashboard` and can now access protected routes. If authentication fails or the user lacks the Admin role, they see an error message.

On the dashboard landing page, the Admin sees summary cards for total products, pending orders, and recent revenue. They click “Products” in the sidebar, which loads `/dashboard/products`. This page fetches a paginated list of products from `GET /products` and displays them in a table with “Edit” and “Delete” actions. Clicking “Create Product” opens a form that `POST`s to `/products`. Similar flows exist for categories and orders. Throughout, the Navbar provides a “Logout” button which calls `POST /auth/logout`, clearing the cookie and returning the user to the sign-in page.

## 4. Core Features

- **Authentication & Authorization**: Email/password login, Google OAuth, JWT issuance, role check (Admin only), logout, token refresh.
- **Dashboard Layout**: Protected routes wrapping, sidebar navigation (Dashboard, Products, Categories, Orders), top header with user menu.
- **Products CRUD**: List with pagination, search and filters, create/edit form (name, description, price, stock, category), delete with confirmation.
- **Categories CRUD**: List, create/edit forms, hierarchical support if needed in future.
- **Orders Management**: List orders, view details (customer info, items, status), update status (pending, shipped, delivered).
- **API Client Module**: Centralized fetch/axios wrapper handling base URL, headers (JWT), error parsing, retry logic.
- **Type-Safe ORM**: Shared Drizzle ORM schemas for core tables, migration support.
- **Dockerized Setup**: `docker-compose.yaml` with services for frontend, backend, and PostgreSQL; environment variable management.

## 5. Tech Stack & Tools

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, `shadcn/ui` components.
- **Backend**: NestJS (TypeScript), Drizzle ORM for schema and migrations, PostgreSQL database.
- **Authentication**: JWT via NestJS Auth module, Google OAuth strategy.
- **Data Fetching**: Native `fetch` or Axios (via a centralized API client).
- **Containerization**: Docker & Docker Compose for local dev.
- **Ide & Plugins**: VS Code with Tailwind CSS IntelliSense, Drizzle ORM plugin (optional).

## 6. Non-Functional Requirements

- **Performance**: Dashboard pages should load in under 1 second with cached API calls. API endpoints must respond within 200ms under normal load.
- **Security**: Use http-only, Secure cookies for JWT storage. Enforce HTTPS in production. Sanitize inputs to prevent SQL injection and XSS. Rate-limit auth endpoints (e.g., 5 attempts per minute).
- **Usability**: Responsive design for desktop admin users. Clear error messages and form validations.
- **Scalability**: Clean module boundaries to allow future real-time or microservices additions.
- **Reliability**: Automated migration checks on startup. Basic health-check endpoint `/health` for the API.

## 7. Constraints & Assumptions

- **Assumptions**: GPT-4 AI assistance is not required in the code but may be used for code generation. PostgreSQL v14+ is available. Developers run Docker locally.
- **Dependencies**: NestJS must support Drizzle ORM. Google OAuth credentials exist. Env vars (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.) are set.
- **Limitations**: No existing mobile endpoints defined yet. Role-based access relies on the `role` field in the `users` table; initial seed data must include an Admin user.

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits & Throttling**: Auth endpoints can be brute-forced. Mitigation: Use NestJS Throttler module.
- **Cookie Handling in SSR**: Next.js server components need proper cookie parsing. Mitigation: Use `next-cookies` or built-in `cookies()` API.
- **Schema Drift**: Dual use of Drizzle in Next.js and NestJS may lead to mismatches. Mitigation: Maintain one shared schema source (e.g., a private NPM package).
- **CORS & Environment Parity**: Misconfigured CORS during local dev can block API calls. Mitigation: Define a permissive CORS policy in NestJS for `localhost:3000`.
- **Docker Networking**: Services must share a network; named service hostnames (`api-backend`, `postgres-db`) should be used instead of `localhost` in containers.

By following this PRD, the AI model or development team can proceed to define detailed technical docs—Tech Stack Document, Frontend Guidelines, Backend Structure, and App Flow—without ambiguity.