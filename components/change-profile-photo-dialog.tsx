'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ChangeProfilePhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhotoUrl?: string;
  userName: string;
  userId?: string;
  onPhotoChange: (newPhotoUrl: string | null) => void;
}

export function ChangeProfilePhotoDialog({
  open,
  onOpenChange,
  currentPhotoUrl,
  userName,
  userId,
  onPhotoChange,
}: ChangeProfilePhotoDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, or WEBP image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast({
        title: 'Error',
        description: 'User ID is required for upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (currentPhotoUrl && currentPhotoUrl.includes('supabase')) {
        const oldFileName = currentPhotoUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldFileName]);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onPhotoChange(publicUrl);

      toast({
        title: 'Photo updated',
        description: 'Your profile photo has been successfully updated.',
      });

      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };


  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Change profile photo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={previewUrl || currentPhotoUrl}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gray-100 text-gray-600">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!selectedFile && (
            <>
              <Button
                onClick={() => {
                  toast({
                    title: 'Coming soon',
                    description: 'Camera functionality will be available soon.',
                  });
                }}
                disabled={isUploading}
                className="w-full justify-start gap-3"
                variant="ghost"
              >
                <Camera className="w-5 h-5" />
                Take a photo
              </Button>
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full justify-start gap-3"
                variant="ghost"
              >
                <Upload className="w-5 h-5" />
                Import a photo
              </Button>
            </>
          )}

          {selectedFile && (
            <>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Upload className="w-5 h-5" />
                {isUploading ? 'Uploading...' : 'Save photo'}
              </Button>
              <Button
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                disabled={isUploading}
                className="w-full justify-start gap-3"
                variant="ghost"
              >
                <X className="w-5 h-5" />
                Cancel
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          <p>Max size: 5MB</p>
          <p>Formats: JPG, PNG, WEBP</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
