"use client";

import { useState, useEffect } from 'react';
import { Book } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Heart, ShoppingCart, Zap, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import Image from 'next/image';
import Countdown from 'react-countdown';

interface FlashSaleProps {
  books: Book[];
  className?: string;
}

// Countdown renderer component
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return (
      <Badge variant="destructive" className="text-xs">
        Sale Ended
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {days > 0 && (
        <>
          <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-1 rounded">
            {days}d
          </span>
          <span className="text-red-500">:</span>
        </>
      )}
      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-1 rounded">
        {hours.toString().padStart(2, '0')}h
      </span>
      <span className="text-red-500">:</span>
      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-1 rounded">
        {minutes.toString().padStart(2, '0')}m
      </span>
      <span className="text-red-500">:</span>
      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-1 rounded">
        {seconds.toString().padStart(2, '0')}s
      </span>
    </div>
  );
};

function FlashSaleBookCard({ book }: { book: Book }) {
  const [progress, setProgress] = useState(75); // Simulated stock progress

  const discountPercentage = book.discountPrice
    ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-2 border-red-200 dark:border-red-800/30 bg-white dark:bg-gray-800">
      <Link href={`/book/${book.slug}`}>
        <div className="p-4">
          {/* Flash Sale Banner */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                Flash Sale
              </Badge>
            </div>

            {/* Countdown Timer */}
            {book.flashSaleEndsAt && (
              <Countdown
                date={new Date(book.flashSaleEndsAt)}
                renderer={CountdownRenderer}
              />
            )}
          </div>

          {/* Book Cover */}
          <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 150px, 200px"
            />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold">
                -{discountPercentage}%
              </Badge>
            )}

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
                {book.rating.toFixed(1)}
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

            {/* Stock Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  {book.stock} left
                </span>
                <span className="text-red-500 font-medium">
                  {progress}% sold
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
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
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function FlashSale({ books, className }: FlashSaleProps) {
  if (!books || books.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No flash sale books available</p>
      </div>
    );
  }

  // Find the earliest end date among all books
  const earliestEndDate = books
    .filter(book => book.flashSaleEndsAt)
    .reduce((earliest, book) => {
      const bookDate = new Date(book.flashSaleEndsAt!).getTime();
      const earliestDate = new Date(earliest).getTime();
      return bookDate < earliestDate ? book.flashSaleEndsAt! : earliest;
    }, books[0]?.flashSaleEndsAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Global Countdown */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Zap className="w-12 h-12 text-red-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Flash Sale
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Limited time offers on bestsellers
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              Sale ends in:
            </div>
            <Countdown
              date={new Date(earliestEndDate)}
              renderer={({ days, hours, minutes, seconds }) => (
                <div className="flex items-center gap-1 text-lg font-bold font-mono">
                  {days > 0 && (
                    <>
                      <span className="bg-red-500 text-white px-2 py-1 rounded">
                        {days}d
                      </span>
                      <span className="text-red-500">:</span>
                    </>
                  )}
                  <span className="bg-red-500 text-white px-2 py-1 rounded">
                    {hours.toString().padStart(2, '0')}h
                  </span>
                  <span className="text-red-500">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded">
                    {minutes.toString().padStart(2, '0')}m
                  </span>
                  <span className="text-red-500">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded">
                    {seconds.toString().padStart(2, '0')}s
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      {/* Books Grid */}
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
              <FlashSaleBookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious className="left-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg" />
        <CarouselNext className="right-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg" />
      </Carousel>

      {/* View All Button */}
      <div className="text-center">
        <Button
          asChild
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Link href="/books?onFlashSale=true">
            View All Flash Deals
            <Zap className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}