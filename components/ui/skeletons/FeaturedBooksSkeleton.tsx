import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedBooksSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-10 rounded-lg" />
            <Skeleton className="w-64 h-6 rounded-lg" />
          </div>
        </div>

        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>

      {/* Books Carousel Skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
              {/* Cover Skeleton */}
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />

              {/* Title Skeleton */}
              <Skeleton className="w-full h-6 rounded-lg" />
              <Skeleton className="w-3/4 h-4 rounded-lg" />

              {/* Rating Skeleton */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-3 h-3 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="w-12 h-4 rounded-lg" />
              </div>

              {/* Price Skeleton */}
              <Skeleton className="w-20 h-6 rounded-lg" />

              {/* Category Skeleton */}
              <div className="flex gap-1">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}