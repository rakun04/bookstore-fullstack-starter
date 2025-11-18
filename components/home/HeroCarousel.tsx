"use client";

import { useState, useEffect } from 'react';
import { Banner } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

interface HeroCarouselProps {
  banners: Banner[];
  className?: string;
}

export function HeroCarousel({ banners, className }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!banners || banners.length === 0) {
    return (
      <div className={`w-full h-96 bg-muted flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-muted-foreground">No banners available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover opacity-40"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      priority
                    />
                  </div>

                  {/* Overlay Content */}
                  <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 lg:px-16">
                    <div className="max-w-4xl">
                      <Badge variant="secondary" className="mb-4 w-fit">
                        Featured
                      </Badge>

                      <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                        {banner.title}
                      </h1>

                      {banner.description && (
                        <p className="text-lg md:text-xl text-slate-200 mb-6 max-w-2xl">
                          {banner.description}
                        </p>
                      )}

                      {banner.ctaText && banner.ctaLink && (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            asChild
                            size="lg"
                            className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8 py-3"
                          >
                            <Link href={banner.ctaLink} className="inline-flex items-center gap-2">
                              {banner.ctaText}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-slate-900 text-base px-8 py-3"
                            asChild
                          >
                            <Link href="/books">
                              Browse All Books
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />

        {/* Dots Indicator */}
        {count > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  current === index + 1 ? 'bg-white w-8' : 'bg-white/50'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}