'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const retryCountRef = useRef(0);

  const getOptimizedUrl = (url: string, w?: number, h?: number): string => {
    if (!url) return '';

    try {
      if (url.includes('pexels.com') || url.includes('images.pexels.com')) {
        const urlObj = new URL(url);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

        const params = new URLSearchParams();
        params.set('auto', 'compress');
        params.set('cs', 'tinysrgb');

        if (w) {
          params.set('w', Math.min(w, 1920).toString());
        }

        if (h) {
          params.set('h', Math.min(h, 1920).toString());
        }

        return `${baseUrl}?${params.toString()}`;
      }

      return url;
    } catch (e) {
      console.error('Error optimizing image URL:', e);
      return url;
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (retryCountRef.current === 0 && src !== currentSrc) {
      retryCountRef.current++;
      setCurrentSrc(src);
      setError(false);
      setIsLoaded(false);
    } else {
      setError(true);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setError(false);
    retryCountRef.current = 0;
  }, [src]);

  const optimizedSrc = getOptimizedUrl(src, width, height);

  if (!src) {
    return (
      <div className={cn('relative overflow-hidden bg-gray-100 flex items-center justify-center', className)}>
        <div className="text-gray-400 text-sm">No image</div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 text-xs p-2 text-center">
          <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Image unavailable</span>
        </div>
      )}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded && !error ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'w-full h-full object-cover',
          objectFit === 'contain' && 'max-w-full max-h-full object-contain',
          objectFit === 'fill' && 'w-full h-full object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'max-w-full max-h-full object-scale-down'
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
