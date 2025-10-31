'use client';

import { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

export function LazyImage({ src, alt, placeholderSrc, className, ...props }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const entry = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const isVisible = !!entry?.isIntersecting;

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : placeholderSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        error && 'bg-gray-200',
        className
      )}
      {...props}
    />
  );
}
