'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface StoriesCarouselProps {
  categories: Array<{
    id: string;
    name: string;
    icon_url: string | null;
  }>;
  selectedCategory?: string | null;
  onSelectCategory?: (categoryId: string | null) => void;
  onCategoryClick?: (categoryId: string) => void;
}

export function StoriesCarousel({
  categories,
  selectedCategory,
  onSelectCategory,
  onCategoryClick,
}: StoriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group overflow-x-hidden max-w-7xl mx-auto">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-12 justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className={cn(
              'flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all relative',
              selectedCategory === category.id
                ? 'ring-4 ring-emerald-500 scale-105'
                : 'hover:scale-105 ring-[3px] ring-emerald-400'
            )}
          >
            {category.icon_url ? (
              <img
                src={category.icon_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {category.name}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
