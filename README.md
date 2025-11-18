# 📚 E-Commerce Book Store Platform

A comprehensive, full-stack E-Commerce platform for selling books online with modern technologies and best practices.

## 🏗️ Architecture Overview

This project implements a microservices-based E-Commerce platform with the following technology stack:

### 📱 Mobile Frontend
- **Flutter** 3.x with Riverpod state management
- Cross-platform (iOS, Android, Web)
- Modern UI with responsive design

### 🖥️ Admin Panel
- **Next.js 14** with App Router
- **shadcn/ui** components with Tailwind CSS
- Real-time analytics and management

### 🔧 Backend API
- **NestJS** with TypeScript
- PostgreSQL database with TypeORM
- Redis caching and session management
- JWT authentication with OAuth support

### 🗄️ Database & Storage
- PostgreSQL 15+ for primary data
- Redis for caching
- AWS S3 / MinIO for file storage

### 🔗 External Integrations
- **Payment**: Midtrans / Xendit
- **Email**: AWS SES / SendGrid
- **SMS**: Twilio
- **Shipping**: RajaOngkir API

## 🚀 Features

### 🔐 Authentication & User Management
- ✅ User registration & login with JWT
- ✅ Google OAuth integration
- ✅ Multi-address management
- ✅ Role-based access control (Admin/Customer)
- ✅ Password reset functionality

### 📚 Catalog & Product Management
- ✅ Advanced book CRUD operations
- ✅ Category management with hierarchy
- ✅ Search and filtering capabilities
- ✅ Multiple sorting options
- ✅ Stock management
- ✅ Discount and pricing system

### 🛒 Shopping Cart & Checkout
- ✅ Persistent shopping cart
- ✅ Voucher and discount system
- ✅ Multiple payment methods (QRIS, VA, E-Wallet)
- ✅ Shipping cost calculation
- ✅ Order management

### 📦 Order Management
- ✅ Complete order lifecycle tracking
- ✅ Admin order management
- ✅ Shipping integration
- ✅ Invoice generation (PDF)
- ✅ Real-time order status updates

### ⭐ Rating & Review System
- ✅ Customer reviews and ratings
- ✅ Verified purchase protection
- ✅ Review moderation
- ✅ Analytics and reporting

### 🎯 Marketing Features
- ✅ Banner management
- ✅ Flash sale system
- ✅ Newsletter subscription
- ✅ Promotion management

### 📊 Analytics & Reporting
- ✅ Sales analytics dashboard
- ✅ Customer behavior tracking
- ✅ Inventory reports
- ✅ Financial reporting

## 📁 Project Structure

```
bookstore-platform/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── books/          # Book catalog
│   │   ├── categories/     # Category management
│   │   ├── cart/           # Shopping cart
│   │   ├── orders/         # Order management
│   │   ├── payments/       # Payment processing
│   │   ├── reviews/        # Review system
│   │   ├── admin/          # Admin features
│   │   └── common/         # Shared utilities
│   ├── test/               # Test files
│   └── migrations/         # Database migrations
├── frontend/
│   └── admin/              # Next.js admin panel
│       ├── src/
│       │   ├── app/        # App router pages
│       │   ├── components/ # Reusable components
│       │   ├── lib/        # Utilities and configs
│       │   └── types/      # TypeScript types
│       └── public/         # Static assets
├── mobile/                 # Flutter mobile app
│   ├── lib/
│   │   ├── core/           # Core functionality
│   │   ├── data/           # Data layer
│   │   ├── features/       # Feature modules
│   │   ├── presentation/   # UI components
│   │   └── utils/          # Utilities
│   ├── test/               # Flutter tests
│   └── assets/             # Mobile assets
├── documentation/          # Project documentation
│   ├── architecture_document.md
│   ├── database_schema.md
│   ├── api_endpoints.md
│   ├── business_flows.md
│   └── cicd_deployment.md
└── docker-compose.yml      # Local development setup
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Flutter 3.16+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone the repository
```bash
git clone https://github.com/your-org/bookstore-platform.git
cd bookstore-platform
```

### 2. Environment Setup
```bash
# Backend environment
cp backend/.env.example backend/.env
# Configure your database and API keys

# Frontend environment
cp frontend/admin/.env.example frontend/admin/.env
# Configure API URLs and authentication

# Mobile environment
cp mobile/.env.example mobile/.env
# Configure API endpoints and feature flags
```

### 3. Local Development with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Setup

#### Backend
```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```

#### Frontend
```bash
cd frontend/admin
npm install
npm run dev
```

#### Mobile
```bash
cd mobile
flutter pub get
flutter run
```

## Configuration

### Option 1: Docker Setup (Recommended)
1. **Start PostgreSQL with Docker:**
   ```bash
   npm run db:up
   ```
   This starts PostgreSQL in a Docker container with default credentials.

2. **Push database schema:**
   ```bash
   npm run db:push
   ```

### Option 2: Local Database Setup
1. Create a PostgreSQL database locally
2. Update your environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (defaults work with Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Features

- 🔐 Authentication with Better Auth (email/password)
- 🗄️ PostgreSQL Database with Drizzle ORM
- 🎨 40+ shadcn/ui components (New York style)
- 🌙 Dark mode with system preference detection
- 🚀 App Router with Server Components and Turbopack
- 📱 Responsive design with TailwindCSS v4
- 🎯 Type-safe database operations
- 🔒 Modern authentication patterns
- 🐳 Full Docker support with multi-stage builds
- 🚀 Production-ready deployment configuration

## Project Structure

```
codeguide-starter-fullstack/
├── app/                        # Next.js app router pages
│   ├── globals.css            # Global styles with dark mode
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main page
├── components/                # React components
│   └── ui/                    # shadcn/ui components (40+)
├── db/                        # Database configuration
│   ├── index.ts              # Database connection
│   └── schema/               # Database schemas
├── docker/                    # Docker configuration
│   └── postgres/             # PostgreSQL initialization
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
│   ├── auth.ts               # Better Auth configuration
│   └── utils.ts              # General utilities
├── auth-schema.ts            # Authentication schema
├── docker-compose.yml        # Docker services configuration
├── Dockerfile                # Application container definition
├── drizzle.config.ts         # Drizzle configuration
└── components.json           # shadcn/ui configuration
```

## Database Integration

This starter includes modern database integration:

- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the database provider
- **Better Auth** integration with Drizzle adapter
- **Database migrations** with Drizzle Kit

## Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:dev` - Start development PostgreSQL (port 5433)
- `npm run db:dev-down` - Stop development PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)

### Styling with shadcn/ui
- Pre-configured with 40+ shadcn/ui components in New York style
- Components are fully customizable and use CSS variables for theming
- Automatic dark mode support with next-themes integration
- Add new components: `npx shadcn@latest add [component-name]`

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack (app + database)
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Stop containers and clean up volumes

## Docker Development

### Quick Start with Docker
```bash
# Start the entire stack (recommended for new users)
npm run docker:up

# View logs
npm run docker:logs

# Stop everything
npm run docker:down
```

### Development Workflow
```bash
# Option 1: Database only (develop app locally)
npm run db:up          # Start PostgreSQL
npm run dev            # Start Next.js development server

# Option 2: Full Docker stack
npm run docker:up      # Start both app and database
```

### Docker Services

The `docker-compose.yml` includes:

- **postgres**: Main PostgreSQL database (port 5432)
- **postgres-dev**: Development database (port 5433) - use `--profile dev`
- **app**: Next.js application container (port 3000)

### Docker Profiles

```bash
# Start development database on port 5433
docker-compose --profile dev up postgres-dev -d

# Or use the npm script
npm run db:dev
```

## Deployment

### Production Deployment

#### Option 1: Docker Compose (VPS/Server)

1. **Clone and setup on your server:**
   ```bash
   git clone <your-repo>
   cd codeguide-starter-fullstack
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```bash
   # Edit .env with production values
   DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/postgres
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   BETTER_AUTH_SECRET=your-very-secure-secret-key
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

#### Option 2: Container Registry (AWS/GCP/Azure)

1. **Build and push image:**
   ```bash
   # Build the image
   docker build -t your-registry/codeguide-starter-fullstack:latest .
   
   # Push to registry
   docker push your-registry/codeguide-starter-fullstack:latest
   ```

2. **Deploy using your cloud provider's container service**

#### Option 3: Vercel + External Database

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add environment variables in Vercel dashboard:**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL

3. **Setup database:**
   ```bash
   # Push schema to your managed database
   npm run db:push
   ```

### Environment Variables for Production

```env
# Required for production
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate-a-very-secure-32-character-key
BETTER_AUTH_URL=https://yourdomain.com

# Optional optimizations
NODE_ENV=production
```

### Production Considerations

- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- **Security**: Generate strong secrets, use HTTPS
- **Performance**: Enable Next.js output: 'standalone' for smaller containers
- **Monitoring**: Add logging and health checks
- **Backup**: Regular database backups
- **SSL**: Terminate SSL at load balancer or reverse proxy

### Health Checks

The application includes basic health checks. You can extend them:

```dockerfile
# In Dockerfile, add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## AI Coding Agent Integration

This starter is optimized for AI coding agents:

- **Clear file structure** and naming conventions
- **TypeScript integration** with proper type definitions
- **Modern authentication** patterns
- **Database schema** examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# codeguide-starter-fullstack
