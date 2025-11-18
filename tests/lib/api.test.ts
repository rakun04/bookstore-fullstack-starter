import { getBanners, getCategories, getFeaturedBooks, getFlashSaleBooks, searchBooks, getBookBySlug, getCategoryBySlug } from '@/lib/api'
import { Banner, Category, Book } from '@/types/api'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

// Helper function to create mock API response
const createMockResponse = <T>(data: T, success = true) => {
  return {
    ok: true,
    json: async () => ({
      data,
      success,
      pagination: {
        page: 1,
        limit: 10,
        total: Array.isArray(data) ? data.length : 1,
        totalPages: 1,
      },
    }),
  } as Response
}

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api'
  })

  describe('getBanners', () => {
    it('should fetch banners successfully', async () => {
      const mockBanners: Banner[] = [
        {
          id: '1',
          title: 'Summer Sale',
          description: 'Great deals on summer reads',
          imageUrl: '/banner1.jpg',
          ctaText: 'Shop Now',
          ctaLink: '/books',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(mockBanners))

      const result = await getBanners()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/banners?isActive=true',
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 600,
          }),
        })
      )
      expect(result.data).toEqual(mockBanners)
      expect(result.success).toBe(true)
    })

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)

      await expect(getBanners()).rejects.toThrow('API Error: 500 - Internal Server Error')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getBanners()).rejects.toThrow('Network error')
    })
  })

  describe('getCategories', () => {
    it('should fetch categories with default parameters', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Fiction',
          slug: 'fiction',
          description: 'Fiction books',
          bookCount: 150,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories))

      const result = await getCategories()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/categories',
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 1800,
          }),
        })
      )
      expect(result.data).toEqual(mockCategories)
    })

    it('should fetch categories with custom parameters', async () => {
      const mockCategories: Category[] = []

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories))

      await getCategories({ limit: 5, page: 2, parentId: '1' })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/categories?limit=5&page=2&parentId=1',
        expect.any(Object)
      )
    })
  })

  describe('getFeaturedBooks', () => {
    it('should fetch featured books with default limit', async () => {
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          slug: 'the-great-gatsby',
          description: 'A classic American novel',
          isbn: '978-0-7432-7356-5',
          author: 'F. Scott Fitzgerald',
          publisher: 'Scribner',
          publishYear: 1925,
          language: 'English',
          pages: 180,
          price: 12.99,
          stock: 50,
          coverImage: '/gatsby.jpg',
          images: ['/gatsby.jpg'],
          categories: [],
          rating: 4.5,
          reviewCount: 1000,
          isFeatured: true,
          onFlashSale: false,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(mockBooks))

      const result = await getFeaturedBooks()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?featured=true&limit=10&sortBy=popularity&sortOrder=desc',
        expect.any(Object)
      )
      expect(result.data).toEqual(mockBooks)
    })

    it('should fetch featured books with custom limit', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await getFeaturedBooks(5)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?featured=true&limit=5&sortBy=popularity&sortOrder=desc',
        expect.any(Object)
      )
    })
  })

  describe('getFlashSaleBooks', () => {
    it('should fetch flash sale books with default limit', async () => {
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'Sale Book',
          slug: 'sale-book',
          description: 'A book on sale',
          isbn: '978-0-7432-7356-6',
          author: 'Sale Author',
          price: 20.00,
          discountPrice: 15.00,
          stock: 10,
          coverImage: '/sale.jpg',
          images: ['/sale.jpg'],
          categories: [],
          rating: 4.0,
          reviewCount: 100,
          isFeatured: false,
          onFlashSale: true,
          flashSaleEndsAt: '2024-12-31T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce(createMockResponse(mockBooks))

      const result = await getFlashSaleBooks()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?onFlashSale=true&limit=8&sortBy=discountPrice&sortOrder=asc',
        expect.any(Object)
      )
      expect(result.data).toEqual(mockBooks)
    })

    it('should fetch flash sale books with custom limit', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await getFlashSaleBooks(3)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?onFlashSale=true&limit=3&sortBy=discountPrice&sortOrder=asc',
        expect.any(Object)
      )
    })
  })

  describe('searchBooks', () => {
    it('should search books with query', async () => {
      const mockBooks: Book[] = []

      mockFetch.mockResolvedValueOnce(createMockResponse(mockBooks))

      await searchBooks('gatsby')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?query=gatsby',
        expect.any(Object)
      )
    })

    it('should search books with additional parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await searchBooks('gatsby', {
        category: 'fiction',
        limit: 5,
        sortBy: 'price',
        sortOrder: 'asc',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books?query=gatsby&category=fiction&limit=5&sortBy=price&sortOrder=asc',
        expect.any(Object)
      )
    })
  })

  describe('getBookBySlug', () => {
    it('should fetch a book by slug', async () => {
      const mockBook: Book = {
        id: '1',
        title: 'Test Book',
        slug: 'test-book',
        description: 'A test book',
        isbn: '978-0-7432-7356-7',
        author: 'Test Author',
        price: 15.99,
        stock: 25,
        coverImage: '/test.jpg',
        images: ['/test.jpg'],
        categories: [],
        rating: 4.2,
        reviewCount: 50,
        isFeatured: false,
        onFlashSale: false,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce(createMockResponse(mockBook))

      const result = await getBookBySlug('test-book')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/books/slug/test-book',
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 600,
          }),
        })
      )
      expect(result.data).toEqual(mockBook)
    })
  })

  describe('getCategoryBySlug', () => {
    it('should fetch a category by slug', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category',
        bookCount: 25,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategory))

      const result = await getCategoryBySlug('test-category')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/categories/slug/test-category',
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 1800,
          }),
        })
      )
      expect(result.data).toEqual(mockCategory)
    })
  })

  describe('Environment variables', () => {
    it('should use custom API URL from environment', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.custom.com'

      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await getBanners()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.custom.com/banners?isActive=true',
        expect.any(Object)
      )
    })

    it('should use default API URL when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL

      mockFetch.mockResolvedValueOnce(createMockResponse([]))

      await getBanners()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/banners?isActive=true',
        expect.any(Object)
      )
    })
  })
})