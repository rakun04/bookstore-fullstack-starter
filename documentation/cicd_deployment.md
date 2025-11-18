# CI/CD Pipeline and Deployment Guide

## 🔄 Continuous Integration/Continuous Deployment (CI/CD)

### Overview
This comprehensive CI/CD pipeline ensures automated testing, building, and deployment of the E-Commerce Book Store platform across different environments.

## 🛠️ Backend CI/CD (NestJS)

### GitHub Actions Workflow
```yaml
# .github/workflows/backend-ci.yml
name: Backend CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'backend/**'

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/bookstore-backend

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: bookstore_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run linting
        working-directory: ./backend
        run: npm run lint

      - name: Run type checking
        working-directory: ./backend
        run: npm run type-check

      - name: Run unit tests
        working-directory: ./backend
        run: npm run test:cov
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
          DB_NAME: bookstore_test
          REDIS_HOST: localhost
          REDIS_PORT: 6379

      - name: Run integration tests
        working-directory: ./backend
        run: npm run test:e2e
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
          DB_NAME: bookstore_test

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage
          flags: backend

      - name: Security audit
        working-directory: ./backend
        run: npm audit --audit-level moderate

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your staging deployment logic here
          # This could be kubectl apply, helm upgrade, or API calls

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your production deployment logic here
```

### Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Create uploads directory
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/main.js"]
```

## 🖥️ Frontend CI/CD (Next.js)

### GitHub Actions Workflow
```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'frontend/admin/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'frontend/admin/**'

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/bookstore-frontend

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/admin/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend/admin
        run: npm ci

      - name: Run linting
        working-directory: ./frontend/admin
        run: npm run lint

      - name: Run type checking
        working-directory: ./frontend/admin
        run: npm run type-check

      - name: Run unit tests
        working-directory: ./frontend/admin
        run: npm run test

      - name: Build application
        working-directory: ./frontend/admin
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:3001/v1

      - name: Run E2E tests
        working-directory: ./frontend/admin
        run: npm run test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: http://localhost:3000

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/admin/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend/admin
        run: npm ci

      - name: Build application
        working-directory: ./frontend/admin
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend/admin
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### Dockerfile for Frontend
```dockerfile
# frontend/admin/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 📱 Mobile CI/CD (Flutter)

### GitHub Actions Workflow
```yaml
# .github/workflows/mobile-ci.yml
name: Mobile CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'mobile/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'mobile/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'

      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get

      - name: Analyze code
        working-directory: ./mobile
        run: flutter analyze

      - name: Run unit tests
        working-directory: ./mobile
        run: flutter test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./mobile/coverage/lcov.info

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'

      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get

      - name: Build APK
        working-directory: ./mobile
        run: flutter build apk --release
        env:
          API_BASE_URL: ${{ secrets.API_URL }}

      - name: Build App Bundle
        working-directory: ./mobile
        run: flutter build appbundle --release
        env:
          API_BASE_URL: ${{ secrets.API_URL }}

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: mobile/build/app/outputs/flutter-apk/app-release.apk

      - name: Upload App Bundle artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-aab
          path: mobile/build/app/outputs/bundle/release/app-release.aab

  build-ios:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'

      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get

      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.0'

      - name: Build iOS (no codesigning)
        working-directory: ./mobile
        run: flutter build ios --release --no-codesign
        env:
          API_BASE_URL: ${{ secrets.API_URL }}

      - name: Build IPA
        working-directory: ./mobile
        run: |
          flutter build ipa --release
        env:
          API_BASE_URL: ${{ secrets.API_URL }}

      - name: Upload IPA artifact
        uses: actions/upload-artifact@v4
        with:
          name: ios-ipa
          path: mobile/build/ios/ipa/*.ipa
```

## 🚀 Deployment Strategies

### 1. Production Deployment Setup

#### Kubernetes Manifests
```yaml
# k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: bookstore

---
# k8s/backend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-backend
  namespace: bookstore
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bookstore-backend
  template:
    metadata:
      labels:
        app: bookstore-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/your-org/bookstore-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: bookstore-secrets
              key: db-host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: bookstore-secrets
              key: db-password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/backend-service.yml
apiVersion: v1
kind: Service
metadata:
  name: bookstore-backend-service
  namespace: bookstore
spec:
  selector:
    app: bookstore-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: ClusterIP

---
# k8s/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: bookstore-backend-hpa
  namespace: bookstore
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bookstore-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

#### Helm Chart Structure
```
helm/bookstore/
├── Chart.yaml
├── values.yaml
├── values-production.yaml
├── values-staging.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   ├── pvc.yaml
│   └── serviceaccount.yaml
└── charts/
```

### 2. Database Deployment

#### PostgreSQL Setup
```yaml
# k8s/postgres.yml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
  namespace: bookstore
spec:
  instances: 3
  primaryUpdateStrategy: unsupervised

  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
      effective_cache_size: "1GB"

  bootstrap:
    initdb:
      database: bookstore
      owner: postgres
      secret:
        name: postgres-credentials

  storage:
    size: 20Gi
    storageClass: fast-ssd

  monitoring:
    enabled: true
```

### 3. Monitoring and Logging

#### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "bookstore_rules.yml"

scrape_configs:
  - job_name: 'bookstore-backend'
    static_configs:
      - targets: ['bookstore-backend-service:80']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Bookstore Monitoring",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "active_users_total",
            "legendFormat": "Active Users"
          }
        ]
      },
      {
        "title": "Order Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(orders_total[5m])",
            "legendFormat": "Orders/sec"
          }
        ]
      }
    ]
  }
}
```

### 4. Environment Management

#### Environment Variables by Environment
```yaml
# environments/production.env
NODE_ENV=production
DB_HOST=postgres-cluster-rw.bookstore.svc.cluster.local
REDIS_HOST=redis-master.bookstore.svc.cluster.local
STORAGE_TYPE=s3
AWS_S3_BUCKET=bookstore-prod-uploads
MIDTRANS_PRODUCTION=true

# environments/staging.env
NODE_ENV=staging
DB_HOST=postgres-staging-rw.bookstore-staging.svc.cluster.local
REDIS_HOST=redis-staging.bookstore-staging.svc.cluster.local
STORAGE_TYPE=local
MIDTRANS_PRODUCTION=false
```

### 5. Release Management

#### Semantic Versioning
```bash
# Version bump workflow
git checkout main
git pull origin main
npm version patch  # or minor, major
git push origin main --tags
```

#### Rollback Strategy
```yaml
# k8s/rollback-job.yml
apiVersion: batch/v1
kind: Job
metadata:
  name: rollback-job
  namespace: bookstore
spec:
  template:
    spec:
      containers:
      - name: rollback
        image: bitnami/kubectl:latest
        command:
        - /bin/sh
        - -c
        - |
          kubectl set image deployment/bookstore-backend backend=ghcr.io/your-org/bookstore-backend:previous-tag -n bookstore
          kubectl rollout status deployment/bookstore-backend -n bookstore
      restartPolicy: OnFailure
```

## 🔒 Security Best Practices

### 1. Secrets Management
- Use Kubernetes secrets for sensitive data
- Rotate secrets regularly
- Use external secret management (AWS Secrets Manager, HashiCorp Vault)

### 2. Network Security
- Implement network policies
- Use TLS certificates (Let's Encrypt)
- Configure firewalls and security groups

### 3. Container Security
- Use minimal base images
- Scan images for vulnerabilities
- Implement image signing

### 4. Access Control
- Implement RBAC
- Use service accounts
- Regular access audits

## 📈 Performance Optimization

### 1. Caching Strategy
- Redis for application caching
- CDN for static assets
- Database query caching

### 2. Load Balancing
- Horizontal pod autoscaling
- Load balancer configuration
- Health checks and readiness probes

### 3. Database Optimization
- Connection pooling
- Read replicas
- Query optimization

This comprehensive CI/CD and deployment setup ensures reliable, scalable, and maintainable deployment of the E-Commerce Book Store platform.