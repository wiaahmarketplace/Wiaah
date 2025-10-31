'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { OptimizedImage } from '@/components/optimized-image';
import { MediaPopup } from '@/components/media-popup';

const mockLocationData = {
  id: '1',
  city: 'New York',
  country: 'United States',
  image_url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=200',
};

const mockLocationPosts = [
  {
    id: '1',
    title: 'Times Square at Night',
    image_url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Times Square at Night',
    category_id: null,
    user_id: null,
    views: 2456,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Central Park',
    image_url: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Central Park',
    category_id: null,
    user_id: null,
    views: 1834,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Brooklyn Bridge',
    image_url: 'https://images.pexels.com/photos/1486976/pexels-photo-1486976.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Brooklyn Bridge',
    category_id: null,
    user_id: null,
    views: 3421,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Statue of Liberty',
    image_url: 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Statue of Liberty',
    category_id: null,
    user_id: null,
    views: 2891,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '5',
    title: 'Manhattan Skyline',
    image_url: 'https://images.pexels.com/photos/1325772/pexels-photo-1325772.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Manhattan Skyline',
    category_id: null,
    user_id: null,
    views: 4123,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Fifth Avenue',
    image_url: 'https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Fifth Avenue',
    category_id: null,
    user_id: null,
    views: 1956,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Empire State Building',
    image_url: 'https://images.pexels.com/photos/2893733/pexels-photo-2893733.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Empire State Building',
    category_id: null,
    user_id: null,
    views: 3678,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    title: 'NYC Street Life',
    image_url: 'https://images.pexels.com/photos/1122528/pexels-photo-1122528.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'NYC Street Life',
    category_id: null,
    user_id: null,
    views: 2234,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '9',
    title: 'Flatiron Building',
    image_url: 'https://images.pexels.com/photos/1486541/pexels-photo-1486541.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Flatiron Building',
    category_id: null,
    user_id: null,
    views: 1567,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '10',
    title: 'NYC at Dusk',
    image_url: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'NYC at Dusk',
    category_id: null,
    user_id: null,
    views: 2987,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '11',
    title: 'Hudson River View',
    image_url: 'https://images.pexels.com/photos/2224861/pexels-photo-2224861.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Hudson River View',
    category_id: null,
    user_id: null,
    views: 1798,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '12',
    title: 'Grand Central Terminal',
    image_url: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Grand Central Terminal',
    category_id: null,
    user_id: null,
    views: 2456,
    created_at: '2024-01-15T00:00:00Z',
  },
];

export default function LocationPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<typeof mockLocationPosts[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (post: typeof mockLocationPosts[0], index: number) => {
    setSelectedImage(post);
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mockLocationPosts.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(mockLocationPosts[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (selectedIndex - 1 + mockLocationPosts.length) % mockLocationPosts.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(mockLocationPosts[prevIndex]);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockLocationData.city}, {mockLocationData.country}
            </h1>
            <p className="text-lg text-gray-600">
              {mockLocationPosts.length} posts
            </p>
          </div>

          <div className="masonry-grid-location">
            {mockLocationPosts.map((post, index) => (
              <div
                key={post.id}
                className="masonry-item-location group cursor-pointer relative overflow-hidden rounded-2xl"
                onClick={() => handleImageClick(post, index)}
              >
                <OptimizedImage
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>


      <style jsx>{`
        .masonry-grid-location {
          column-count: 4;
          column-gap: 1rem;
        }

        @media (max-width: 1280px) {
          .masonry-grid-location {
            column-count: 3;
          }
        }

        @media (max-width: 1024px) {
          .masonry-grid-location {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .masonry-grid-location {
            column-count: 1;
          }
        }

        .masonry-item-location {
          break-inside: avoid;
          margin-bottom: 1rem;
          display: inline-block;
          width: 100%;
        }

        .masonry-item-location img {
          display: block;
          width: 100%;
        }
      `}</style>

      {dialogOpen && selectedImage && (
        <MediaPopup
          image={selectedImage}
          type="image"
          onClose={() => setDialogOpen(false)}
          onNext={selectedIndex < mockLocationPosts.length - 1 ? handleNext : undefined}
          onPrevious={selectedIndex > 0 ? handlePrevious : undefined}
          hasNext={selectedIndex < mockLocationPosts.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </>
  );
}
