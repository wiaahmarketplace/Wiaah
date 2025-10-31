'use client';

import { useState } from 'react';
import { Image as ImageType } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { OptimizedImage } from './optimized-image';
import { MediaPopup } from './media-popup';

interface ImageGalleryProps {
  images: ImageType[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
  };

  const currentIndex = selectedImage ? images.findIndex(img => img.id === selectedImage.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < images.length - 1;
  const hasPrevious = currentIndex !== -1 && currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setSelectedImage(images[currentIndex - 1]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-6 max-w-[1600px] mx-auto">
        {images.map((image, index) => {
          const patterns = [
            { col: 2, row: 2 },
            { col: 1, row: 1 },
            { col: 1, row: 1 },
            { col: 1, row: 1 },
            { col: 1, row: 1 },
            { col: 2, row: 1 },
            { col: 1, row: 1 },
            { col: 1, row: 2 },
            { col: 1, row: 1 },
            { col: 1, row: 1 },
          ];

          const pattern = patterns[index % patterns.length];
          const isLarge = pattern.col === 2 || pattern.row === 2;

          return (
            <div
              key={image.id}
              onClick={() => handleImageClick(image)}
              className={cn(
                'group relative overflow-hidden rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl bg-gray-100'
              )}
              style={{
                gridColumn: `span ${pattern.col}`,
                gridRow: `span ${pattern.row}`,
                aspectRatio: pattern.col === 2 && pattern.row === 2 ? '1/1' : pattern.col === 2 ? '2/1' : pattern.row === 2 ? '1/2' : '1/1'
              }}
            >
              <OptimizedImage
                src={image.image_url}
                alt={image.title}
                className="w-full h-full"
                width={isLarge ? 800 : 400}
                height={isLarge ? 800 : 400}
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-white/90 text-xs line-clamp-1">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1 text-white/80 text-xs">
                  <span>{image.views} views</span>
                  <span>{new Date(image.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <MediaPopup
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={hasNext ? handleNext : undefined}
          onPrevious={hasPrevious ? handlePrevious : undefined}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />
      )}
    </>
  );
}
