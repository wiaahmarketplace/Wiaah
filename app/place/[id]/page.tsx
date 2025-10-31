'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OptimizedImage } from '@/components/optimized-image';
import { MapPin } from 'lucide-react';
import { MediaPopup } from '@/components/media-popup';

const mockPlaceData = {
  id: '1',
  name: 'The Blushing Crate',
  address: '3807 Ruckman Road, Oklahoma City',
  type: 'Bar',
  owner_name: 'John Doe',
  owner_avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  description: 'A cozy neighborhood bar with craft cocktails and live music',
};

const mockPlacePosts = [
  {
    id: '1',
    title: 'Amazing night at the bar!',
    image_url: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Amazing night at the bar!',
    category_id: null,
    user_id: null,
    views: 245,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Great atmosphere',
    image_url: 'https://images.pexels.com/photos/1089932/pexels-photo-1089932.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Great atmosphere',
    category_id: null,
    user_id: null,
    views: 189,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Cocktail hour',
    image_url: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Cocktail hour',
    category_id: null,
    user_id: null,
    views: 321,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Live music night',
    image_url: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Live music night',
    category_id: null,
    user_id: null,
    views: 412,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '5',
    title: 'Happy hour specials',
    image_url: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Happy hour specials',
    category_id: null,
    user_id: null,
    views: 267,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Weekend vibes',
    image_url: 'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Weekend vibes',
    category_id: null,
    user_id: null,
    views: 356,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'New menu items',
    image_url: 'https://images.pexels.com/photos/681847/pexels-photo-681847.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'New menu items',
    category_id: null,
    user_id: null,
    views: 198,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    title: 'Sunday brunch',
    image_url: 'https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sunday brunch',
    category_id: null,
    user_id: null,
    views: 289,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '9',
    title: 'Craft beer selection',
    image_url: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Craft beer selection',
    category_id: null,
    user_id: null,
    views: 234,
    created_at: '2024-01-15T00:00:00Z',
  },
];

export default function PlacePage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<typeof mockPlacePosts[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (post: typeof mockPlacePosts[0], index: number) => {
    setSelectedImage(post);
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mockPlacePosts.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(mockPlacePosts[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (selectedIndex - 1 + mockPlacePosts.length) % mockPlacePosts.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(mockPlacePosts[prevIndex]);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={mockPlaceData.owner_avatar} />
                <AvatarFallback>{mockPlaceData.owner_name[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{mockPlaceData.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                    {mockPlaceData.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">{mockPlaceData.address}</p>
                </div>

                <p className="text-gray-700 mb-4">{mockPlaceData.description}</p>

                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{mockPlacePosts.length}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Posts from this place</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {mockPlacePosts.map((post, index) => (
              <div
                key={post.id}
                className="aspect-square cursor-pointer group relative overflow-hidden rounded-lg"
                onClick={() => handleImageClick(post, index)}
              >
                <OptimizedImage
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {dialogOpen && selectedImage && (
        <MediaPopup
          image={selectedImage}
          type="image"
          onClose={() => setDialogOpen(false)}
          onNext={selectedIndex < mockPlacePosts.length - 1 ? handleNext : undefined}
          onPrevious={selectedIndex > 0 ? handlePrevious : undefined}
          hasNext={selectedIndex < mockPlacePosts.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </>
  );
}
