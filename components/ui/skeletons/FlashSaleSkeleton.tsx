import { Skeleton } from '@/components/ui/skeleton';

export function FlashSaleSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-40 h-10 rounded-lg" />
              <Skeleton className="w-56 h-6 rounded-lg" />
            </div>
          </div>

          {/* Countdown Skeleton */}
          <div className="text-right space-y-1">
            <Skeleton className="w-24 h-4 rounded-lg ml-auto" />
            <div className="flex items-center gap-1">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-2 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-2 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-2 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Books Skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <div className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800/30 rounded-lg p-4 space-y-3">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                </div>
                <Skeleton className="w-24 h-5 rounded-full" />
              </div>

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
                <Skeleton className="w-8 h-4 rounded-lg" />
              </div>

              {/* Price Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-6 rounded-lg" />
                <Skeleton className="w-12 h-4 rounded-lg" />
              </div>

              {/* Progress Skeleton */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-12 h-4 rounded-lg" />
                  <Skeleton className="w-12 h-4 rounded-lg" />
                </div>
                <Skeleton className="w-full h-2 rounded-lg" />
              </div>

              {/* Category Skeleton */}
              <div className="flex gap-1">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="text-center">
        <Skeleton className="w-40 h-12 mx-auto rounded-lg" />
      </div>
    </div>
  );
}