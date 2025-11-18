import { Category } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Grid3x3, TrendingUp, Heart, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

// Default category icons based on category name or slug
const getCategoryIcon = (categoryName: string, categorySlug: string) => {
  const name = categoryName.toLowerCase();
  const slug = categorySlug.toLowerCase();

  if (name.includes('fiction') || slug.includes('fiction')) return Grid3x3;
  if (name.includes('mystery') || slug.includes('mystery')) return Clock;
  if (name.includes('romance') || slug.includes('romance')) return Heart;
  if (name.includes('bestseller') || slug.includes('bestseller')) return TrendingUp;
  if (name.includes('award') || slug.includes('award')) return Star;

  return Book; // Default icon
};

const getCategoryColor = (categorySlug: string) => {
  const slug = categorySlug.toLowerCase();

  if (slug.includes('fiction')) return 'from-purple-500 to-pink-500';
  if (slug.includes('mystery')) return 'from-gray-700 to-gray-900';
  if (slug.includes('romance')) return 'from-pink-500 to-red-500';
  if (slug.includes('science')) return 'from-blue-500 to-cyan-500';
  if (slug.includes('business')) return 'from-green-500 to-emerald-500';
  if (slug.includes('history')) return 'from-amber-500 to-orange-500';
  if (slug.includes('biography')) return 'from-indigo-500 to-purple-500';
  if (slug.includes('children')) return 'from-yellow-400 to-orange-500';

  return 'from-blue-500 to-indigo-500'; // Default gradient
};

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Book className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our wide collection of books across various genres and categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name, category.slug);
          const gradientColor = getCategoryColor(category.slug);

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white dark:bg-gray-800 hover:-translate-y-1">
                {/* Category Icon */}
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${gradientColor} p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Category Image (if available) */}
                {category.imageUrl && (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>

                {/* Book Count Badge */}
                <Badge variant="secondary" className="text-xs">
                  {category.bookCount} books
                </Badge>

                {/* Description (truncate for preview) */}
                {category.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Hover Indicator */}
                <div className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore →
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* View All Categories Button */}
      <div className="text-center mt-8">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
        >
          <Link href="/categories">
            View All Categories
          </Link>
        </Button>
      </div>
    </div>
  );
}