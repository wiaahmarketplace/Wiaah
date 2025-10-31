'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProfilePhotoViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUrl: string;
  userName: string;
}

export function ProfilePhotoViewer({
  open,
  onOpenChange,
  photoUrl,
  userName,
}: ProfilePhotoViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-transparent border-none">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 rounded-full bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={photoUrl}
            alt={userName}
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
