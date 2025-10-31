'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ImageFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onNext: (filteredImage: string, filter: string) => void;
  onBack: () => void;
}

const filters = [
  { name: 'Normal', filter: 'none' },
  { name: 'Clarendon', filter: 'contrast(1.2) saturate(1.35)' },
  { name: 'Gingham', filter: 'brightness(1.05) hue-rotate(-10deg)' },
  { name: 'Moon', filter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Lark', filter: 'contrast(0.9) brightness(1.1) saturate(1.2)' },
  { name: 'Reyes', filter: 'sepia(0.22) brightness(1.1) contrast(0.85)' },
  { name: 'Juno', filter: 'contrast(1.2) brightness(1.1) saturate(1.4)' },
  { name: 'Slumber', filter: 'saturate(0.66) brightness(1.05)' },
  { name: 'Crema', filter: 'sepia(0.5) contrast(1.25) brightness(1.15) saturate(0.9)' },
];

export function ImageFilterDialog({ open, onOpenChange, imageFile, onNext, onBack }: ImageFilterDialogProps) {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [imageUrl, setImageUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleNext = () => {
    onNext(imageUrl, selectedFilter);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[90vh]">
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-xl font-bold">New Post</h2>
            <Button
              onClick={handleNext}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Next
            </Button>
          </div>

          <div className="flex">
            <div className="flex-1 bg-black flex items-center justify-center p-8">
              <div className="relative max-w-full max-h-[500px]">
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ filter: selectedFilter }}
                  className="max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>

            <div className="w-80 border-l bg-white overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-4">Filters</h3>
                <div className="grid grid-cols-3 gap-3">
                  {filters.map((filterOption) => (
                    <button
                      key={filterOption.name}
                      onClick={() => setSelectedFilter(filterOption.filter)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        selectedFilter === filterOption.filter
                          ? 'border-emerald-500 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square">
                        <img
                          src={imageUrl}
                          alt={filterOption.name}
                          style={{ filter: filterOption.filter }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium text-center">
                          {filterOption.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
