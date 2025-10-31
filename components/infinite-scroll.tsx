'use client';

import { useRef, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { LoadingSpinner } from './loading-spinner';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  className,
}: InfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
  });

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  if (entry?.isIntersecting) {
    handleLoadMore();
  }

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
