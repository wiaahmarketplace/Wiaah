'use client';

import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageMessageProps {
  imageUrl: string;
  caption?: string;
  isUser: boolean;
  time: string;
}

export function ImageMessage({ imageUrl, caption, isUser, time }: ImageMessageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div
          className={cn(
            'rounded-2xl overflow-hidden max-w-sm cursor-pointer group relative',
            isUser ? '' : ''
          )}
          onClick={() => setIsOpen(true)}
        >
          <img
            src={imageUrl}
            alt="Shared image"
            className="w-full h-auto object-cover transition-transform group-hover:scale-105"
          />
          {caption && (
            <div
              className={cn(
                'px-4 py-2',
                isUser ? 'bg-gray-100' : 'bg-white border-t'
              )}
            >
              <p className="text-sm text-gray-900">{caption}</p>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1">{time}</span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative">
            <img
              src={imageUrl}
              alt="Full size image"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <a
              href={imageUrl}
              download
              className="absolute bottom-4 right-4 rounded-full bg-black/50 p-3 hover:bg-black/70 transition-colors"
            >
              <Download className="w-5 h-5 text-white" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
