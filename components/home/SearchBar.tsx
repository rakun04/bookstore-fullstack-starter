"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search for books, authors, or genres..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to search page with query parameter
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/30 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Your Next Great Read
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Search through thousands of books across all genres
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-12 pr-4 py-3 text-base h-auto border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                aria-label="Search books"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
            >
              {isLoading ? 'Searching...' : 'Search Books'}
            </Button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Popular searches:
          </p>
          <div className="flex flex-wrap gap-2">
            {['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Biography'].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(term);
                  router.push(`/search?query=${encodeURIComponent(term)}`);
                }}
                className="text-xs border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}