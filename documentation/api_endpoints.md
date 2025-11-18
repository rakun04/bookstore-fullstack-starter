# E-Commerce Book Store - Complete API Endpoints Documentation

## Base URL
```
Production: https://api.bookstore.com/v1
Staging: https://staging-api.bookstore.com/v1
Development: http://localhost:3001/v1
```

## Authentication
All API endpoints (except public ones) require authentication using JWT tokens in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 🔐 Authentication Module

### POST /auth/register
Register new user account
```typescript
// Request
interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
}

// Response
interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### POST /auth/login
User login
```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response
interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### POST /auth/refresh
Refresh access token
```typescript
// Request
interface RefreshRequest {
  refreshToken: string;
}

// Response
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

### POST /auth/logout
User logout
```typescript
// Response
interface LogoutResponse {
  message: string;
}
```

### POST /auth/forgot-password
Request password reset
```typescript
// Request
interface ForgotPasswordRequest {
  email: string;
}

// Response
interface ForgotPasswordResponse {
  message: string;
}
```

### POST /auth/reset-password
Reset password with token
```typescript
// Request
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Response
interface ResetPasswordResponse {
  message: string;
}
```

### GET /auth/google
Google OAuth login
```typescript
// Query Parameters
{
  redirect_url?: string;
}

// Response: Redirect to Google OAuth
```

### POST /auth/google/callback
Google OAuth callback
```typescript
// Request
interface GoogleCallbackRequest {
  code: string;
  state?: string;
}

// Response
interface GoogleAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

---

## 👤 User Management Module

### GET /users/profile
Get current user profile
```typescript
// Response
interface UserProfileResponse {
  user: User;
  addresses: UserAddress[];
}
```

### PUT /users/profile
Update user profile
```typescript
// Request
interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatar?: File;
}
```

### GET /users/addresses
Get user addresses
```typescript
// Response
interface UserAddressesResponse {
  addresses: UserAddress[];
}
```

### POST /users/addresses
Add new address
```typescript
// Request
interface CreateAddressRequest {
  label: string;
  recipientName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isPrimary: boolean;
}
```

### PUT /users/addresses/:id
Update address
```typescript
// Request
interface UpdateAddressRequest {
  label?: string;
  recipientName?: string;
  phone?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  isPrimary?: boolean;
}
```

### DELETE /users/addresses/:id
Delete address

### GET /users/wishlist
Get user wishlist
```typescript
// Response
interface WishlistResponse {
  books: Book[];
}
```

### POST /users/wishlist/:bookId
Add book to wishlist

### DELETE /users/wishlist/:bookId
Remove book from wishlist

---

## 📚 Catalog & Books Module

### GET /books
Get books with pagination, search, and filters
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high' | 'rating';
  isFeatured?: boolean;
}

// Response
interface BooksResponse {
  books: Book[];
  pagination: PaginationInfo;
  filters: {
    categories: Category[];
    authors: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}
```

### GET /books/:id
Get book details
```typescript
// Response
interface BookDetailResponse {
  book: Book;
  relatedBooks: Book[];
  reviews: Review[];
}
```

### GET /books/slug/:slug
Get book by slug
```typescript
// Response
interface BookDetailResponse {
  book: Book;
  relatedBooks: Book[];
  reviews: Review[];
}
```

### GET /books/featured
Get featured books
```typescript
// Query Parameters
{
  limit?: number;
}

// Response
interface FeaturedBooksResponse {
  books: Book[];
}
```

### GET /books/bestsellers
Get bestseller books
```typescript
// Response
interface BestsellersResponse {
  books: Book[];
}
```

### GET /books/search/suggestions
Get search suggestions
```typescript
// Query Parameters
{
  q: string;
  limit?: number;
}

// Response
interface SearchSuggestionsResponse {
  suggestions: string[];
  books: Book[];
}
```

---

## 🏷️ Categories Module

### GET /categories
Get all categories
```typescript
// Query Parameters
{
  includeInactive?: boolean;
}

// Response
interface CategoriesResponse {
  categories: Category[];
}
```

### GET /categories/tree
Get category tree
```typescript
// Response
interface CategoryTreeResponse {
  categories: CategoryTree[];
}

interface CategoryTree extends Category {
  children: CategoryTree[];
}
```

### GET /categories/:id
Get category details
```typescript
// Response
interface CategoryDetailResponse {
  category: Category;
  books: Book[];
  subcategories: Category[];
}
```

### GET /categories/:slug
Get category by slug
```typescript
// Response
interface CategoryDetailResponse {
  category: Category;
  books: Book[];
  subcategories: Category[];
}
```

### POST /categories (Admin only)
Create new category
```typescript
// Request
interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
  parentId?: string;
  sortOrder?: number;
}
```

### PUT /categories/:id (Admin only)
Update category
```typescript
// Request
interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: File;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}
```

### DELETE /categories/:id (Admin only)
Delete category

---

## 🛒 Cart Module

### GET /cart
Get user cart
```typescript
// Response
interface CartResponse {
  items: CartItem[];
  summary: {
    totalItems: number;
    subtotal: number;
    totalDiscount: number;
    total: number;
  };
}
```

### POST /cart/items
Add item to cart
```typescript
// Request
interface AddToCartRequest {
  bookId: string;
  quantity: number;
}
```

### PUT /cart/items/:id
Update cart item quantity
```typescript
// Request
interface UpdateCartItemRequest {
  quantity: number;
}
```

### DELETE /cart/items/:id
Remove item from cart

### DELETE /cart
Clear cart

### POST /cart/apply-voucher
Apply voucher to cart
```typescript
// Request
interface ApplyVoucherRequest {
  code: string;
}

// Response
interface ApplyVoucherResponse {
  voucher: Voucher;
  discountAmount: number;
  newTotal: number;
}
```

### DELETE /cart/voucher
Remove voucher from cart

---

## 💳 Orders & Checkout Module

### POST /checkout
Process checkout
```typescript
// Request
interface CheckoutRequest {
  items: CheckoutItem[];
  shippingAddress: Address;
  paymentMethod: string;
  shippingMethod: string;
  voucherCode?: string;
  notes?: string;
}

interface CheckoutItem {
  bookId: string;
  quantity: number;
}

// Response
interface CheckoutResponse {
  order: Order;
  paymentUrl?: string; // For redirect-based payment
}
```

### GET /orders
Get user orders
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

// Response
interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}
```

### GET /orders/:id
Get order details
```typescript
// Response
interface OrderDetailResponse {
  order: Order;
  items: OrderItem[];
  payment: Payment;
  shipment?: Shipment;
}
```

### POST /orders/:id/cancel
Cancel order
```typescript
// Request
interface CancelOrderRequest {
  reason: string;
}
```

### GET /orders/:id/invoice
Get order invoice PDF
```typescript
// Response: PDF File
```

### POST /orders/:id/payment
Process payment
```typescript
// Request
interface ProcessPaymentRequest {
  paymentMethod: string;
  paymentDetails?: any;
}

// Response
interface ProcessPaymentResponse {
  payment: Payment;
  paymentUrl?: string;
  qrCode?: string;
}
```

---

## 📦 Payment Module

### GET /payment/methods
Get available payment methods
```typescript
// Response
interface PaymentMethodsResponse {
  methods: PaymentMethod[];
}
```

### POST /payment/midtrans/create
Create Midtrans payment
```typescript
// Request
interface CreateMidtransPaymentRequest {
  orderId: string;
  amount: number;
  paymentType: 'qris' | 'bank_transfer' | 'credit_card' | 'ewallet';
  customerDetails: CustomerDetails;
}

// Response
interface CreateMidtransPaymentResponse {
  token: string;
  redirectUrl: string;
  qrCode?: string;
  vaNumbers?: VaNumber[];
}
```

### POST /payment/midtrans/notification
Midtrans webhook notification
```typescript
// Request: Midtrans notification payload
// Response: 200 OK
```

### GET /payment/status/:orderId
Get payment status
```typescript
// Response
interface PaymentStatusResponse {
  payment: Payment;
  status: PaymentStatus;
  details?: any;
}
```

---

## 🚚 Shipping Module

### GET /shipping/couriers
Get available couriers
```typescript
// Query Parameters
{
  origin: string;
  destination: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
}

// Response
interface CouriersResponse {
  couriers: Courier[];
}
```

### GET /shipping/cost
Calculate shipping cost
```typescript
// Query Parameters
{
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

// Response
interface ShippingCostResponse {
  costs: ShippingCost[];
}
```

### GET /shipping/tracking/:trackingNumber
Track shipment
```typescript
// Response
interface TrackingResponse {
  trackingNumber: string;
  status: ShipmentStatus;
  history: TrackingHistory[];
}
```

---

## ⭐ Reviews Module

### GET /reviews
Get reviews
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  bookId?: string;
  rating?: number;
}

// Response
interface ReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo;
  statistics: {
    averageRating: number;
    ratingDistribution: RatingDistribution[];
  };
}
```

### POST /reviews
Create review
```typescript
// Request
interface CreateReviewRequest {
  orderId: string;
  bookId: string;
  rating: number;
  comment: string;
  images?: File[];
}
```

### PUT /reviews/:id
Update review
```typescript
// Request
interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}
```

### DELETE /reviews/:id
Delete review

### POST /reviews/:id/helpful
Mark review as helpful

### DELETE /reviews/:id/helpful
Remove helpful vote

---

## 🎯 Vouchers & Promotions Module

### GET /vouchers
Get available vouchers
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  active?: boolean;
}

// Response
interface VouchersResponse {
  vouchers: Voucher[];
}
```

### GET /vouchers/validate/:code
Validate voucher code
```typescript
// Response
interface ValidateVoucherResponse {
  voucher: Voucher;
  isValid: boolean;
  discountAmount: number;
}
```

### GET /flash-sales
Get active flash sales
```typescript
// Response
interface FlashSalesResponse {
  flashSales: FlashSale[];
}
```

### GET /flash-sales/:id/books
Get flash sale books
```typescript
// Response
interface FlashSaleBooksResponse {
  books: FlashSaleBook[];
}
```

---

## 📢 Banners & Content Module

### GET /banners
Get active banners
```typescript
// Query Parameters
{
  type?: BannerType;
  limit?: number;
}

// Response
interface BannersResponse {
  banners: Banner[];
}
```

### GET /newsletter/subscribe
Subscribe to newsletter
```typescript
// Request
interface NewsletterSubscribeRequest {
  email: string;
  name?: string;
}
```

### POST /newsletter/unsubscribe
Unsubscribe from newsletter
```typescript
// Request
interface NewsletterUnsubscribeRequest {
  email: string;
}
```

---

## 🔔 Notifications Module

### GET /notifications
Get user notifications
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  unread?: boolean;
}

// Response
interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
```

### PUT /notifications/:id/read
Mark notification as read

### PUT /notifications/read-all
Mark all notifications as read

### DELETE /notifications/:id
Delete notification

---

## 📊 Admin Dashboard Module

### GET /admin/dashboard
Get dashboard statistics
```typescript
// Response
interface DashboardStatsResponse {
  stats: {
    totalBooks: number;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    pendingOrders: number;
    lowStockBooks: number;
  };
  charts: {
    revenueChart: RevenueChartData[];
    orderChart: OrderChartData[];
    topBooks: BookSalesData[];
    categorySales: CategorySalesData[];
  };
  recentOrders: Order[];
  lowStockBooks: Book[];
}
```

### GET /admin/reports/sales
Get sales report
```typescript
// Query Parameters
{
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
}

// Response
interface SalesReportResponse {
  data: SalesReportData[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    topProducts: Book[];
  };
}
```

### GET /admin/audit-logs
Get audit logs
```typescript
// Query Parameters
{
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Response
interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: PaginationInfo;
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Token expired |
| `AUTH_003` | Token invalid |
| `AUTH_004` | User not found |
| `AUTH_005` | Email already exists |
| `BOOK_001` | Book not found |
| `BOOK_002` | Insufficient stock |
| `ORDER_001` | Order not found |
| `ORDER_002` | Order cannot be cancelled |
| `PAYMENT_001` | Payment failed |
| `PAYMENT_002` | Payment expired |
| `VOUCHER_001` | Voucher not found |
| `VOUCHER_002` | Voucher expired |
| `VOUCHER_003` | Voucher usage limit exceeded |
| `VALIDATION_001` | Request validation failed |
| `PERMISSION_001` | Insufficient permissions |
| `RATE_LIMIT_001` | Rate limit exceeded |
| `SERVER_001` | Internal server error |

---

## Rate Limiting

| Endpoint | Rate Limit |
|----------|------------|
| Authentication endpoints | 5 requests/minute |
| Book search | 100 requests/minute |
| Cart operations | 60 requests/minute |
| Checkout | 10 requests/minute |
| Other endpoints | 60 requests/minute |

---

## File Upload Specifications

| File Type | Max Size | Allowed Formats |
|-----------|----------|-----------------|
| Book Cover | 2MB | JPG, PNG, WEBP |
| Book Gallery | 5MB | JPG, PNG, WEBP |
| User Avatar | 1MB | JPG, PNG |
| Category Image | 2MB | JPG, PNG, WEBP |
| Banner Image | 5MB | JPG, PNG, WEBP |

This comprehensive API documentation provides all necessary endpoints for building the E-Commerce Book Store application.