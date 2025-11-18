"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';

interface HomePageClientProps {
  errors: {
    banners?: boolean;
    categories?: boolean;
    featuredBooks?: boolean;
    flashSaleBooks?: boolean;
  };
}

export function HomePageClient({ errors }: HomePageClientProps) {
  useEffect(() => {
    // Show toast notifications for any errors
    if (errors.banners) {
      toast.error('Failed to load banners');
    }
    if (errors.categories) {
      toast.error('Failed to load categories');
    }
    if (errors.featuredBooks) {
      toast.error('Failed to load featured books');
    }
    if (errors.flashSaleBooks) {
      toast.error('Failed to load flash sale books');
    }
  }, [errors]);

  return null; // This component only handles error display
}