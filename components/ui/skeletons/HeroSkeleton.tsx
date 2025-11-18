import { Skeleton } from '@/components/ui/skeleton';

export function HeroSkeleton() {
  return (
    <div className="w-full h-96 md:h-[500px] lg:h-[600px] bg-muted rounded-lg overflow-hidden">
      <div className="relative h-full">
        {/* Background Image Skeleton */}
        <Skeleton className="absolute inset-0 w-full h-full" />

        {/* Content Skeleton */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl space-y-4">
            {/* Badge Skeleton */}
            <Skeleton className="w-20 h-6 rounded-full" />

            {/* Title Skeleton */}
            <Skeleton className="w-full md:w-3/4 h-12 md:h-16 lg:h-20 rounded-lg" />

            {/* Description Skeleton */}
            <Skeleton className="w-full md:w-2/3 h-6 rounded-lg" />
            <Skeleton className="w-1/2 md:w-1/3 h-6 rounded-lg" />

            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Skeleton className="w-32 h-12 rounded-lg" />
              <Skeleton className="w-40 h-12 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Navigation Controls Skeleton */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        {/* Dots Indicator Skeleton */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-2 h-2 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}