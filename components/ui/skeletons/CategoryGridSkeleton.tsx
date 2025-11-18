import { Skeleton } from '@/components/ui/skeleton';

export function CategoryGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="w-64 h-10 mx-auto rounded-lg" />
        <Skeleton className="w-96 h-6 mx-auto rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="text-center space-y-3">
            {/* Icon Skeleton */}
            <Skeleton className="w-16 h-16 mx-auto rounded-full" />

            {/* Name Skeleton */}
            <Skeleton className="w-20 h-6 mx-auto rounded-lg" />

            {/* Badge Skeleton */}
            <Skeleton className="w-16 h-5 mx-auto rounded-full" />

            {/* Description Skeleton */}
            <Skeleton className="w-24 h-4 mx-auto rounded-lg" />
          </div>
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="text-center mt-8">
        <Skeleton className="w-32 h-12 mx-auto rounded-lg" />
      </div>
    </div>
  );
}