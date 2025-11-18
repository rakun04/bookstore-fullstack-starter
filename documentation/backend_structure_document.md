# Backend Structure Document

This document outlines the backend setup for the E-Commerce Admin Panel project. It covers architecture, database, APIs, hosting, infrastructure, security, and maintenance. Designed to be clear and accessible, it ensures anyone—technical or non-technical—can grasp how the backend works.

## 1. Backend Architecture

**Overall Design**
- We use NestJS (a Node.js framework) with TypeScript for a modular, maintainable structure.
- Code is organized by feature modules (Auth, Users, Products, Orders, etc.), each containing:
  - Controllers (handle incoming requests)
  - Services (business logic)
  - Repositories (database access via Drizzle ORM)
- Dependency Injection (built into NestJS) ties everything together cleanly.

**Design Patterns and Frameworks**
- **Modular Pattern**: Each feature lives in its own folder, making it easy to add or update functionality without impacting unrelated parts.
- **Repository Pattern**: Abstracts database operations and keeps SQL or query logic out of business code.
- **MVC-like Structure**: Clear separation of controllers (entry points), services (logic) and repositories (data). 
- **Drizzle ORM**: Provides type-safe database queries, migrations, and models.

**Scalability, Maintainability, Performance**
- **Scalability**: Packaged as Docker containers, it can scale horizontally behind a load balancer. Future modules or microservices can be added without major rewrites.
- **Maintainability**: Feature modules and TypeScript typings help new developers onboard quickly. Clear boundaries reduce the risk of unintended side effects.
- **Performance**: Efficient SQL queries via Drizzle, optional caching layers, and HTTP/2 support keep response times low.

## 2. Database Management

**Database Technologies**
- Type: Relational (SQL)
- System: PostgreSQL
- ORM: Drizzle ORM (TypeScript-first approach)

**Data Structure and Access**
- Data is normalized into tables representing Users, Products (Books), Categories, Orders, Order Items, Reviews, Addresses, Vouchers, and Auth Tokens.
- Drizzle ORM handles migrations, schema definitions, and query building.
- Read and write operations go through repository classes to ensure consistency and logging.

**Data Practices**
- **Migrations**: Version-controlled schema changes via Drizzle migration scripts.
- **Backups**: Automated daily snapshots of the PostgreSQL database (e.g., AWS RDS snapshots).
- **Connection Pooling**: Ensures efficient use of database connections under load.

## 3. Database Schema

Below is a human-readable summary of the main tables. Following that, you’ll find the SQL definitions for a PostgreSQL setup.

**Human-Friendly Table Overview**
- **Users**: Admins and Customers with credentials and roles.
- **Categories**: Product groupings.
- **Products (Books)**: Items for sale, linked to a category.
- **Orders**: Customer orders, with status and total amount.
- **Order Items**: Line items within each order.
- **Reviews**: Customer feedback tied to products.
- **Addresses**: Shipping addresses for users.
- **Vouchers**: Discount codes with validity windows.
- **Password Reset Tokens**: One-time tokens for resetting passwords.
- **OAuth Accounts**: Records of external provider logins (e.g., Google).

**SQL Schema (PostgreSQL)**
```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products (Books)
CREATE TABLE products (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pending','Processing','Shipped','Delivered','Cancelled')),
  total_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vouchers
CREATE TABLE vouchers (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage NUMERIC(5,2) NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth Accounts
CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. API Design and Endpoints

We follow a RESTful approach using NestJS controllers. All endpoints live under `/api/v1/`.

**Authentication**
- `POST /api/v1/auth/register` – Create a new user account.
- `POST /api/v1/auth/login` – Log in and receive a JWT.
- `POST /api/v1/auth/logout` – Invalidate the current session.
- `POST /api/v1/auth/refresh-token` – Renew JWT.
- `GET /api/v1/auth/google` – Redirect to Google OAuth.
- `GET /api/v1/auth/google/callback` – Handle OAuth callback.
- `POST /api/v1/auth/password-reset-request` – Send reset email.
- `POST /api/v1/auth/password-reset` – Apply new password.

**Users**
- `GET /api/v1/users/me` – Get current user profile.
- `GET /api/v1/users/:id` – Get a user by ID (Admin only).

**Products (Books)**
- `GET /api/v1/products` – List or search products.
- `GET /api/v1/products/:id` – Get product details.
- `POST /api/v1/products` – Create a new product (Admin).
- `PUT /api/v1/products/:id` – Update a product (Admin).
- `DELETE /api/v1/products/:id` – Remove a product (Admin).

**Categories**
- Same CRUD pattern under `/api/v1/categories`.

**Orders**
- `GET /api/v1/orders` – List orders (Admin or user’s own).
- `GET /api/v1/orders/:id` – Get order details.
- `POST /api/v1/orders` – Place a new order.
- `PUT /api/v1/orders/:id` – Update order status (Admin).
- `DELETE /api/v1/orders/:id` – Cancel an order (Admin or own order).

**Order Items**
- Handled inside Orders; no separate public endpoints.

**Reviews**
- `GET /api/v1/products/:id/reviews` – List reviews for a product.
- `POST /api/v1/products/:id/reviews` – Submit a review (logged-in users).

**Addresses**
- Full CRUD under `/api/v1/addresses` (user-scoped).

**Vouchers**
- Full CRUD under `/api/v1/vouchers` (Admin).
- `POST /api/v1/vouchers/:code/redeem` – Apply a voucher.

## 5. Hosting Solutions

**Cloud Provider**: AWS (Amazon Web Services)

**Services Used**
- **ECR**: Stores Docker images for the NestJS API.
- **ECS (Fargate)**: Runs containers without managing servers.
- **RDS (PostgreSQL)**: Managed, backed-up database.
- **S3 + CloudFront**: Hosts static assets, with CDN acceleration.
- **Certificate Manager**: Auto-provisions TLS certificates.

**Benefits**
- **Reliability**: AWS SLAs, automatic failover for RDS.
- **Scalability**: ECS auto-scales containers; database read replicas if needed.
- **Cost-Effectiveness**: Pay-as-you-go pricing; scale down to zero in development.

## 6. Infrastructure Components

**Load Balancing**
- Application Load Balancer (ALB) distributes incoming HTTP(s) traffic across ECS tasks.

**Caching**
- Optional Redis via ElastiCache for:
  - Session storage or token revocation
  - Frequently queried data (e.g., top-selling products)

**Content Delivery Network (CDN)**
- CloudFront caches static assets from S3 globally, reducing latency for admin users.

**Container Orchestration**
- Docker images defined via `Dockerfile`.
- Local development and CI use `docker-compose.yaml` to spin up API, database, and cache.

**Messaging & Background Jobs**
- AWS SQS for async tasks (email sending, report generation).

## 7. Security Measures

**Authentication & Authorization**
- JWT tokens stored in HTTP-only cookies (prevents XSS).
- Role-based access control (Admin vs. Customer) enforced in NestJS guards.
- OAuth 2.0 strategy (Google) via Passport.

**Data Encryption**
- TLS everywhere (ALB enforces HTTPS).
- At-rest encryption for RDS and ElastiCache.

**API Protection**
- Rate limiting (e.g., 100 requests/minute/IP).
- Helmet middleware for secure HTTP headers.
- CORS policy restricted to known admin panel domains.
- Input validation and sanitization via `class-validator` and `class-transformer`.

**Compliance**
- GDPR-friendly data handling (users can delete their data).
- Passwords hashed with bcrypt.

## 8. Monitoring and Maintenance

**Monitoring Tools**
- **CloudWatch**: Logs, metrics, and alerts for CPU, memory, error rates.
- **X-Ray**: Distributed tracing of API calls (identifies slow endpoints).
- **Prometheus & Grafana** (optional): For custom application metrics.

**Logging**
- Structured logs via Winston or Pino, shipped to CloudWatch Logs.

**Health Checks**
- `/healthz` endpoint for container health.
- ALB health checks restart unhealthy tasks automatically.

**Maintenance Strategies**
- Automated database backups and point-in-time restore.
- Monthly dependency updates via Dependabot.
- CI/CD pipeline (GitHub Actions) runs tests, builds, and deploys:
  1. NestJS API image build and push to ECR
  2. Terraform or CloudFormation stack updates

## 9. Conclusion and Overall Backend Summary

This backend structure is designed to deliver a robust, secure, and scalable foundation for your E-Commerce Admin Panel. By using NestJS modules, Drizzle ORM, and PostgreSQL, we guarantee maintainability and type safety. Hosting on AWS with ECS, RDS, and CloudFront ensures reliability and performance at scale. Comprehensive security practices, monitoring tools, and a clear CI/CD workflow round out a production-ready environment that aligns with your project’s goals and user needs.

Unique strengths:
- Modular NestJS architecture with DI
- Type-safe database schema via Drizzle ORM
- Docker-first deployment across development, staging, and production
- AWS infrastructure optimized for cost, reliability, and scalability

This setup empowers your team to build, monitor, and evolve the Admin Panel confidently, meeting both current requirements and future expansions.