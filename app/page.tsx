import type { Metadata } from "next";
import { Suspense } from 'react';
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { FlashSale } from "@/components/home/FlashSale";
import { HomePageClient } from "@/components/home/HomePageClient";
import { HeroSkeleton } from "@/components/ui/skeletons/HeroSkeleton";
import { CategoryGridSkeleton } from "@/components/ui/skeletons/CategoryGridSkeleton";
import { FeaturedBooksSkeleton } from "@/components/ui/skeletons/FeaturedBooksSkeleton";
import { FlashSaleSkeleton } from "@/components/ui/skeletons/FlashSaleSkeleton";
import { getBanners, getCategories, getFeaturedBooks, getFlashSaleBooks } from '@/lib/api';
import { Banner, Category, Book } from '@/types/api';
import { SiteHeader } from '@/components/site-header';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Home – Bookstore",
  description: "Discover your next great read at our online bookstore. Browse thousands of books across all genres, featuring bestsellers, new releases, and exclusive deals.",
  keywords: ["books", "bookstore", "online bookstore", "buy books", "bestsellers", "fiction", "non-fiction"],
  openGraph: {
    title: "Home – Bookstore",
    description: "Discover your next great read at our online bookstore",
    type: "website",
  },
};

// Data fetching functions with error handling
async function fetchBanners(): Promise<{ data: Banner[], error: boolean }> {
  try {
    const response = await getBanners();
    return { data: response.data || [], error: false };
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return { data: [], error: true };
  }
}

async function fetchCategories(): Promise<{ data: Category[], error: boolean }> {
  try {
    const response = await getCategories({ limit: 6 });
    return { data: response.data || [], error: false };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { data: [], error: true };
  }
}

async function fetchFeaturedBooks(): Promise<{ data: Book[], error: boolean }> {
  try {
    const response = await getFeaturedBooks(10);
    return { data: response.data || [], error: false };
  } catch (error) {
    console.error('Failed to fetch featured books:', error);
    return { data: [], error: true };
  }
}

async function fetchFlashSaleBooks(): Promise<{ data: Book[], error: boolean }> {
  try {
    const response = await getFlashSaleBooks(8);
    return { data: response.data || [], error: false };
  } catch (error) {
    console.error('Failed to fetch flash sale books:', error);
    return { data: [], error: true };
  }
}

// Homepage Component
export default async function HomePage() {
  // Parallel data fetching for optimal performance
  const [bannersResult, categoriesResult, featuredBooksResult, flashSaleBooksResult] = await Promise.all([
    fetchBanners(),
    fetchCategories(),
    fetchFeaturedBooks(),
    fetchFlashSaleBooks(),
  ]);

  const { data: banners, error: bannersError } = bannersResult;
  const { data: categories, error: categoriesError } = categoriesResult;
  const { data: featuredBooks, error: featuredBooksError } = featuredBooksResult;
  const { data: flashSaleBooks, error: flashSaleBooksError } = flashSaleBooksResult;

  return (
    <div className="min-h-screen bg-background">
      {/* Error Handler Component */}
      <HomePageClient
        errors={{
          banners: bannersError,
          categories: categoriesError,
          featuredBooks: featuredBooksError,
          flashSaleBooks: flashSaleBooksError,
        }}
      />

      {/* Site Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="mb-8">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroCarousel banners={banners} />
        </Suspense>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-16">
        {/* Search Section */}
        <section>
          <SearchBar />
        </section>

        {/* Categories Section */}
        <section>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid categories={categories} />
          </Suspense>
        </section>

        {/* Featured Books Section */}
        <section>
          <Suspense fallback={<FeaturedBooksSkeleton />}>
            <FeaturedBooks books={featuredBooks} />
          </Suspense>
        </section>

        {/* Flash Sale Section */}
        {flashSaleBooks.length > 0 && (
          <section>
            <Suspense fallback={<FlashSaleSkeleton />}>
              <FlashSale books={flashSaleBooks} />
            </Suspense>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t mt-16">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">About Bookstore</h3>
              <p className="text-muted-foreground text-sm">
                Your destination for great reads. Discover thousands of books across all genres.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/books" className="hover:text-foreground">All Books</a></li>
                <li><a href="/categories" className="hover:text-foreground">Categories</a></li>
                <li><a href="/bestsellers" className="hover:text-foreground">Bestsellers</a></li>
                <li><a href="/new-releases" className="hover:text-foreground">New Releases</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="/shipping" className="hover:text-foreground">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-foreground">Returns</a></li>
                <li><a href="/contact" className="hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/newsletter" className="hover:text-foreground">Newsletter</a></li>
                <li><a href="/social" className="hover:text-foreground">Social Media</a></li>
                <li><a href="/events" className="hover:text-foreground">Author Events</a></li>
                <li><a href="/blog" className="hover:text-foreground">Book Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Bookstore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}