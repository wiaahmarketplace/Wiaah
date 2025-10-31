'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  priority?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  onClick?: () => void;
  onEnded?: () => void;
}

export const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      poster,
      className,
      autoPlay = false,
      loop = false,
      muted = false,
      playsInline = true,
      controls = false,
      priority = false,
      maxWidth = 1920,
      maxHeight = 1080,
      onClick,
      onEnded,
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [showPlayButton, setShowPlayButton] = useState(!autoPlay);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

    useEffect(() => {
      if (priority) {
        setVideoSrc(getOptimizedUrl(src, maxWidth, maxHeight));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '200px',
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [src, priority, maxWidth, maxHeight]);

    useEffect(() => {
      if (isInView && src) {
        setVideoSrc(getOptimizedUrl(src, maxWidth, maxHeight));
      }
    }, [isInView, src, maxWidth, maxHeight]);

    const getOptimizedUrl = (url: string, w: number, h: number): string => {
      if (!url) return '';

      if (url.includes('pexels.com/video-files')) {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const videoId = urlParts[urlParts.length - 2];

        if (w <= 640 && h <= 360) {
          return `https://videos.pexels.com/video-files/${videoId}/${videoId}-sd_360_640_25fps.mp4`;
        } else if (w <= 960 && h <= 540) {
          return `https://videos.pexels.com/video-files/${videoId}/${videoId}-sd_540_960_25fps.mp4`;
        } else if (w <= 1280 && h <= 720) {
          return `https://videos.pexels.com/video-files/${videoId}/${videoId}-hd_720_1280_25fps.mp4`;
        } else if (w <= 1920 && h <= 1080) {
          return `https://videos.pexels.com/video-files/${videoId}/${videoId}-hd_1080_1920_25fps.mp4`;
        }

        return url;
      }

      return url;
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setShowPlayButton(false);
    };

    const handlePause = () => {
      if (!autoPlay) {
        setShowPlayButton(true);
      }
    };

    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    const handlePlayButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
        videoRef.current.play();
        setShowPlayButton(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn('relative overflow-hidden bg-black', className)}
        onClick={handleClick}
      >
        {!isLoaded && poster && (
          <img
            src={poster}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!isLoaded && !poster && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {videoSrc && (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              className={cn(
                'w-full h-full transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={playsInline}
              controls={controls}
              onLoadedData={handleLoadedData}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={onEnded}
              preload={priority ? 'auto' : 'metadata'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />

            {showPlayButton && !controls && (
              <button
                onClick={handlePlayButtonClick}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-10"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110">
                  <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </button>
            )}
          </>
        )}
      </div>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';
