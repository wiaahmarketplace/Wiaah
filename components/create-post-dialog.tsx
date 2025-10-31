'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Image as ImageIcon } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaSelected: (file: File, type: 'image' | 'video') => void;
}

export function CreatePostDialog({ open, onOpenChange, onMediaSelected }: CreatePostDialogProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      onMediaSelected(file, 'image');
    } else if (fileType.startsWith('video/')) {
      onMediaSelected(file, 'video');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-[600px] flex flex-col items-center justify-center p-12 transition-colors ${
            isDragging ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <ImageIcon className="w-20 h-20 text-gray-300" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Drop your media here, or{' '}
              <label className="text-emerald-500 cursor-pointer hover:text-emerald-600">
                browse
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </h3>

            <p className="text-gray-500 text-sm">
              SUPPORTS: JPEG, JPG, PNG, MP4, MOV
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
