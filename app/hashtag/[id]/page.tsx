'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { OptimizedImage } from '@/components/optimized-image';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { MediaPopup } from '@/components/media-popup';

const mockHashtagData = {
  id: '1',
  name: 'Fashion',
  post_count: '200k',
  follower_count: '1.2M',
};

const mockHashtagPosts = [
  {
    id: '1',
    title: 'Summer Fashion Trends',
    image_url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Summer Fashion Trends',
    category_id: null,
    user_id: null,
    views: 45230,
    likes: 3421,
    comments: 234,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Streetwear Style',
    image_url: 'https://images.pexels.com/photos/1006991/pexels-photo-1006991.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Streetwear Style',
    category_id: null,
    user_id: null,
    views: 38920,
    likes: 2891,
    comments: 189,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Elegant Evening Wear',
    image_url: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Elegant Evening Wear',
    category_id: null,
    user_id: null,
    views: 52340,
    likes: 4123,
    comments: 312,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    title: 'Casual Chic',
    image_url: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Casual Chic',
    category_id: null,
    user_id: null,
    views: 31450,
    likes: 2234,
    comments: 156,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '5',
    title: 'Minimalist Fashion',
    image_url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Minimalist Fashion',
    category_id: null,
    user_id: null,
    views: 42180,
    likes: 3567,
    comments: 278,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '6',
    title: 'Vintage Style',
    image_url: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Vintage Style',
    category_id: null,
    user_id: null,
    views: 28340,
    likes: 1987,
    comments: 145,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Urban Fashion',
    image_url: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Urban Fashion',
    category_id: null,
    user_id: null,
    views: 36780,
    likes: 2678,
    comments: 201,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    title: 'High Fashion',
    image_url: 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'High Fashion',
    category_id: null,
    user_id: null,
    views: 49230,
    likes: 3890,
    comments: 289,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '9',
    title: 'Sporty Look',
    image_url: 'https://images.pexels.com/photos/2065203/pexels-photo-2065203.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sporty Look',
    category_id: null,
    user_id: null,
    views: 25670,
    likes: 1567,
    comments: 123,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '10',
    title: 'Boho Fashion',
    image_url: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Boho Fashion',
    category_id: null,
    user_id: null,
    views: 33450,
    likes: 2456,
    comments: 178,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '11',
    title: 'Professional Attire',
    image_url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Professional Attire',
    category_id: null,
    user_id: null,
    views: 27890,
    likes: 1798,
    comments: 134,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '12',
    title: 'Festival Fashion',
    image_url: 'https://images.pexels.com/photos/1006991/pexels-photo-1006991.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Festival Fashion',
    category_id: null,
    user_id: null,
    views: 40120,
    likes: 3124,
    comments: 245,
    created_at: '2024-01-15T00:00:00Z',
  },
];

export default function HashtagPage() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<typeof mockHashtagPosts[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const mostLikedPost = [...mockHashtagPosts].sort((a, b) => b.likes - a.likes)[0];
  const mostCommentedPost = [...mockHashtagPosts].sort((a, b) => b.comments - a.comments)[0];
  const mostViewedPost = [...mockHashtagPosts].sort((a, b) => b.views - a.views)[0];

  const handleImageClick = (post: typeof mockHashtagPosts[0], index: number) => {
    setSelectedImage(post);
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mockHashtagPosts.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(mockHashtagPosts[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (selectedIndex - 1 + mockHashtagPosts.length) % mockHashtagPosts.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(mockHashtagPosts[prevIndex]);
  };

  const handleTopPostClick = (post: typeof mockHashtagPosts[0]) => {
    const index = mockHashtagPosts.findIndex(p => p.id === post.id);
    handleImageClick(post, index);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                #{mockHashtagData.name}
              </h1>
              <p className="text-lg text-gray-600">
                {mockHashtagData.post_count} posts
              </p>
            </div>
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              variant={isFollowing ? 'outline' : 'default'}
              className={isFollowing ? 'border-gray-300 hover:bg-gray-50' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="group cursor-pointer"
                onClick={() => handleTopPostClick(mostLikedPost)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <OptimizedImage
                    src={mostLikedPost.image_url}
                    alt={mostLikedPost.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">{mostLikedPost.likes.toLocaleString()} likes</span>
                  <span className="text-gray-400">• Most Liked</span>
                </div>
              </div>

              <div
                className="group cursor-pointer"
                onClick={() => handleTopPostClick(mostCommentedPost)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <OptimizedImage
                    src={mostCommentedPost.image_url}
                    alt={mostCommentedPost.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">{mostCommentedPost.comments.toLocaleString()} comments</span>
                  <span className="text-gray-400">• Most Commented</span>
                </div>
              </div>

              <div
                className="group cursor-pointer"
                onClick={() => handleTopPostClick(mostViewedPost)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <OptimizedImage
                    src={mostViewedPost.image_url}
                    alt={mostViewedPost.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{mostViewedPost.views.toLocaleString()} views</span>
                  <span className="text-gray-400">• Most Viewed</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Posts</h2>
            <div className="masonry-grid-hashtag">
              {mockHashtagPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="masonry-item-hashtag group cursor-pointer relative overflow-hidden rounded-2xl"
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
      </div>


      <style jsx>{`
        .masonry-grid-hashtag {
          column-count: 4;
          column-gap: 1rem;
        }

        @media (max-width: 1280px) {
          .masonry-grid-hashtag {
            column-count: 3;
          }
        }

        @media (max-width: 1024px) {
          .masonry-grid-hashtag {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .masonry-grid-hashtag {
            column-count: 1;
          }
        }

        .masonry-item-hashtag {
          break-inside: avoid;
          margin-bottom: 1rem;
          display: inline-block;
          width: 100%;
        }

        .masonry-item-hashtag img {
          display: block;
          width: 100%;
        }
      `}</style>

      {dialogOpen && selectedImage && (
        <MediaPopup
          image={selectedImage}
          type="image"
          onClose={() => setDialogOpen(false)}
          onNext={selectedIndex < mockHashtagPosts.length - 1 ? handleNext : undefined}
          onPrevious={selectedIndex > 0 ? handlePrevious : undefined}
          hasNext={selectedIndex < mockHashtagPosts.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </>
  );
}
