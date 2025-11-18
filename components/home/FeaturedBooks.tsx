import { Book } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Heart, ShoppingCart, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedBooksProps {
  books: Book[];
  className?: string;
}

function BookCard({ book }: { book: Book }) {
  const discountPercentage = book.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-0 bg-white dark:bg-gray-800">
      <Link href={`/book/${book.slug}`}>
        <div className="p-4">
          {/* Book Cover */}
          <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 150px, 200px"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {book.isFeatured && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 p-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle quick add to cart
                }}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white/30 p-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle quick add to wishlist
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Book Information */}
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {book.author}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(book.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {book.rating.toFixed(1)} ({book.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {book.discountPrice ? (
                <>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    ${book.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${book.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {category.name}
                </Badge>
              ))}
              {book.categories.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{book.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function FeaturedBooks({ books, className }: FeaturedBooksProps) {
  if (!books || books.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No featured books available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Books
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Handpicked selections by our editorial team
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
        >
          <Link href="/books?featured=true">
            View All Featured
          </Link>
        </Button>
      </div>

      {/* Horizontal Scroll Carousel */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem
              key={book.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <BookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious className="left-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg" />
        <CarouselNext className="right-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg" />
      </Carousel>
    </div>
  );
}