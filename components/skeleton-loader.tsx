import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function SkeletonLoader({ className, variant = 'rectangular' }: SkeletonLoaderProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 space-y-3">
      <SkeletonLoader variant="rectangular" className="h-48 w-full" />
      <div className="space-y-2">
        <SkeletonLoader variant="text" className="h-4 w-3/4" />
        <SkeletonLoader variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonLoader variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" className="h-4 w-2/3" />
            <SkeletonLoader variant="text" className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
