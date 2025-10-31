'use client';

import { useEffect, useState } from 'react';
import { mockCategories, mockImages, type Category, type Image } from '@/lib/mock-data';
import { StoriesCarousel } from '@/components/stories-carousel';
import { ImageGallery } from '@/components/image-gallery';
import { StoryViewer } from '@/components/story-viewer';
import { Header } from '@/components/header';

export default function Home() {
  const [categories] = useState<Category[]>(mockCategories);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  function fetchImages() {
    setLoading(true);

    setTimeout(() => {
      let filteredImages = mockImages;

      if (selectedCategory) {
        filteredImages = mockImages.filter(img => img.category_id === selectedCategory);
      }

      setImages(filteredImages);
      setLoading(false);
    }, 300);
  }

  const handleCategoryClick = (categoryId: string) => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      setCurrentStoryIndex(categoryIndex);
      setStoryViewerOpen(true);
    }
  };

  const stories = categories.map((category, index) => ({
    id: category.id,
    image_url: category.icon_url || 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg',
    username: category.name,
    avatar: category.icon_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '2h ago',
    type: (index === 1 || index === 4) ? ('video' as const) : ('image' as const),
    postId: category.id
  }));

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      {categories.length > 0 && (
        <div className="bg-white border-b overflow-x-hidden">
          <StoriesCarousel
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      )}

      <StoryViewer
        stories={stories}
        initialIndex={currentStoryIndex}
        open={storyViewerOpen}
        onOpenChange={setStoryViewerOpen}
        onViewPost={(postId) => {
          console.log('Viewing post:', postId);
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : images.length > 0 ? (
        <ImageGallery images={images} />
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <p className="text-lg">No images found</p>
          <p className="text-sm mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
