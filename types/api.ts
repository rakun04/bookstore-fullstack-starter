// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  bookCount: number;
  createdAt: string;
  updatedAt: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string;
  isbn: string;
  author: string;
  publisher?: string;
  publishYear?: number;
  language: string;
  pages?: number;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    thickness: number;
  };
  price: number;
  discountPrice?: number;
  stock: number;
  coverImage: string;
  images: string[];
  categories: Category[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  onFlashSale: boolean;
  flashSaleEndsAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Parameters Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BookSearchParams extends PaginationParams {
  query?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'title' | 'price' | 'rating' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  onFlashSale?: boolean;
}

export interface CategoryParams extends PaginationParams {
  parentId?: string;
}

// Search Result Types
export interface SearchResult {
  books: Book[];
  categories: Category[];
  totalBooks: number;
  totalCategories: number;
}