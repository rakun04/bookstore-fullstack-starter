import { ApiResponse, Banner, Book, Category, BookSearchParams, CategoryParams } from '@/types/api';

// API Base URL - Configure this in your environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 300, // Revalidate every 5 minutes
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Banner API
export async function getBanners(): Promise<ApiResponse<Banner[]>> {
  return apiRequest<Banner[]>('/banners?isActive=true', {
    next: { revalidate: 600 }, // Banners change less frequently
  });
}

// Category API
export async function getCategories(params?: CategoryParams): Promise<ApiResponse<Category[]>> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.parentId) searchParams.append('parentId', params.parentId);

  const query = searchParams.toString() ? `?${searchParams}` : '';
  return apiRequest<Category[]>(`/categories${query}`, {
    next: { revalidate: 1800 }, // Categories change moderately
  });
}

// Books API
export async function getBooks(params?: BookSearchParams): Promise<ApiResponse<Book[]>> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.query) searchParams.append('query', params.query);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.author) searchParams.append('author', params.author);
  if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
  if (params?.onFlashSale !== undefined) searchParams.append('onFlashSale', params.onFlashSale.toString());

  const query = searchParams.toString() ? `?${searchParams}` : '';
  return apiRequest<Book[]>(`/books${query}`, {
    next: { revalidate: 300 }, // Books can change frequently
  });
}

// Featured Books
export async function getFeaturedBooks(limit = 10): Promise<ApiResponse<Book[]>> {
  return getBooks({
    featured: true,
    limit,
    sortBy: 'popularity',
    sortOrder: 'desc',
  });
}

// Flash Sale Books
export async function getFlashSaleBooks(limit = 8): Promise<ApiResponse<Book[]>> {
  return getBooks({
    onFlashSale: true,
    limit,
    sortBy: 'discountPrice',
    sortOrder: 'asc',
  });
}

// Search Books
export async function searchBooks(query: string, params?: Omit<BookSearchParams, 'query'>): Promise<ApiResponse<Book[]>> {
  return getBooks({
    ...params,
    query,
  });
}

// Get single book by slug
export async function getBookBySlug(slug: string): Promise<ApiResponse<Book>> {
  return apiRequest<Book>(`/books/slug/${slug}`, {
    next: { revalidate: 600 },
  });
}

// Get single category by slug
export async function getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
  return apiRequest<Category>(`/categories/slug/${slug}`, {
    next: { revalidate: 1800 },
  });
}