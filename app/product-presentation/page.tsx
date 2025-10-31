'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShopSidebar } from '@/components/shop-sidebar';
import { OptimizedImage } from '@/components/optimized-image';
import { Header } from '@/components/header';

export default function ProductPresentationPage() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleFileUpload = (file: File, type: 'banner' | 'gallery') => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'banner') {
        setBannerImage(result);
      } else {
        setGalleryImages([...galleryImages, result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingBanner(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, 'banner');
    }
  };

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file, 'gallery'));
  };

  const handleBannerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingBanner(true);
  };

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGallery(true);
  };

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'banner');
    }
  };

  const handleGalleryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => handleFileUpload(file, 'gallery'));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="product-presentation" />

        <div className="flex-1 p-8 bg-gray-50 overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Presentation</h1>
            <p className="text-gray-600">Customize how your shop and products are displayed to customers.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Shop Banner</h2>
              <div className="space-y-4">
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerInputChange}
                  className="hidden"
                />
                {bannerImage ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <OptimizedImage
                      src={bannerImage}
                      alt="Shop banner"
                      width={800}
                      height={256}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setBannerImage(null)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    onDrop={handleBannerDrop}
                    onDragOver={handleBannerDragOver}
                    onDragLeave={() => setIsDraggingBanner(false)}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDraggingBanner
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Shop Description</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shop-title">Shop Title</Label>
                  <Input
                    id="shop-title"
                    placeholder="Enter your shop title"
                    defaultValue="My Awesome Shop"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="shop-description">Description</Label>
                  <Textarea
                    id="shop-description"
                    placeholder="Describe your shop and products..."
                    rows={5}
                    defaultValue="Welcome to our shop! We offer high-quality products with excellent customer service."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Product Gallery</h2>
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryInputChange}
                className="hidden"
              />
              <div
                onDrop={handleGalleryDrop}
                onDragOver={handleGalleryDragOver}
                onDragLeave={() => setIsDraggingGallery(false)}
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${
                  isDraggingGallery ? 'bg-blue-50 rounded-lg p-4' : ''
                }`}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <OptimizedImage
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Add Image</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Shop Policies</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="return-policy">Return Policy</Label>
                  <Textarea
                    id="return-policy"
                    placeholder="Describe your return policy..."
                    rows={3}
                    defaultValue="30-day return policy for all unused items in original packaging."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="shipping-info">Shipping Information</Label>
                  <Textarea
                    id="shipping-info"
                    placeholder="Describe your shipping options..."
                    rows={3}
                    defaultValue="Free shipping on orders over 50€. Standard delivery in 3-5 business days."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-black hover:bg-gray-800 text-white">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
