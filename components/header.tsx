'use client';

import { memo, useCallback, useState } from 'react';
import { Search, User, Bell, MessageCircle, ShoppingCart, MapPin, Heart, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProfileMenu } from '@/components/profile-menu';
import { NotificationsPopup } from '@/components/notifications-popup';
import { CartPopup } from '@/components/cart-popup';
import { useCart } from '@/lib/cart-context';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { ImageFilterDialog } from '@/components/image-filter-dialog';
import { VideoEditorDialog } from '@/components/video-editor-dialog';
import { PostDetailsDialog } from '@/components/post-details-dialog';

export const Header = memo(function Header() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, itemCount, isCartOpen, setIsCartOpen } = useCart();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [videoEditorOpen, setVideoEditorOpen] = useState(false);
  const [postDetailsOpen, setPostDetailsOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [processedMediaUrl, setProcessedMediaUrl] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [videoTrimData, setVideoTrimData] = useState({ start: 0, end: 0 });

  const handleMessagesClick = useCallback(() => {
    router.push('/messages');
  }, [router]);

  const handleShopClick = useCallback(() => {
    router.push('/shop');
  }, [router]);

  const handleMapClick = useCallback(() => {
    router.push('/map');
  }, [router]);

  const handleWishlistClick = useCallback(() => {
    router.push('/wishlist');
  }, [router]);

  const handleCreatePostClick = useCallback(() => {
    setUploadDialogOpen(true);
  }, []);

  const handleMediaSelected = useCallback((file: File, type: 'image' | 'video') => {
    setCurrentFile(file);
    setMediaType(type);
    setUploadDialogOpen(false);

    if (type === 'image') {
      setFilterDialogOpen(true);
    } else {
      setVideoEditorOpen(true);
    }
  }, []);

  const handleFilterNext = useCallback((imageUrl: string, filter: string) => {
    setProcessedMediaUrl(imageUrl);
    setSelectedFilter(filter);
    setFilterDialogOpen(false);
    setPostDetailsOpen(true);
  }, []);

  const handleVideoNext = useCallback((videoUrl: string, start: number, end: number) => {
    setProcessedMediaUrl(videoUrl);
    setVideoTrimData({ start, end });
    setVideoEditorOpen(false);
    setPostDetailsOpen(true);
  }, []);

  const handleBackToUpload = useCallback(() => {
    setFilterDialogOpen(false);
    setVideoEditorOpen(false);
    setUploadDialogOpen(true);
  }, []);

  const handleBackToEditor = useCallback(() => {
    setPostDetailsOpen(false);
    if (mediaType === 'image') {
      setFilterDialogOpen(true);
    } else {
      setVideoEditorOpen(true);
    }
  }, [mediaType]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Type to search"
              className="pl-10 pr-12 h-12 rounded-full border-gray-200 focus-visible:ring-emerald-500"
            />
            <button
              onClick={handleMapClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={handleCreatePostClick}
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full w-10 h-10">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <NotificationsPopup />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={handleMessagesClick}
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={handleWishlistClick}
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </Button>

          <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <CartPopup
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onClose={() => setIsCartOpen(false)}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full w-12 h-12 overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  <AvatarFallback className="bg-black text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <ProfileMenu />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CreatePostDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onMediaSelected={handleMediaSelected}
      />

      <ImageFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        imageFile={currentFile}
        onNext={handleFilterNext}
        onBack={handleBackToUpload}
      />

      <VideoEditorDialog
        open={videoEditorOpen}
        onOpenChange={setVideoEditorOpen}
        videoFile={currentFile}
        onNext={handleVideoNext}
        onBack={handleBackToUpload}
      />

      <PostDetailsDialog
        open={postDetailsOpen}
        onOpenChange={setPostDetailsOpen}
        mediaUrl={processedMediaUrl}
        mediaType={mediaType}
        filter={selectedFilter}
        videoStart={videoTrimData.start}
        videoEnd={videoTrimData.end}
        onBack={handleBackToEditor}
      />
    </header>
  );
});
